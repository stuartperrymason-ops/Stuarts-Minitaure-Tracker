import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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


// Start the server after initializing the database
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();