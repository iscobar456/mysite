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
    type TEXT,
    file TEXT
);
