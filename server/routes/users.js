import express from 'express';
import bcrypt from 'bcrypt';
import * as queries from '../db/queries.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

export function createUserRoutes(db) {
  // Create new user (admin only)
  router.post('/', requireAdmin, async (req, res) => {
    try {
      const { username, password, isAdmin } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const existingUser = queries.getUserByUsername(db, username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userId = queries.createUser(db, username, passwordHash, isAdmin || false);

      res.json({
        message: 'User created successfully',
        user: {
          id: userId,
          username,
          isAdmin: isAdmin || false
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Get all users (admin only)
  router.get('/', requireAdmin, (req, res) => {
    try {
      const users = queries.getAllUsers(db);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  return router;
}
