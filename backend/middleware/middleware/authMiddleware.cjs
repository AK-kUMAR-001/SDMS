// JWT authentication middleware
const jwt = require('jsonwebtoken');
console.log('🔐 Initializing auth middleware...');
console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set in environment variables');
}

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing - cannot verify tokens');
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('⚠️  No token provided in Authorization header');
      return res.sendStatus(401);
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('❌ JWT verification failed:', err.message);
        return res.sendStatus(403);
      }
      
      console.log('✅ JWT verified successfully for user:', user.id);
      req.user = user;
      next();
    });
  } else {
    console.log('⚠️  No Authorization header provided');
    res.sendStatus(401);
  }
}

module.exports = { authenticateJWT };
