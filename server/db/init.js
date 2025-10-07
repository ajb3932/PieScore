import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function initDatabase(dbPath) {
  const db = new Database(dbPath);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  const createTables = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      image_url TEXT,
      price REAL,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pie_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      filling_score INTEGER CHECK(filling_score >= 1 AND filling_score <= 5),
      pastry_score INTEGER CHECK(pastry_score >= 1 AND pastry_score <= 5),
      appearance_score INTEGER CHECK(appearance_score >= 1 AND appearance_score <= 5),
      overall_score INTEGER CHECK(overall_score >= 1 AND overall_score <= 5),
      value_for_money_score INTEGER CHECK(value_for_money_score >= 1 AND value_for_money_score <= 5),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pie_id) REFERENCES pies(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(pie_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;

  db.exec(createTables);

  // Migration: Add price column to pies if it doesn't exist
  try {
    const piesColumns = db.prepare("PRAGMA table_info(pies)").all();
    const hasPriceColumn = piesColumns.some(col => col.name === 'price');
    if (!hasPriceColumn) {
      db.exec('ALTER TABLE pies ADD COLUMN price REAL');
      console.log('Added price column to pies table');
    }
  } catch (error) {
    console.error('Error adding price column:', error);
  }

  // Migration: Add value_for_money_score column to reviews if it doesn't exist
  try {
    const reviewsColumns = db.prepare("PRAGMA table_info(reviews)").all();
    const hasValueColumn = reviewsColumns.some(col => col.name === 'value_for_money_score');
    if (!hasValueColumn) {
      db.exec('ALTER TABLE reviews ADD COLUMN value_for_money_score INTEGER CHECK(value_for_money_score >= 1 AND value_for_money_score <= 5)');
      console.log('Added value_for_money_score column to reviews table');
    }
  } catch (error) {
    console.error('Error adding value_for_money_score column:', error);
  }

  console.log('Database initialized successfully');
  return db;
}
