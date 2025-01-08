require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

// Sample Routes need to be replaced
app.get('/', (req, res) => {
    res.send("Last man standing backend API")
})

const PORT = process.env.PORT || 4840;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})