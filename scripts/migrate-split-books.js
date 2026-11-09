// Usage: npm run migrate
// One-time migration: splits the old `post` table (with a `file` column) into
// `post` and `book`, and moves markdown from src/posts/*.md into the database.
// Backs up mysite.db first. Safe to run twice (does nothing once migrated).
// Stop the app (or at least expect to restart it) before running on a live server.
import Database from 'better-sqlite3';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const dbPath = 'mysite.db';
if (!existsSync(dbPath)) {
    console.error('mysite.db not found in the current directory.');
    process.exit(1);
}
const db = new Database(dbPath, { fileMustExist: true });

const postCols = db.prepare('PRAGMA table_info(post)').all().map((c) => c.name);
if (postCols.length === 0) {
    console.error("No 'post' table found. For a fresh database run: sqlite3 mysite.db < schema.sql");
    process.exit(1);
}
if (!postCols.includes('file')) {
    console.log('Already migrated (post has no file column). Nothing to do.');
    process.exit(0);
}

const backup = `mysite.db.bak-${new Date().toISOString().replace(/[:.]/g, '-')}`;
await db.backup(backup);
console.log(`Backup written to ${backup}`);

const readContent = (file) => {
    const full = path.resolve('src/posts', file);
    if (!existsSync(full)) {
        console.warn(`  warning: ${file} not found, using empty content`);
        return '';
    }
    return readFileSync(full, 'utf-8');
};

const migrate = db.transaction(() => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS "book" (
            id INTEGER PRIMARY KEY,
            title TEXT UNIQUE,
            slug TEXT UNIQUE,
            read_date TEXT,
            content TEXT NOT NULL DEFAULT ''
        );
        CREATE TABLE "post_new" (
            id INTEGER PRIMARY KEY,
            title TEXT UNIQUE,
            slug TEXT UNIQUE,
            type TEXT NOT NULL DEFAULT 'other',
            content TEXT NOT NULL DEFAULT ''
        );
    `);
    const insertBook = db.prepare('INSERT INTO book (title, slug, read_date, content) VALUES (?, ?, NULL, ?)');
    const insertPost = db.prepare('INSERT INTO post_new (title, slug, type, content) VALUES (?, ?, ?, ?)');
    let books = 0, posts = 0;
    for (const row of db.prepare('SELECT * FROM post').all()) {
        const content = readContent(row.file);
        if (row.type === 'book') {
            insertBook.run(row.title, row.slug, content);
            books++;
        } else {
            insertPost.run(row.title, row.slug, row.type === 'project' ? 'project' : 'other', content);
            posts++;
        }
    }
    db.exec('DROP TABLE post; ALTER TABLE post_new RENAME TO post;');
    console.log(`Migrated ${posts} post(s) and ${books} book(s).`);
});
migrate();
console.log('Done. Restart the app, and set read dates for your books in /admin/readinglist.');
