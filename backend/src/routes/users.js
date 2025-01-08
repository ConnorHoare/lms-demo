const express = require('express');
const supabase = require('../models/db');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
    const {data, error} = await supabase.from('users').select('*');
    if(error) return res.status(500).json({error: error.message});
    res.json(data)
});

// Create a User
router.post('/users', async (req, res) => {
    const {email, username} = req.body;

    if (!email || !username) {
        return res.status(400).json({error: 'Email and Username are required'})
    }

    const {data, error} = await supabase.from('users').insert([{email, username}]);
    if(error) {
        return res.status(500).json({error: error.message})
    }

    res.status(201).json(data)
})


module.exports = router;