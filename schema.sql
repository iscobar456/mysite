CREATE TABLE "user" (
    id INTEGER PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT UNIQUE,
    last_login TEXT
);

CREATE TABLE "session" (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user" (id),
    expires_at INTEGER NOT NULL
);

CREATE TABLE "role" (id INTEGER PRIMARY KEY, name TEXT NOT NULL);

CREATE TABLE "permission" (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- M2M tables
CREATE TABLE "user_roles" (
    user_id INTEGER NOT NULL REFERENCES "user" (id),
    role_id INTEGER NOT NULL REFERENCES "role" (id),
    PRIMARY key (user_id, role_id)
);

CREATE TABLE "role_permissions" (
    role_id INTEGER NOT NULL REFERENCES "role" (id),
    permission_id INTEGER NOT NULL REFERENCES "permission" (id),
    PRIMARY key (role_id, permission_id)
);
