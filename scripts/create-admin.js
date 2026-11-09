// Usage: npm run create-admin
// Creates (or resets the password of) the 'admin' user in mysite.db.
// Run from the project root: the app opens mysite.db relative to cwd.
import Database from 'better-sqlite3';
import argon2 from 'argon2';
import readline from 'node:readline';

function promptHidden(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
        rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
        rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
    });
}

const password = process.env.ADMIN_PASSWORD ?? await promptHidden('Admin password: ');
if (!password) {
    console.error('Password cannot be empty.');
    process.exit(1);
}
if (!process.env.ADMIN_PASSWORD) {
    const confirm = await promptHidden('Confirm password: ');
    if (confirm !== password) {
        console.error('Passwords do not match.');
        process.exit(1);
    }
}

const db = new Database('mysite.db', { fileMustExist: true });
const hash = await argon2.hash(password);
const existing = db.prepare("SELECT id FROM user WHERE username = 'admin'").get();
if (existing) {
    db.prepare("UPDATE user SET password = ? WHERE username = 'admin'").run(hash);
    console.log("Updated password for user 'admin'.");
} else {
    db.prepare("INSERT INTO user (username, password) VALUES ('admin', ?)").run(hash);
    console.log("Created user 'admin'.");
}
