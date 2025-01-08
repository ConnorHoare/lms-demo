const express = require('express');
const supabase = require('../models/db');
const router = express.Router();

// Get all Games
router.get('/games', async (req, res) => {
    const {data, error} = await supabase.from('games').select('*');
    if(error) return res.status(500).json({error: error.message});
    res.status(200).json(data);
});

// Create new Game
router.post('/games', async (req, res) => {
    const {name, admin_id} = req.body;

    if(!name || !admin_id) return res.status(400).json({error: "No name or admin id provided"})
    
    const {data, error} = await supabase.from('games').insert([{name, admin_id, status: 'open'}])
    if (error) {
        return res.status(500).json({error: error.message})
    }
    res.status(201).json(data)
})

// Get Game by Status
router.get('/games/status/:status', async (req, res) => {
    const {status} = req.params;
    
    const validateStatuses = ['open', 'in-progress', 'completed'];
    if(!validateStatuses.includes(status)) {
        return res.status(400).json({error: "Invalid game status"})
    }

    const {data, error} = await supabase.from('games').select('*').eq('status', status);
    if(error) {
        return res.status(500).json({error: error.message})
    }

    res.status(200).json(data)
})

module.exports = router;