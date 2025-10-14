import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';
import { ObjectId } from 'mongodb';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectToDatabase();

const checkDbConnection = (req, res, next) => {
  if (!getDb()) {
    return res.status(503).json({ message: 'Database service is unavailable. Please try again later.' });
  }
  next();
};
app.use(checkDbConnection);

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
    delete updateData._id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid miniature ID format' });
    }

    const result = await getDb().collection('miniatures').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Miniature not found' });
    }
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
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid miniature ID format' });
    }
    const result = await getDb().collection('miniatures').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Miniature not found' });
    }
    res.status(204).send();
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

// POST to replace all miniatures
app.post('/api/miniatures/bulk-replace', async (req, res) => {
    try {
        const { miniatures } = req.body;
        if (!miniatures || !Array.isArray(miniatures)) {
            return res.status(400).json({ message: 'Invalid request: "miniatures" must be an array.' });
        }
        const miniaturesCollection = getDb().collection('miniatures');
        await miniaturesCollection.deleteMany({});
        if (miniatures.length > 0) {
            await miniaturesCollection.insertMany(miniatures);
        }
        res.status(201).json({ message: `${miniatures.length} miniatures imported successfully.`});
    } catch(error) {
        res.status(500).json({ message: 'Error replacing collection', error: error.message });
    }
});


// --- GAME SYSTEMS ROUTES ---
app.get('/api/gamesystems', async (req, res) => {
    try {
        const gameSystems = await getDb().collection('gamesystems').find({}).sort({ name: 1 }).toArray();
        res.json(gameSystems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching game systems', error: error.message });
    }
});

app.post('/api/gamesystems', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Game system name is required.' });
        }
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


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
