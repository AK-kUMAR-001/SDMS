
const express = require('express');
 const path = require('path');
 const fs = require('fs');
 const jwt = require('jsonwebtoken');
 const bcrypt = require('bcrypt');
 const multer = require('multer');
 require('dotenv').config();
 
 const helmet = require('helmet');
 const rateLimit = require('express-rate-limit');
 const cors = require('cors');
 const morgan = require('morgan');
 const { sequelize, User, Role, Permission, Certificate, AuditLog, LeaderboardEntry } = require('./models/models/index.cjs');
 
 const app = express();
 const PORT = process.env.PORT || 3005;
 
 // Use leaderboard routes
 const leaderboardRoutes = require('./routes/routes/leaderboardRoutes.cjs');
 app.use('/api/v1/leaderboard', leaderboardRoutes);
 
 // Use analytics routes
 const analyticsRoutes = require('./routes/routes/analyticsRoutes.cjs');
 app.use('/api/v1/analytics', analyticsRoutes);
 
 
 // Logging middleware with daily rotation
 const logDirectory = path.join(__dirname, 'logs');
 fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
 const rfs = require('rotating-file-stream');
 const accessLogStream = rfs.createStream('access.log', {
   interval: '1d', // rotate daily
   path: logDirectory
 });
 app.use(morgan('combined', { stream: accessLogStream }));
 
 // Security middleware
 app.use(helmet());
 
 // Enforce HTTPS in production
 if (process.env.NODE_ENV === 'production') {
   app.use((req, res, next) => {
     if (req.headers['x-forwarded-proto'] !== 'https') {
       return res.redirect('https://' + req.headers.host + req.url);
     }
     next();
   });
 }
 
 // CORS middleware (restrict to allowed origins)
 const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
 app.use(cors({
   origin: function(origin, callback) {
     // allow requests with no origin (like mobile apps, curl, etc.)
     if (!origin) return callback(null, true);
     if (allowedOrigins.indexOf(origin) !== -1) {
       return callback(null, true);
     } else {
       return callback(new Error('Not allowed by CORS'));
     }
   },
   credentials: true
 }));
 
 // Rate limiting middleware (100 requests per 15 min per IP)
 const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false
 });
 app.use(limiter);
 
 // Middleware
 app.use(express.json());
 
 // Sanitize incoming URLs that include CRA placeholders like %PUBLIC_URL%
 // which appear in unbuilt `public/index.html`. Express/serve-static will
 // call decodeURIComponent on the URL and crash on malformed sequences.
 app.use((req, res, next) => {
   if (typeof req.url === 'string' && req.url.includes('%PUBLIC_URL%')) {
     req.url = req.url.replace(/%PUBLIC_URL%/g, '');
   }
   next();
 });
 
 // Serve static files from `dist` if it exists (production build).
 // Otherwise fall back to `public` for development (no build).
 const distPath = path.join(__dirname, 'dist');
 const publicPath = path.join(__dirname, 'public');
 if (fs.existsSync(distPath)) {
   app.use(express.static(distPath));
 } else {
   app.use(express.static(publicPath));
 }
 
 // Multer config for file uploads (secure, outside public directory)
 const uploadsBase = path.join(__dirname, 'private_uploads', 'certificates');
 const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     const dir = path.join(uploadsBase, req.body.studentId || 'temp');
     fs.mkdirSync(dir, { recursive: true });
     cb(null, dir);
   },
   filename: (req, file, cb) => {
     cb(null, Date.now() + '-' + file.originalname);
   }
 });
 const upload = multer({
   storage,
   fileFilter: (req, file, cb) => {
     if (file.mimetype === 'application/pdf') {
       cb(null, true);
     } else {
       cb(new Error('Only PDF files are allowed'));
     }
   },
   limits: { fileSize: 10 * 1024 * 1024 }
 });
 
 // Secure endpoint to download a certificate file (auth required)
 app.get('/api/v1/certificates/:id/download', authenticateJWT, async (req, res) => {
   try {
     const cert = await Certificate.findByPk(req.params.id);
     if (!cert || !cert.fileUrl) return res.status(404).json({ error: 'Certificate or file not found' });
     // Only allow owner or admin/reviewer
     if (req.user.userId !== cert.studentId && !req.user.roles.includes('admin') && !req.user.roles.includes('reviewer')) {
       return res.status(403).json({ error: 'Forbidden' });
     }
     const filePath = path.join(uploadsBase, String(cert.studentId), path.basename(cert.fileUrl));
     if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
     res.download(filePath);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });
 
 // Sync database
 sequelize.sync().then(() => {
   console.log('Database synced');
   console.log('Attempting to initialize routes and middleware...');
 }).catch(err => {
   console.error('Error syncing database:', err);
 });
 
 // Helper function to generate IDs (if needed)
 const generateId = () => {
   return 'id' + Math.random().toString(36).substr(2, 9);
 };
 
 // Auth routes
 
 
 // Use auth routes
 const authRoutes = require('./routes/routes/authRoutes.cjs');
 app.use('/api/v1', authRoutes);
 
 // Middleware for JWT
 function authenticateJWT(req, res, next) {
   const authHeader = req.headers.authorization;
   if (authHeader) {
     const token = authHeader.split(' ')[1];
     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
       if (err) return res.sendStatus(403);
       req.user = user;
       next();
     });
   } else {
     res.sendStatus(401);
   }
 }
 
 // Use user routes
 const userRoutes = require('./routes/routes/userRoutes.cjs');
 app.use('/api/v1/users', userRoutes);
 
 
 // Use certificate routes
 const certificateRoutes = require('./routes/routes/certificateRoutes.cjs');
 app.use('/api/v1/certificates', certificateRoutes);
 
 // Use audit log routes
 const auditLogRoutes = require('./routes/routes/auditLogRoutes.cjs');
 app.use('/api/v1/audit-logs', auditLogRoutes);
 // No update or delete endpoints for audit logs (immutable)
 
 // Serve the React app for any non-API routes
 app.get('*', (req, res) => {
   const indexInDist = path.join(distPath, 'index.html');
   const indexInPublic = path.join(publicPath, 'index.html');
   if (fs.existsSync(indexInDist)) {
     res.sendFile(indexInDist);
   } else if (fs.existsSync(indexInPublic)) {
     // Read the public index.html and replace CRA placeholders (%PUBLIC_URL%)
     // so references like %PUBLIC_URL%/manifest.json don't reach the browser
     // as literal % sequences (which break decoding).
     try {
       let html = fs.readFileSync(indexInPublic, 'utf8');
       html = html.replace(/%PUBLIC_URL%/g, '');
       res.type('html').send(html);
     } catch (err) {
       res.status(500).send('Failed to read public/index.html');
     }
   } else {
     res.status(404).send('No frontend build found. Run `npm run build` or place your static files in the public/ directory.');
   }
 });
 
 const HOST = process.env.HOST || '0.0.0.0';
 
 try {
   console.log('Attempting to start server...');
   const server = app.listen(PORT, HOST, () => {
     try {
       const addr = server.address();
       console.log(`Server started successfully on ${addr.family} ${addr.address}:${addr.port}`);
     } catch (e) {
       console.log(`Server started successfully on port ${PORT} (host ${HOST})`);
     }
   });
 
   server.on('error', (err) => {
     console.error('Server failed to start or encountered an error:', err && err.message ? err.message : err);
   });
 } catch (e) {
   console.error('Synchronous server startup error:', e && e.message ? e.message : e);
 }
 
 // Set secure cookie flags in production
 app.use((req, res, next) => {
   if (process.env.NODE_ENV === 'production') {
     res.cookie = ((orig) => (name, value, options = {}) => {
       options.secure = true;
       options.httpOnly = true;
       options.sameSite = 'strict';
       return orig.call(res, name, value, options);
     })(res.cookie);
   }
   next();
 });
 
 // Global error handler middleware (should be last)
 app.use((err, req, res, next) => {
   console.error('Global error handler:', err);
   if (res.headersSent) {
     return next(err);
   }
   res.status(err.status || 500).json({
     error: err.message || 'Internal Server Error',
     details: process.env.NODE_ENV === 'production' ? undefined : err.stack
   });
 });