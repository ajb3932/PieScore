import * as queries from '../db/queries.js';

export function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export function createRequireAdmin(db) {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // SECURITY: Always check the database, never trust session data for authorization
    try {
      const user = queries.getUserById(db, req.session.userId);

      if (!user || !user.is_admin) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      next();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Legacy middleware for backwards compatibility - DEPRECATED, use createRequireAdmin instead
export function requireAdmin(req, res, next) {
  if (!req.session || !req.session.userId || !req.session.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

export function optionalAuth(req, res, next) {
  // Attach user info if logged in, but don't require it
  next();
}
