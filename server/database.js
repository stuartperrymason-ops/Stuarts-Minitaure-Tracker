import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export async function initializeDatabase() {
  if (db) {
    return db;
  }

  try {
    const database = await open({
      filename: './server/minis.db',
      driver: sqlite3.Database,
    });

    await database.exec(`
      CREATE TABLE IF NOT EXISTS miniatures (
        id TEXT PRIMARY KEY,
        modelName TEXT NOT NULL,
        gameSystem TEXT NOT NULL,
        army TEXT NOT NULL,
        status TEXT NOT NULL,
        modelCount INTEGER NOT NULL
      )
    `);

    console.log('Database connected and table is ready.');
    db = database;
    return db;
  } catch (err) {
    console.error('Error initializing database', err);
    process.exit(1);
  }
}
