import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

const client = new MongoClient(uri);
let db = null;

export async function connectToDatabase() {
  if (db) {
    return;
  }
  try {
    await client.connect();
    db = client.db(); // If no db name is in the URI, you can pass it here, e.g., client.db("miniature_tracker")
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    await client.close();
    process.exit(1);
  }
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected. Call 'connectToDatabase' first.");
  }
  return db;
}