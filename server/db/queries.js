// User queries
export function createUser(db, username, passwordHash, isAdmin = false) {
  const stmt = db.prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)');
  const result = stmt.run(username, passwordHash, isAdmin ? 1 : 0);
  return result.lastInsertRowid;
}

export function getUserByUsername(db, username) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username);
}

export function getUserById(db, id) {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
}

export function getAllUsers(db) {
  const stmt = db.prepare('SELECT id, username, is_admin, created_at FROM users');
  return stmt.all();
}

export function hasAnyUsers(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = stmt.get();
  return result.count > 0;
}

// Pie queries
export function createPie(db, name, createdBy, imageUrl = null, price = null) {
  const stmt = db.prepare('INSERT INTO pies (name, image_url, price, created_by) VALUES (?, ?, ?, ?)');
  const result = stmt.run(name, imageUrl, price, createdBy);
  return result.lastInsertRowid;
}

export function getPieById(db, id) {
  const stmt = db.prepare('SELECT * FROM pies WHERE id = ?');
  return stmt.get(id);
}

export function getAllPies(db) {
  const stmt = db.prepare('SELECT * FROM pies ORDER BY created_at DESC');
  return stmt.all();
}

export function updatePie(db, id, name, imageUrl = null, price = null) {
  const stmt = db.prepare('UPDATE pies SET name = ?, image_url = ?, price = ? WHERE id = ?');
  const result = stmt.run(name, imageUrl, price, id);
  return result.changes;
}

export function deletePie(db, id) {
  // Delete all reviews for this pie first
  const deleteReviews = db.prepare('DELETE FROM reviews WHERE pie_id = ?');
  deleteReviews.run(id);

  // Then delete the pie
  const stmt = db.prepare('DELETE FROM pies WHERE id = ?');
  const result = stmt.run(id);
  return result.changes;
}

// Review queries
export function createReview(db, pieId, userId, fillingScore, pastryScore, appearanceScore, overallScore, valueForMoneyScore) {
  const stmt = db.prepare(
    'INSERT INTO reviews (pie_id, user_id, filling_score, pastry_score, appearance_score, overall_score, value_for_money_score) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(pieId, userId, fillingScore, pastryScore, appearanceScore, overallScore, valueForMoneyScore);
  return result.lastInsertRowid;
}

export function getReviewByPieAndUser(db, pieId, userId) {
  const stmt = db.prepare('SELECT * FROM reviews WHERE pie_id = ? AND user_id = ?');
  return stmt.get(pieId, userId);
}

export function getUserReviews(db, userId) {
  const stmt = db.prepare('SELECT * FROM reviews WHERE user_id = ?');
  return stmt.all(userId);
}

export function getReviewsForPie(db, pieId) {
  const stmt = db.prepare(`
    SELECT r.*, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.pie_id = ?
  `);
  return stmt.all(pieId);
}

// Leaderboard query
export function getLeaderboard(db) {
  const stmt = db.prepare(`
    SELECT
      p.id,
      p.name,
      p.image_url,
      p.price,
      p.created_at,
      CAST(AVG(r.filling_score) AS REAL) as avg_filling,
      CAST(AVG(r.pastry_score) AS REAL) as avg_pastry,
      CAST(AVG(r.appearance_score) AS REAL) as avg_appearance,
      CAST(AVG(r.overall_score) AS REAL) as avg_overall,
      CAST(AVG(r.value_for_money_score) AS REAL) as avg_value_for_money,
      COUNT(DISTINCT r.user_id) as review_count
    FROM pies p
    LEFT JOIN reviews r ON p.id = r.pie_id
    GROUP BY p.id
    ORDER BY avg_overall DESC, p.name ASC
  `);

  const pies = stmt.all();

  // Get individual reviews for each pie
  const piesWithReviews = pies.map(pie => {
    const reviews = getReviewsForPie(db, pie.id);
    return { ...pie, reviews };
  });

  return piesWithReviews;
}

export function canUserReviewPie(db, pieId, userId) {
  const existing = getReviewByPieAndUser(db, pieId, userId);
  return !existing;
}
