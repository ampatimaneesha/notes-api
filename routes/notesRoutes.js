const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ALL NOTES
router.get("/", async (req, res) => {
  try {

    const notes = await db("notes")
  .where({ trash: false })
  .select("*")
  .orderBy("id", "desc");

    res.json(notes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});
// ADD NOTE
router.post("/add", async (req, res) => {
  try {
    const { text, color } = req.body;

    const newNote = await db("notes")
      .insert({
        text,
        color,
      })
      .returning("*");

    res.json(newNote[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
//delete notes
router.delete("/:id", async (req, res) => {
  try {

    await db("notes")
      .where({ id: req.params.id })
      .del();

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});
// FAVORITE NOTE
router.put("/favorite/:id", async (req, res) => {
  try {
    const note = await db("notes")
      .where({ id: req.params.id })
      .first();

    const updated = await db("notes")
      .where({ id: req.params.id })
      .update({
        favorite: !note.favorite,
      })
      .returning("*");

    res.json(updated[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// UPDATE NOTE
router.put("/:id", async (req, res) => {
  try {

    const { text } = req.body;

    const updated = await db("notes")
      .where({ id: req.params.id })
      .update({
        text,
      })
      .returning("*");

    res.json(updated[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// GET TRASH NOTES
router.get("/trash/all", async (req, res) => {
  try {

    const trash = await db("notes")
      .where({ deleted: true })
      .orderBy("id", "desc");

    res.json(trash);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
});

// GET TRASH NOTES
router.get("/trash", async (req, res) => {
  try {

    const trashNotes = await db("notes")
      .where({ trash: true })
      .orderBy("id", "desc");

    res.json(trashNotes);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// MOVE NOTE TO TRASH
// MOVE NOTE TO TRASH
router.put("/trash/:id", async (req, res) => {
  try {

    const updated = await db("notes")
      .where({ id: req.params.id })
      .update({
        trash: true,
      })
      .returning("*");

    res.json(updated[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;