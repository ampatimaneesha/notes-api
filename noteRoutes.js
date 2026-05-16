const express = require('express');
const router = express.Router();
const db = require('./db');
const auth = require('./middleware/auth');

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await db('notes')
      .insert({
        title,
        content,
        user_id: req.user.id
      })
      .returning('*');

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await db('notes')
      .where({ user_id: req.user.id });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await db('notes')
      .where({ id: req.params.id, user_id: req.user.id })
      .update(req.body)
      .returning('*');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete note
router.delete('/:id', auth, async (req, res) => {
  try {
    await db('notes')
      .where({ id: req.params.id, user_id: req.user.id })
      .del();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     responses:
 *       200:
 *         description: List of notes
 */
/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Note
 *               content:
 *                 type: string
 *                 example: This is my note
 *     responses:
 *       200:
 *         description: Note created
 */