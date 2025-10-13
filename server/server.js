/**
 * @file server/server.js
 * This file sets up the Express.js server, defines API endpoints (routes),
 * and handles all communication between the frontend application and the MongoDB database.
 */

import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// --- SERVER AND MIDDLEWARE SETUP ---

const app = express();
const port = 3001;

// Middleware to enable Cross-Origin Resource Sharing (CORS).
app.use(cors());
// Middleware to parse incoming JSON request bodies.
app.use(express.json());

// --- FILE UPLOAD SETUP (Multer) ---

// Get the directory name of the current module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths for public and uploads directories.
const publicDir = path.join(__dirname, '..', 'public');
const uploadsDir = path.join(publicDir, 'uploads');

// Ensure the 'public/uploads' directory exists.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files (like uploaded images) from the 'public' directory.
// This makes files in 'public/uploads' accessible via URLs like '/uploads/filename.jpg'.
app.use(express.static(publicDir));


// Configure multer's storage engine.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Save files to the 'public/uploads' directory.
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites: timestamp + original filename.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration.
const upload = multer({ storage: storage });

// --- DATABASE CONNECTION & HEALTH CHECK ---

// Connect to the database when the server starts.
connectToDatabase();

// A middleware to check if the database connection is available.
// If not, it sends a 503 Service Unavailable response.
const checkDbConnection = (req, res, next) => {
  if (!getDb()) {
    return res.status(503).json({ message: 'Database service is unavailable. Please try again later.' });
  }
  next();
};

// Apply the DB connection check to all routes.
app.use(checkDbConnection);


// --- API ROUTES ---

// Endpoint for handling image uploads.
// `upload.array('images', 10)` accepts up to 10 files from a field named 'images'.
app.post('/api/upload', upload.array('images', 10), (req, res) => {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    // Map the uploaded file data to an array of URL paths.
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ urls });
});


// GET all miniatures
app.get('/api/miniatures', async (req, res) => {
  try {
    const miniatures = await getDb().collection('miniatures').find({}).toArray();
    res.json(miniatures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching miniatures', error: error.message });
  }
});

// POST a new miniature
app.post('/api/miniatures', async (req, res) => {
  try {
    const miniatureData = req.body;
    const result = await getDb().collection('miniatures').insertOne(miniatureData);
    // Fetch the newly created document to return it in the response.
    const newMiniature = await getDb().collection('miniatures').findOne({ _id: result.insertedId });
    res.status(201).json(newMiniature);
  } catch (error) {
    res.status(500).json({ message: 'Error creating miniature', error: error.message });
  }
});

// PUT (update) an existing miniature
app.put('/api/miniatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // The `_id` is immutable and should not be part of the update payload.
    delete updateData._id;

    const result = await getDb().collection('miniatures').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Miniature not found' });
    }
    // Fetch the updated document to return it.
    const updatedMiniature = await getDb().collection('miniatures').findOne({ _id: new ObjectId(id) });
    res.json(updatedMiniature);
  } catch (error) {
    res.status(500).json({ message: 'Error updating miniature', error: error.message });
  }
});

// DELETE a miniature
app.delete('/api/miniatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getDb().collection('miniatures').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Miniature not found' });
    }
    res.status(204).send(); // 204 No Content for successful deletion.
  } catch (error) {
    res.status(500).json({ message: 'Error deleting miniature', error: error.message });
  }
});

// POST bulk delete miniatures
app.post('/api/miniatures/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: 'Invalid request: "ids" must be an array.' });
        }
        const objectIds = ids.map(id => new ObjectId(id));
        await getDb().collection('miniatures').deleteMany({ _id: { $in: objectIds } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error during bulk deletion', error: error.message });
    }
});

// POST bulk update miniatures
app.post('/api/miniatures/bulk-update', async (req, res) => {
    try {
        const { ids, updates } = req.body;
        if (!ids || !Array.isArray(ids) || !updates) {
            return res.status(400).json({ message: 'Invalid request body.' });
        }
        const objectIds = ids.map(id => new ObjectId(id));
        await getDb().collection('miniatures').updateMany(
            { _id: { $in: objectIds } },
            { $set: updates }
        );
        const updatedDocuments = await getDb().collection('miniatures').find({ _id: { $in: objectIds } }).toArray();
        res.json(updatedDocuments);
    } catch (error) {
        res.status(500).json({ message: 'Error during bulk update', error: error.message });
    }
});


// --- GAME SYSTEMS ROUTES ---

// GET all game systems
app.get('/api/gamesystems', async (req, res) => {
    try {
        const gameSystems = await getDb().collection('gamesystems').find({}).sort({ name: 1 }).toArray();
        res.json(gameSystems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game systems', error: error.message });
    }
});

// POST a new game system
app.post('/api/gamesystems', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Game system name is required.' });
        }
        // Ensure the game system doesn't already exist (case-insensitive check).
        const existingSystem = await getDb().collection('gamesystems').findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        if (existingSystem) {
            return res.status(409).json({ message: 'Game system already exists.' });
        }
        const result = await getDb().collection('gamesystems').insertOne({ name });
        const newGameSystem = await getDb().collection('gamesystems').findOne({ _id: result.insertedId });
        res.status(201).json(newGameSystem);
    } catch (error) {
        res.status(500).json({ message: 'Error creating game system', error: error.message });
    }
});


// --- SERVER START ---

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});