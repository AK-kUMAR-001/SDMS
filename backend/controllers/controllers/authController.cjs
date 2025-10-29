const { User, UserRole, Role, Permission } = require('../../models/models/index.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, profilePicture, phoneNumber, dateOfBirth, address, roleName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let role = await Role.findOne({ where: { name: roleName || 'student' } }); // Default to 'student' role
    if (!role) {
      // If the specified role doesn't exist, create it or handle the error
      // For now, let's default to 'student' if the provided roleName is invalid
      role = await Role.findOne({ where: { name: 'student' } });
      if (!role) {
        return res.status(500).json({ message: 'Default student role not found. Please create it first.' });
      }
    }

    const user = await User.create({
      username, email, password: hashedPassword, profilePicture, phoneNumber, dateOfBirth, address,
      roleId: role.id, // Assign the roleId directly to the user
      role: role.name // Also store role name for easier access, if desired
    });

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email: user.email, role: role.name } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  console.log('🔐 Login attempt received:', req.body);
  console.log('📧 Email:', req.body.email);
  console.log('🔑 Password provided:', req.body.password ? 'Yes' : 'No');
  
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: Role,
        as: 'roleDetails',
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] } // Exclude junction table attributes
        }]
      }]
    });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('📋 User details:', {
        id: user.id,
        email: user.email,
        password: user.password ? 'Has password' : 'No password',
        passwordLength: user.password ? user.password.length : 0
      });
    }
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('🔍 Starting password comparison...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('✅ Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('🎉 Login successful!');

    const userRoles = user.roleDetails ? [user.roleDetails.name] : [];
    const userPermissions = user.roleDetails && user.roleDetails.permissions ? 
                            user.roleDetails.permissions.map(p => ({ action: p.action, subject: p.subject })) : 
                            [];

    // Success - create token and response
    const token = jwt.sign(
      { id: user.id, email: user.email, roles: userRoles, permissions: userPermissions },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department, // Assuming department exists on user model
      status: user.status, // Assuming status exists on user model
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      role: userRoles.length > 0 ? userRoles[0] : null, // Primary role
      roles: userRoles,
      permissions: userPermissions
    };
    
    console.log('✅ Login successful for:', user.email);
    res.status(200).json({ token, user: userData });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Role,
        as: 'roleDetails',
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }]
      }],
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userRoles = user.roleDetails ? [user.roleDetails.name] : [];
    const userPermissions = user.roleDetails && user.roleDetails.permissions ? 
                            user.roleDetails.permissions.map(p => ({ action: p.action, subject: p.subject })) : 
                            [];

    const userData = {
      ...user.toJSON(),
      roles: userRoles,
      permissions: userPermissions
    };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, profilePicture, phoneNumber, dateOfBirth, address } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.address = address || user.address;
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
