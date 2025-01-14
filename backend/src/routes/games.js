const express = require("express");
const supabase = require("../models/db");
const router = express.Router();

// Get all Games
router.get("/games", async (req, res) => {
  const { data, error } = await supabase.from("games").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
});

// Create new Game
router.post("/games", async (req, res) => {
  const { name, admin_id } = req.body;

  if (!name || !admin_id)
    return res.status(400).json({ error: "No name or admin id provided" });

  const { data, error } = await supabase
    .from("games")
    .insert([{ name, admin_id, status: "open" }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Get Game by Status
router.get("/games/status/:status", async (req, res) => {
  const { status } = req.params;

  const validateStatuses = ["open", "in-progress", "completed"];
  if (!validateStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid game status" });
  }

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("status", status);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(data);
});

//Get games by user
router.get("/games/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("players")
      .select("game_id, games(name, status)")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game information

router.get("/games/:gameId/details", async (req, res) => {
    const { gameId } = req.params;

    if (!gameId) {
        return res.status(400).json({ error: "Game ID is required." });
    }

    try {
        // Fetch game details
        const { data: game, error: gameError } = await supabase
            .from("games")
            .select("*")
            .eq("id", gameId)
            .single();

        if (gameError || !game) {
            console.error("Game fetch error:", gameError);
            return res.status(404).json({ error: "Game not found" });
        }

        // Fetch participants
        const { data: participants, error: participantsError } = await supabase
            .from("players")
            .select("user_id, users(username, email)")
            .eq("game_id", gameId);

        if (participantsError) {
            console.error("Participants fetch error:", participantsError);
            throw participantsError;
        }

        // Fetch rounds
        const { data: rounds, error: roundsError } = await supabase
            .from("rounds")
            .select("*")
            .eq("game_id", gameId);

        if (roundsError) {
            console.error("Rounds fetch error:", roundsError);
            throw roundsError;
        }

        // Combine and return the data
        res.status(200).json({
            game,
            participants,
            rounds,
        });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
