import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

import { initDatabase } from './db/init.js';
import { createAuthRoutes } from './routes/auth.js';
import { createUserRoutes } from './routes/users.js';
import { createPieRoutes } from './routes/pies.js';
import { createReviewRoutes } from './routes/reviews.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9993;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../db/pietracker.db');
const SESSION_SECRET = process.env.SESSION_SECRET || 'pie-tracker-secret-change-in-production';

// Initialize database
console.log('Initializing database at:', DB_PATH);
const db = initDatabase(DB_PATH);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: false, // Set to true only if using HTTPS
      sameSite: 'lax'
    }
  })
);

// API routes
app.use('/api/auth', createAuthRoutes(db));
app.use('/api/users', createUserRoutes(db));
app.use('/api/pies', createPieRoutes(db));
app.use('/api/reviews', createReviewRoutes(db));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Pie Tracker server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
