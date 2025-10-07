import express from 'express';
import * as queries from '../db/queries.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

export function createPieRoutes(db) {
  // Create new pie (authenticated users)
  router.post('/', requireAuth, (req, res) => {
    try {
      const { name, imageUrl, price } = req.body;

      console.log('Create pie request:', { name, imageUrl, price, userId: req.session.userId });

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Pie name is required' });
      }

      const pieId = queries.createPie(db, name.trim(), req.session.userId, imageUrl || null, price || null);
      const pie = queries.getPieById(db, pieId);

      console.log('Pie created:', pie);

      res.json({
        message: 'Pie created successfully',
        pie
      });
    } catch (error) {
      console.error('Error creating pie:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ error: 'Failed to create pie' });
    }
  });

  // Get all pies (public)
  router.get('/', (req, res) => {
    try {
      const pies = queries.getAllPies(db);
      res.json(pies);
    } catch (error) {
      console.error('Error fetching pies:', error);
      res.status(500).json({ error: 'Failed to fetch pies' });
    }
  });

  // Get single pie with reviews (public)
  router.get('/:id', (req, res) => {
    try {
      const pie = queries.getPieById(db, req.params.id);

      if (!pie) {
        return res.status(404).json({ error: 'Pie not found' });
      }

      const reviews = queries.getReviewsForPie(db, req.params.id);

      res.json({ ...pie, reviews });
    } catch (error) {
      console.error('Error fetching pie:', error);
      res.status(500).json({ error: 'Failed to fetch pie' });
    }
  });

  // Check if user can review a pie
  router.get('/:id/can-review', requireAuth, (req, res) => {
    try {
      const canReview = queries.canUserReviewPie(db, req.params.id, req.session.userId);
      res.json({ canReview });
    } catch (error) {
      console.error('Error checking review status:', error);
      res.status(500).json({ error: 'Failed to check review status' });
    }
  });

  // Update pie (admin only)
  router.put('/:id', requireAuth, (req, res) => {
    try {
      const user = queries.getUserById(db, req.session.userId);

      if (!user || !user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { name, imageUrl, price } = req.body;

      if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Pie name is required' });
      }

      queries.updatePie(db, req.params.id, name.trim(), imageUrl || null, price || null);
      const pie = queries.getPieById(db, req.params.id);

      res.json({
        message: 'Pie updated successfully',
        pie
      });
    } catch (error) {
      console.error('Error updating pie:', error);
      res.status(500).json({ error: 'Failed to update pie' });
    }
  });

  // Delete pie (admin only)
  router.delete('/:id', requireAuth, (req, res) => {
    try {
      const user = queries.getUserById(db, req.session.userId);

      if (!user || !user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      queries.deletePie(db, req.params.id);

      res.json({
        message: 'Pie deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting pie:', error);
      res.status(500).json({ error: 'Failed to delete pie' });
    }
  });

  return router;
}
