import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Sanitize the URI to remove leading/trailing spaces and quotes, a common .env issue.
const uri = rawUri.trim().replace(/^"|"$/g, '');

const client = new MongoClient(uri);
let db = null;

export async function connectToDatabase() {
  if (db) {
    return;
  }
  try {
    await client.connect();
    // client.db() will use the database from the sanitized connection string
    db = client.db(); 
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    // Let the server start, but db will be null.
  }
}

export function getDb() {
  return db;
}