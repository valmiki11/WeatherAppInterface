const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./recommendation.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// API endpoint to get products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM Products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API endpoint to add a rating
app.post('/api/ratings', (req, res) => {
    const { user_id, product_id, rating } = req.body;
    db.run('INSERT INTO Ratings (user_id, product_id, rating, timestamp) VALUES (?, ?, ?, ?)', [user_id, product_id, rating, new Date()], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});