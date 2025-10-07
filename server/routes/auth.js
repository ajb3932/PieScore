import express from 'express';
import bcrypt from 'bcrypt';
import * as queries from '../db/queries.js';

const router = express.Router();

export function createAuthRoutes(db) {
  // Register first admin
  router.post('/register-first-admin', async (req, res) => {
    try {
      const hasUsers = queries.hasAnyUsers(db);

      if (hasUsers) {
        return res.status(400).json({ error: 'Admin user already exists' });
      }

      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = queries.createUser(db, username, passwordHash, true);

      // Log in the new admin
      req.session.userId = userId;
      req.session.username = username;
      req.session.isAdmin = true;

      res.json({
        message: 'Admin created successfully',
        user: { id: userId, username, isAdmin: true }
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Failed to create admin user' });
    }
  });

  // Check if setup is needed
  router.get('/setup-needed', (req, res) => {
    const hasUsers = queries.hasAnyUsers(db);
    res.json({ setupNeeded: !hasUsers });
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = queries.getUserByUsername(db, username);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.isAdmin = user.is_admin === 1;

      res.json({
        message: 'Logged in successfully',
        user: {
          id: user.id,
          username: user.username,
          isAdmin: user.is_admin === 1
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Logout
  router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });

  // Check current session
  router.get('/check', (req, res) => {
    if (req.session && req.session.userId) {
      res.json({
        authenticated: true,
        user: {
          id: req.session.userId,
          username: req.session.username,
          isAdmin: req.session.isAdmin
        }
      });
    } else {
      res.json({ authenticated: false });
    }
  });

  return router;
}
