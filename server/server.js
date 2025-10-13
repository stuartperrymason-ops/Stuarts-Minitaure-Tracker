import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';
import { ObjectId } from 'mongodb';

async function seedGameSystems() {
  const db = getDb();
  if (!db) return;
  const gameSystemsCollection = db.collection('gamesystems');
  const count = await gameSystemsCollection.countDocuments();
  if (count === 0) {
      console.log('Seeding initial game systems...');
      const initialGameSystems = [
          "Marvel: Crisis Protocol", "Battletech", "Star Wars: Legion", "Star Wars: Shatterpoint",
          "Middle-earth Strategy Battle Game", "Warhammer: The Old World", "Warhammer: Age of Sigmar",
          "Warhammer 40,000", "Dune", "Trench Crusade", "Legion Imperialis", "Conquest - Last Argument of Kings"
      ].map(name => ({ name }));
      await gameSystemsCollection.insertMany(initialGameSystems);
      console.log('Finished seeding game systems.');
  }
}

// Connect to the database on startup
connectToDatabase().then(() => {
  seedGameSystems();
});

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for bulk imports

// Middleware to check for DB connection
app.use((req, res, next) => {
  if (!getDb()) {
    res.status(503).json({ message: 'Service Unavailable: Database not connected.' });
    return;
  }
  next();
});

// GET all game systems
app.get('/api/gamesystems', async (req, res) => {
  try {
    const systems = await getDb().collection('gamesystems').find({}).sort({ name: 1 }).toArray();
    res.json(systems.map(s => s.name));
  } catch (error) {
    console.error('GET /api/gamesystems error:', error);
    res.status(500).json({ message: 'Failed to fetch game systems', error: error.message });
  }
});

// POST a new game system
app.post('/api/gamesystems', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ message: 'Game system name must be a non-empty string.' });
    }
    const trimmedName = name.trim();
    const existing = await getDb().collection('gamesystems').findOne({ name: { $regex: new RegExp(`^${trimmedName}$`, 'i') } });
    if (existing) {
      return res.status(409).json({ message: 'Game system already exists.' });
    }
    const result = await getDb().collection('gamesystems').insertOne({ name: trimmedName });
    res.status(201).json({ _id: result.insertedId, name: trimmedName });
  } catch (error) {
    console.error('POST /api/gamesystems error:', error);
    res.status(500).json({ message: 'Failed to create game system', error: error.message });
  }
});


// GET all miniatures
app.get('/api/miniatures', async (req, res) => {
  try {
    const miniatures = await getDb().collection('miniatures').find({}).toArray();
    // Frontend expects 'id', MongoDB uses '_id'. Let's transform.
    res.json(miniatures.map(m => ({ ...m, id: m._id.toString(), _id: undefined })));
  } catch (error) {
    console.error('GET /api/miniatures error:', error);
    res.status(500).json({ message: 'Failed to fetch miniatures', error: error.message });
  }
});

// POST a new miniature
app.post('/api/miniatures', async (req, res) => {
  try {
    const miniatureData = req.body;
    // The frontend sends an 'id', which we should ignore and let MongoDB generate '_id'
    delete miniatureData.id; 
    delete miniatureData._id;
    const result = await getDb().collection('miniatures').insertOne(miniatureData);
    const newMiniature = { ...miniatureData, id: result.insertedId.toString() };
    res.status(201).json(newMiniature);
  } catch (error) {
    console.error('POST /api/miniatures error:', error);
    res.status(500).json({ message: 'Failed to create miniature', error: error.message });
  }
});

// PUT (update) a miniature
app.put('/api/miniatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid miniature ID format.' });
    }
    const updateData = req.body;
    // Don't allow updating the immutable _id field
    delete updateData._id; 
    delete updateData.id;
    const result = await getDb().collection('miniatures').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
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

// DELETE a miniature
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

// POST /api/miniatures/bulk-import (for CSV)
app.post('/api/miniatures/bulk-import', async (req, res) => {
  try {
    const miniatures = req.body;
    if (!Array.isArray(miniatures) || miniatures.length === 0) {
      return res.status(400).json({ message: 'Request body must be a non-empty array of miniatures.' });
    }
    const miniaturesToInsert = miniatures.map(m => {
        delete m.id;
        delete m._id;
        return m;
    });
    const result = await getDb().collection('miniatures').insertMany(miniaturesToInsert, { ordered: false });
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
        { _id: { $in: objectIds } },
        { $set: updates }
    );
    if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'No matching miniatures found to update.' });
    }
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});