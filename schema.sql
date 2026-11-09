CREATE TABLE "user" (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
);

CREATE TABLE "session" (
    id TEXT PRIMARY KEY,
    expires_at INTEGER NOT NULL
);

CREATE TABLE "post" (
    id INTEGER PRIMARY KEY,
    title TEXT UNIQUE,
    slug TEXT UNIQUE,
    type TEXT NOT NULL DEFAULT 'other',
    content TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "book" (
    id INTEGER PRIMARY KEY,
    title TEXT UNIQUE,
    slug TEXT UNIQUE,
    read_date TEXT, -- ISO date (YYYY-MM-DD); NULL if unknown
    content TEXT NOT NULL DEFAULT ''
);
