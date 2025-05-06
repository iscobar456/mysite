import Database from 'better-sqlite3';

export const db = Database('../../mysite.db');
db.pragma('journal_mode = WAL');
