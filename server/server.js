import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let db;

// API routes
app.get('/api/miniatures', async (req, res) => {
  try {
    const miniatures = await db.all('SELECT * FROM miniatures');
    res.json(miniatures);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch miniatures' });
  }
});

app.post('/api/miniatures', async (req, res) => {
  const { id, modelName, gameSystem, army, status, modelCount } = req.body;
  if (!id || !modelName || !gameSystem || !army || !status || modelCount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await db.run(
      'INSERT INTO miniatures (id, modelName, gameSystem, army, status, modelCount) VALUES (?, ?, ?, ?, ?, ?)',
      [id, modelName, gameSystem, army, status, modelCount]
    );
    res.status(201).json(req.body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add miniature' });
  }
});

app.put('/api/miniatures/:id', async (req, res) => {
  const { id } = req.params;
  const { modelName, gameSystem, army, status, modelCount } = req.body;
  try {
    const result = await db.run(
      'UPDATE miniatures SET modelName = ?, gameSystem = ?, army = ?, status = ?, modelCount = ? WHERE id = ?',
      [modelName, gameSystem, army, status, modelCount, id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Miniature not found' });
    }
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update miniature' });
  }
});

app.delete('/api/miniatures/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.run('DELETE FROM miniatures WHERE id = ?', id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Miniature not found' });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete miniature' });
  }
});


// Start the server after initializing the database
async function startServer() {
  db = await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
