/**
 * @file server/server.js
 * This is the main backend server file for the application.
 * It uses Express.js to create a RESTful API that the frontend can interact with.
 * The API handles all CRUD (Create, Read, Update, Delete) operations for miniatures and game systems.
 */

import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';
import { ObjectId } from 'mongodb';

/**
 * Seeds the database with an initial list of game systems if the collection is empty.
 * This ensures the application has some default data to work with on first launch.
 */
async function seedGameSystems() {
  const db = getDb();
  if (!db) return; // Do nothing if the database is not connected.
  const gameSystemsCollection = db.collection('gamesystems');
  const count = await gameSystemsCollection.countDocuments();
  // Only seed if the collection has no documents.
  if (count === 0) {
      console.log('Seeding initial game systems...');
      const initialGameSystems = [
          "Marvel: Crisis Protocol", "Battletech", "Star Wars: Legion", "Star Wars: Shatterpoint",
          "Middle-earth Strategy Battle Game", "Warhammer: The Old World", "Warhammer: Age of Sigmar",
          "Warhammer 40,000", "Dune", "Trench Crusade", "Legion Imperialis", "Conquest - Last Argument of Kings"
      ].map(name => ({ name })); // Format the array of strings into objects for MongoDB.
      await gameSystemsCollection.insertMany(initialGameSystems);
      console.log('Finished seeding game systems.');
  }
}

// Connect to the database when the server starts, and then seed the data.
connectToDatabase().then(() => {
  seedGameSystems();
});

// Initialize the Express application.
const app = express();
const port = 3001; // The port the backend server will run on.

// MIDDLEWARE
// Middleware are functions that execute during the lifecycle of a request to the server.

// `cors` middleware allows the frontend (running on a different port) to make requests to this backend.
app.use(cors());
// `express.json` middleware parses incoming requests with JSON payloads.
app.use(express.json({ limit: '10mb' })); // Increased limit to handle large bulk CSV imports.

// Custom middleware to check if the database connection is available.
app.use((req, res, next) => {
  if (!getDb()) {
    // If not connected, send a "Service Unavailable" status and stop processing the request.
    res.status(503).json({ message: 'Service Unavailable: Database not connected.' });
    return;
  }
  // If connected, continue to the next middleware or route handler.
  next();
});

// API ROUTES
// These define the endpoints that the frontend will call.

// --- GAME SYSTEMS ROUTES ---

// GET /api/gamesystems: Fetches all game systems, sorted alphabetically.
app.get('/api/gamesystems', async (req, res) => {
  try {
    const systems = await getDb().collection('gamesystems').find({}).sort({ name: 1 }).toArray();
    // The frontend expects an array of strings, so we map the result.
    res.json(systems.map(s => s.name));
  } catch (error) {
    console.error('GET /api/gamesystems error:', error);
    res.status(500).json({ message: 'Failed to fetch game systems', error: error.message });
  }
});

// POST /api/gamesystems: Creates a new game system.
app.post('/api/gamesystems', async (req, res) => {
  try {
    const { name } = req.body;
    // Basic validation for the incoming data.
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Game system name must be a non-empty string.' });
    }
    const trimmedName = name.trim();
    // Check if a game system with the same name (case-insensitive) already exists.
    const existing = await getDb().collection('gamesystems').findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (existing) {
      return res.status(409).json({ message: 'Game system already exists.' }); // 409 Conflict
    }
    const result = await getDb().collection('gamesystems').insertOne({ name: trimmedName });
    res.status(201).json({ _id: result.insertedId, name: trimmedName }); // 201 Created
  } catch (error) {
    console.error('POST /api/gamesystems error:', error);
    res.status(500).json({ message: 'Failed to create game system', error: error.message });
  }
});


// --- MINIATURES ROUTES ---

// GET /api/miniatures: Fetches all miniatures.
app.get('/api/miniatures', async (req, res) => {
  try {
    const miniatures = await getDb().collection('miniatures').find({}).toArray();
    // MongoDB uses `_id` for its primary key. The frontend data model expects `id`.
    // We transform the data here to match the frontend's expectation.
    res.json(miniatures.map(m => ({ ...m, id: m._id.toString(), _id: undefined })));
  } catch (error)
 {
    console.error('GET /api/miniatures error:', error);
    res.status(500).json({ message: 'Failed to fetch miniatures', error: error.message });
  }
});

