CREATE TABLE "user" (id INTEGER PRIMARY KEY);

CREATE TABLE "sessios" (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES "user" (id),
    expires_at INTEGER NOT NULL
);

CREATE TABLE "role" (id INTEGER PRIMARY KEY, ame TEXT NOT NULL);

CREATE TABLE permission (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description text
);

-- M2M tables
CREATE TABLE user_roles (
    user_id REFERENCES USER (id),
    role_id REFERENCES role (id),
    PRIMARY key (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id REFERENCES role (id),
    permission_id REFERENCES permission (id),
    PRIMARY key (role_id, permission_id)
);
