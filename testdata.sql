-- Insert users
INSERT INTO
    "user" (id, email, password, last_login)
VALUES
    (
        1,
        'alice@example.com',
        '$argon2id$v=19$...$..1',
        '2025-06-08T08:30:00Z'
    ),
    (
        2,
        'bob@example.com',
        '$argon2id$v=19$...$..2',
        '2025-06-07T12:45:00Z'
    ),
    (
        3,
        'carol@example.com',
        '$argon2id$v=19$...$..3',
        '2025-06-06T09:15:00Z'
    ),
    (
        4,
        'isaacspencer17@gmail.com',
        '$argon2id$v=19$...$..4',
        '2025-06-06T09:15:00Z'
    );

-- Insert roles
INSERT INTO
    "role" (id, name)
VALUES
    (1, 'admin'),
    (2, 'editor'),
    (3, 'viewer');

-- Insert permissions
INSERT INTO
    "permission" (id, name, description)
VALUES
    (1, 'create_post', 'Allows creating new posts'),
    (2, 'edit_post', 'Allows editing existing posts'),
    (3, 'delete_post', 'Allows deleting posts'),
    (4, 'view_post', 'Allows viewing posts');

-- Assign roles to users
INSERT INTO
    "user_roles" (user_id, role_id)
VALUES
    (1, 1), -- Alice is admin
    (2, 2), -- Bob is editor
    (3, 3);

-- Carol is viewer
-- Assign permissions to roles
INSERT INTO
    "role_permissions" (role_id, permission_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4), -- Admin has all permissions
    (2, 1),
    (2, 2),
    (2, 4), -- Editor can create, edit, view
    (3, 4);

-- Viewer can only view
