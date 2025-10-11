import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Middleware to check for database connection
const checkDbConnection = (req, res, next) => {
    const db = getDb();
    if (!db) {
        res.status(503).json({ 
            error: 'Service Unavailable: Database connection failed.',
            message: 'Please check server logs. Ensure the MongoDB server is running and the MONGODB_URI in your .env file is correct.'
        });
        return;
    }
    next();
};

// Apply middleware to all API routes
app.use('/api', checkDbConnection);


// API routes
app.get('/api/miniatures', async (req, res) => {
  try {
    const db = getDb();
    const miniatures = await db.collection('miniatures').find({}, { projection: { _id: 0 } }).toArray();
    res.json(miniatures);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch miniatures' });
  }
});

app.post('/api/miniatures', async (req, res) => {
  const miniature = req.body;
  if (!miniature.id || !miniature.modelName || !miniature.gameSystem || !miniature.army || !miniature.status || miniature.modelCount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const db = getDb();
    await db.collection('miniatures').insertOne(miniature);
    res.status(201).json(miniature);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add miniature' });
  }
});

app.post('/api/miniatures/bulk', async (req, res) => {
    const miniatures = req.body;

    if (!Array.isArray(miniatures) || miniatures.length === 0) {
        return res.status(400).json({ error: 'Request body must be a non-empty array of miniatures.' });
    }

    // Optional: Add server-side validation for each miniature object in the array
    for (const miniature of miniatures) {
        if (!miniature.id || !miniature.modelName || !miniature.gameSystem || !miniature.army || !miniature.status || miniature.modelCount === undefined) {
            return res.status(400).json({ error: 'One or more miniatures in the array are missing required fields.' });
        }
    }

    try {
        const db = getDb();
        const result = await db.collection('miniatures').insertMany(miniatures);
        
        // Fetch the newly inserted documents to return them, excluding the MongoDB `_id`
        const newDocs = await db.collection('miniatures').find({ _id: { $in: Object.values(result.insertedIds) } }, { projection: { _id: 0 } }).toArray();

        res.status(201).json(newDocs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to bulk-add miniatures' });
    }
});

app.put('/api/miniatures/:id', async (req, res) => {
  const { id } = req.params;
  const { modelName, gameSystem, army, status, modelCount } = req.body;
  
  // Exclude the 'id' field from the update payload
  const updatePayload = { modelName, gameSystem, army, status, modelCount };

  try {
    const db = getDb();
    const result = await db.collection('miniatures').updateOne(
      { id: id },
      { $set: updatePayload }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Miniature not found' });
    }
    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update miniature' });
  }
});

app.delete('/api/miniatures/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDb();
    const result = await db.collection('miniatures').deleteOne({ id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Miniature not found' });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete miniature' });
  }
});


// Start the server after attempting to connect to the database
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    if (!getDb()) {
        console.warn('*********************************************************************');
        console.warn('** WARNING: Database connection failed. API will be unavailable.   **');
        console.warn('** Please ensure MongoDB is running and MONGODB_URI is set in .env **');
        console.warn('*********************************************************************');
    }
  });
}

startServer();