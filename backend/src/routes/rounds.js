const express = require('express');
const supabase = require('../models/db');
const router = express.Router();

// Add new round to a game
router.post('/rounds', async (req, res) => {
    const {game_id, round_number, deadline} = req.body;

    if(!game_id || !round_number || !deadline) {
        return res.status(400).json({error: "Game ID, Round number or Deadline are all required."})
    }

    const {data, error} = await supabase.from('rounds').insert([{game_id, round_number, deadline}]);
    if(error) {
        return res.status(500).json({error: error.message})
    }
    res.status(201).json(data)
});

// Get all rounds for a game
router.get('/rounds/game/:game_id', async (req, res) => {
    const {game_id} = req.params;

    const {data, error} = await supabase
    .from('rounds')
    .select('*')
    .eq('game_id', game_id)
    .order('round_number', {ascending: true});

    if(error) {
        return res.status(500).json({error: error.message})
    }
    res.status(200).json(data)
});

module.exports = router;