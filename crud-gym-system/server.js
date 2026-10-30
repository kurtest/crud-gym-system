const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gymdb';

app.use(express.json());
app.use(express.static(path.join(_dirname, 'public')));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/members', require('./routes/members'));

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log('Server running at http://localhost:${PORT}'));
    })
    .catch((err) => console.error('MongoDB connection error:', err.message));