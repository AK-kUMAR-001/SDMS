const { User, UserRole, Role } = require('../../models/models/index.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    // Assign a default role, e.g., 'user'
    const userRole = await Role.findOne({ where: { name: 'user' } });
    if (userRole) {
      await UserRole.create({ userId: user.id, roleId: userRole.id });
    }
    res.status(201).json({ message: 'User registered successfully' });
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
    
    const user = await User.findOne({ where: { email } });
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
    // Success - create token and response
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'faculty' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      status: user.status,
      role: 'faculty',
      roles: ['faculty'],
      permissions: [{action: 'manage', subject: 'all'}]
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
      include: [{ model: UserRole, include: [Role] }],
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
