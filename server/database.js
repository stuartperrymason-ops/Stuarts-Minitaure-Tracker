import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside server/.env');
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
    db = client.db(); 
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

export function getDb() {
  return db;
}
