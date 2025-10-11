import express from 'express';
import cors from 'cors';
import { connectToDatabase, getDb } from './database.js';
import { ObjectId } from 'mongodb';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to check for DB connection
app.use((req, res, next) => {
    if (!getDb()) {
        res.status(503).json({ message: 'Service Unavailable: Database not connected.' });
        return;
    }
    next();
});

// Routes

// GET all miniatures
app.get('/api/miniatures', async (req, res) => {
    try {
        const miniatures = await getDb().collection('miniatures').find({}).toArray();
        // The frontend expects 'id' but MongoDB uses '_id'. Let's transform.
        const transformedMiniatures = miniatures.map(m => ({ ...m, id: m._id.toString() }));
        res.json(transformedMiniatures);
    } catch (error) {
        console.error('Failed to fetch miniatures:', error);
        res.status(500).json({ message: 'Error fetching data from database' });
    }
});

// POST a new miniature
app.post('/api/miniatures', async (req, res) => {
    try {
        const miniatureData = req.body;
        // The frontend might send an 'id' property. MongoDB generates '_id'. We should remove it.
        delete miniatureData.id;
        const result = await getDb().collection('miniatures').insertOne(miniatureData);
        // Transform the inserted document to match frontend expectation
        const newMiniature = { ...miniatureData, id: result.insertedId.toString() };
        res.status(201).json(newMiniature);
    } catch (error) {
        console.error('Failed to add miniature:', error);
        res.status(500).json({ message: 'Error adding data to database' });
    }
});

// PUT (update) a miniature
app.put('/api/miniatures/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Remove id and _id from the update payload to avoid trying to update the immutable _id field
        delete updateData.id;
        delete updateData._id;

        const result = await getDb().collection('miniatures').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Miniature not found' });
        }
        res.json({ message: 'Miniature updated successfully' });
    } catch (error) {
        console.error('Failed to update miniature:', error);
        res.status(500).json({ message: 'Error updating data in database' });
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
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Failed to delete miniature:', error);
        res.status(500).json({ message: 'Error deleting data from database' });
    }
});

// POST bulk delete miniatures
app.post('/api/miniatures/bulk-delete', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid request: "ids" must be a non-empty array.' });
        }
        const objectIds = ids.map(id => new ObjectId(id));
        const result = await getDb().collection('miniatures').deleteMany({ _id: { $in: objectIds } });
        res.json({ message: `${result.deletedCount} miniatures deleted successfully.` });
    } catch (error) {
        console.error('Failed to bulk delete miniatures:', error);
        res.status(500).json({ message: 'Error during bulk delete operation.' });
    }
});

// POST bulk update miniatures
app.post('/api/miniatures/bulk-update', async (req, res) => {
    try {
        const { ids, updates } = req.body;
        if (!Array.isArray(ids) || ids.length === 0 || !updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Invalid request: "ids" and "updates" are required.' });
        }
        
        // Sanitize updates to prevent changing immutable fields
        delete updates.id;
        delete updates._id;

        const objectIds = ids.map(id => new ObjectId(id));
        await getDb().collection('miniatures').updateMany(
            { _id: { $in: objectIds } },
            { $set: updates }
        );
        
        // Fetch and return the updated documents so the frontend can update its state
        const updatedDocs = await getDb().collection('miniatures').find({ _id: { $in: objectIds } }).toArray();
        const transformedDocs = updatedDocs.map(m => ({ ...m, id: m._id.toString() }));
        res.json(transformedDocs);

    } catch (error) {
        console.error('Failed to bulk update miniatures:', error);
        res.status(500).json({ message: 'Error during bulk update operation.' });
    }
});


// Start server after connecting to DB
connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Server failed to start:", err);
    process.exit(1);
});
