const express = require("express");
const supabase = require("../models/db");
const router = express.Router();

// Add player to a game
router.post("/players", async (req, res) => {
  const { user_id, game_id } = req.body;
  if (!user_id || !game_id) {
    return res.status(400).json({ error: "User Id and Game Id are required" });
  }

  try {
    const { data: existingPlayer, error: checkError } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", user_id)
      .eq("game_id", game_id)
      .single();

    if (existingPlayer) {
      return res.status(409).json({ error: "User is already in this game" });
    }

    const { data, error } = await supabase
      .from("players")
      .insert([{ user_id: user_id, game_id: game_id }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all players in a game
router.get("/players/game/:game_id", async (req, res) => {
  const { game_id } = req.params;

  const { data, error } = await supabase
    .from("players")
    .select("*, users (username, email)")
    .eq("game_id", game_id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

// Update players game status
router.patch("/players/:id", async (req, res) => {
  const { id } = req.params;
  const { is_active, eliminated_at } = req.body;

  const { data, error } = await supabase
    .from("players")
    .update({ is_active, eliminated_at })
    .eq("id", id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

module.exports = router;
