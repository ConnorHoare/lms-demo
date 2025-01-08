const express = require('express');
const supabase = require('../models/db');
const router = express.Router();

router.get('/users', async (req, res) => {
    const {data, error} = await supabase.from('users').select('*');
    if(error) return res.status(500).json({error: error.message});
    res.json(data)
});

module.exports = router;