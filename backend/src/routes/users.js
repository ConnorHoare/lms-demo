const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const supabase = require('../models/db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Get all users
router.get('/users', async (req, res) => {
    const {data, error} = await supabase.from('users').select('*');
    if(error) return res.status(500).json({error: error.message});
    res.json(data)
});

// Create a User
router.post('/users/register', async (req, res) => {
    const {email, password, username} = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({error: 'Email and Username and Password are required'});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const {data, error} = await supabase.from('users').insert([{email, password: hashedPassword, username}]);
        if(error) throw error;
        res.status(201).json({message: "User succesfully created"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }  
});

// Login User
router.post('/users/login', async (req, res) => {
    const {identifier, password} = req.body

    if(!identifier || !password) {
        return res.status(400).json({error: "Email or Username not provided with Password"});
    }

    try {
        const {data: user, error} = await supabase.from('users').select('*').or(`email.eq.${identifier},username.eq.${identifier}`).single();
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid email/username or password' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email/username or password' });
        }

        const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


module.exports = router;