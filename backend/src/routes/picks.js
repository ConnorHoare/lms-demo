const express = require("express");
const supabase = require("../models/db");
const router = express.Router();

// Submit a pick for a round
router.post("/picks", async (req, res) => {
  const { player_id, team, round_id } = req.body;

  if (!player_id || !team || !round_id) {
    return res
      .status(400)
      .json({ error: "Player Id, team, round are all required" });
  }

  const { data, error } = await supabase
    .from("picks")
    .insert([{ player_id, team, round_id }]);

  if (error) {
    res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

// Retrieve picks for a specific round
router.get("/picks/round/:round_id", async (req, res) => {
  const { round_id } = req.params;
  const {data, error} = await supabase
  .from('picks')
  .select('*')
  .eq('round_id', round_id);

  if(error) {
    res.status(500).json({error: error.message})
  }

  res.status(200).json(data)
});

module.exports = router;
