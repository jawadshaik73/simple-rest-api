const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize data file
const initializeDataFile = async () => {
    try {
        await fs.access(DATA_FILE);
    } catch {
        const initialData = [
            { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, occupation: 'Developer' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, occupation: 'Designer' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 45, occupation: 'Manager' }
        ];
        await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
};

// Read data from file
const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return [];
    }
};

// Write data to file
const writeData = async (data) => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data file:', error);
    }
};

// Routes

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await readData();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/users/:id - Get user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const users = await readData();
        const user = users.find(u => u.id === parseInt(req.params.id));

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// POST /api/users - Create a new user
app.post('/api/users', async (req, res) => {
    try {
        const users = await readData();
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            ...req.body
        };

        // Validate required fields
        if (!newUser.name || !newUser.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        users.push(newUser);
        await writeData(users);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT /api/users/:id - Update user
app.put('/api/users/:id', async (req, res) => {
    try {
        const users = await readData();
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user while preserving ID
        const updatedUser = { ...users[userIndex], ...req.body, id: userId };
        users[userIndex] = updatedUser;

        await writeData(users);

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /api/users/:id - Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const users = await readData();
        const userId = parseInt(req.params.id);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deletedUser = users.splice(userIndex, 1)[0];
        await writeData(users);

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, async () => {
    await initializeDataFile();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/users`);
});
