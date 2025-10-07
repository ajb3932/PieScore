import Database from 'better-sqlite3';

const db = new Database('./db/pietracker.db');

console.log('=== Users in database ===');
const users = db.prepare('SELECT id, username, is_admin FROM users').all();
console.log(users);

console.log('\n=== User count ===');
const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
console.log(count);

db.close();
