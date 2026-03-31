import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { runSeed } from './seed';

function getDbPath(): string {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'potansiyel.db');
  }
  return path.join(process.cwd(), 'db', 'potansiyel.db');
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(getDbPath());
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);

    // Auto-seed on fresh DB
    runSeed(db);
  }
  return db;
}
