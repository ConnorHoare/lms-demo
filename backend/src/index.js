require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const gameRoutes = require('./routes/games');
const playerRoutes = require('./routes/players')
const roundRoutes = require('./routes/rounds');
const pickRoutes = require('./routes/picks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', gameRoutes);
app.use('/api', playerRoutes);
app.use('/api', roundRoutes);
app.use('/api', pickRoutes);

// Sample Routes need to be replaced
app.get('/', (req, res) => {
    res.send("Last man standing backend API")
})

const PORT = process.env.PORT || 4840;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})