// POST /api/miniatures: Creates a new miniature.
app.post('/api/miniatures', async (req, res) => {
  try {
    const miniatureData = req.body;
    // Remove the `id` field sent by the frontend, as MongoDB will generate its own `_id`.
    delete miniatureData.id; 
    delete miniatureData._id;
    const result = await getDb().collection('miniatures').insertOne(miniatureData);
    // Create the response object, transforming the new `_id` back to `id` for the frontend.
    const newMiniature = { ...miniatureData, id: result.insertedId.toString() };
    res.status(201).json(newMiniature);
  } catch (error) {
    console.error('POST /api/miniatures error:', error);
    res.status(500).json({ message: 'Failed to create miniature', error: error.message });
  }
});

// PUT /api/miniatures/:id: Updates an existing miniature.
app.put('/api/miniatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Validate that the provided ID is a valid MongoDB ObjectId format.
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid miniature ID format.' });
    }
    const updateData = req.body;
    // Ensure the immutable `_id` field is not part of the update operation.
    delete updateData._id; 
    delete updateData.id;
    const result = await getDb().collection('miniatures').updateOne(
      { _id: new ObjectId(id) }, // The filter to find the document.
      { $set: updateData } // The update operation.
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Miniature not found' });
    }
    res.status(200).json({ message: 'Miniature updated successfully' });
  } catch (error) {
    console.error(`PUT /api/miniatures/${req.params.id} error:`, error);
    res.status(500).json({ message: 'Failed to update miniature', error: error.message });
  }
});

// DELETE /api/miniatures/:id: Deletes a miniature.
app.delete('/api/miniatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid miniature ID format.' });
    }
    const result = await getDb().collection('miniatures').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Miniature not found' });
    }
    res.status(200).json({ message: 'Miniature deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/miniatures/${req.params.id} error:`, error);
    res.status(500).json({ message: 'Failed to delete miniature', error: error.message });
  }
});

// --- BULK OPERATIONS ---

// POST /api/miniatures/bulk-import (for CSV import)
app.post('/api/miniatures/bulk-import', async (req, res) => {
  try {
    const miniatures = req.body;
    if (!Array.isArray(miniatures) || miniatures.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of miniatures.' });
    }
    // Prepare documents for insertion.
    const miniaturesToInsert = miniatures.map(m => {
        delete m.id;
        delete m._id;
        return m;
    });
    const result = await getDb().collection('miniatures').insertMany(miniaturesToInsert, { ordered: false });
    // Fetch the newly inserted documents to send them back to the frontend with their generated IDs.
    const insertedDocs = await getDb().collection('miniatures').find({ _id: { $in: Object.values(result.insertedIds) } }).toArray();
    res.status(201).json(insertedDocs.map(m => ({ ...m, id: m._id.toString(), _id: undefined })));
  } catch (error) {
    console.error('POST /api/miniatures/bulk-import error:', error);
    res.status(500).json({ message: 'Bulk import failed', error: error.message });
  }
});

// PUT /api/miniatures/bulk (for bulk edit)
app.put('/api/miniatures/bulk', async (req, res) => {
  try {
    const { ids, updates } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Invalid request body. Expects "ids" array and "updates" object.' });
    }
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await getDb().collection('miniatures').updateMany(
        { _id: { $in: objectIds } }, // Filter: update documents where _id is in the provided array.
        { $set: updates }
    );
    if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'No matching miniatures found to update.' });
    }
    // Fetch and return the updated documents to sync the frontend state.
    const updatedDocs = await getDb().collection('miniatures').find({ _id: { $in: objectIds } }).toArray();
    res.status(200).json(updatedDocs.map(m => ({ ...m, id: m._id.toString(), _id: undefined })));
  } catch (error) {
    console.error('PUT /api/miniatures/bulk error:', error);
    res.status(500).json({ message: 'Bulk update failed', error: error.message });
  }
});

// DELETE /api/miniatures/bulk (for bulk delete)
app.delete('/api/miniatures/bulk', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid request body. Expects an "ids" array.' });
    }
    const objectIds = ids.map(id => new ObjectId(id));
    const result = await getDb().collection('miniatures').deleteMany({ _id: { $in: objectIds } });
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No matching miniatures found to delete.' });
    }
    res.status(200).json({ message: `${result.deletedCount} miniatures deleted successfully.` });
  } catch (error) {
    console.error('DELETE /api/miniatures/bulk error:', error);
    res.status(500).json({ message: 'Bulk delete failed', error: error.message });
  }
});

// Start the server and listen for incoming requests on the specified port.
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
