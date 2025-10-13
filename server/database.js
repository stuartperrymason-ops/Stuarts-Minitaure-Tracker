/**
 * @file server/database.js
 * This file handles the connection to the MongoDB database.
 * It uses a singleton pattern to ensure there is only one active database connection for the application.
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Loads environment variables from a .env file into process.env.
dotenv.config();

// Retrieve the MongoDB connection string from environment variables.
const rawUri = process.env.MONGODB_URI;
if (!rawUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Sanitize the URI to prevent common issues with copy-pasting from .env files.
const uri = rawUri.trim().replace(/^"|"$/g, '');

// Create a new MongoDB client instance with the provided URI.
const client = new MongoClient(uri);

// This variable will hold the database connection object. It's initialized to null.
let db = null;

/**
 * Establishes a connection to the MongoDB database.
 * If a connection already exists, it does nothing.
 */
export async function connectToDatabase() {
  // If `db` is not null, it means we are already connected, so we can return early.
  if (db) {
    return;
  }
  try {
    // Attempt to connect the client to the server.
    await client.connect();
    // The `client.db()` method will use the database specified in the connection string.
    // If no database is specified, it will use a default one like 'test'.
    db = client.db(); 
    console.log('Successfully connected to MongoDB.');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    // Even if connection fails, we don't crash the server. 
    // The server will respond with a 503 error if the DB is unavailable.
  }
}

/**
 * Returns the active database connection object.
 * This function allows other parts of the application to access the database without
 * needing to manage the connection themselves.
 * @returns {Db | null} The MongoDB database object, or null if not connected.
 */
export function getDb() {
  return db;
}
