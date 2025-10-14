import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside server/.env');
}

const dbName = process.env.DB_NAME;
if (!dbName) {
    throw new Error('Please define the DB_NAME environment variable inside server/.env');
}

const uri = rawUri.trim().replace(/^"|"$/g, '');

const client = new MongoClient(uri);
let db = null;

export async function connectToDatabase() {
  if (db) {
    return;
  }
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`Successfully connected to MongoDB database: ${dbName}.`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    // Make sure db is null on failure so the middleware catches it.
    db = null; 
  }
}

export function getDb() {
  return db;
}