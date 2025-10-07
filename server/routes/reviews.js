import express from 'express';
import * as queries from '../db/queries.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

export function createReviewRoutes(db) {
  // Create review (authenticated users)
  router.post('/', requireAuth, (req, res) => {
    try {
      const { pieId, fillingScore, pastryScore, appearanceScore, overallScore, valueForMoneyScore } = req.body;

      // Validate required fields
      if (!pieId || !fillingScore || !pastryScore || !appearanceScore || !overallScore || !valueForMoneyScore) {
        return res.status(400).json({ error: 'All scores are required' });
      }

      // Validate scores are in range
      const scores = [fillingScore, pastryScore, appearanceScore, overallScore, valueForMoneyScore];
      for (const score of scores) {
        if (score < 1 || score > 5) {
          return res.status(400).json({ error: 'Scores must be between 1 and 5' });
        }
      }

      // Check pie exists
      const pie = queries.getPieById(db, pieId);
      if (!pie) {
        return res.status(404).json({ error: 'Pie not found' });
      }

      // Check if user has already reviewed this pie
      const canReview = queries.canUserReviewPie(db, pieId, req.session.userId);
      if (!canReview) {
        return res.status(400).json({ error: 'You have already reviewed this pie' });
      }

      const reviewId = queries.createReview(
        db,
        pieId,
        req.session.userId,
        fillingScore,
        pastryScore,
        appearanceScore,
        overallScore,
        valueForMoneyScore
      );

      res.json({
        message: 'Review submitted successfully',
        reviewId
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Get current user's reviews
  router.get('/my-reviews', requireAuth, (req, res) => {
    try {
      const reviews = queries.getUserReviews(db, req.session.userId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  // Get leaderboard (public)
  router.get('/leaderboard', (req, res) => {
    try {
      const leaderboard = queries.getLeaderboard(db);
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });

  return router;
}
