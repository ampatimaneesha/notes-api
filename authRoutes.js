const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// // 🔹 REGISTER
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // hash password
//     const hash = await bcrypt.hash(password, 10);

//     // insert user
//     const user = await db('users')
//       .insert({ username, password: hash })
//       .returning('*');

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // 🔹 LOGIN
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // find user
//     const user = await db('users')
//       .where({ username })
//       .first();

//     // check password
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // create token
//     const token = jwt.sign({ id: user.id }, "secretkey");

//     res.json({ token });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await db('users')
    .insert({ name, email, password: hashed })
    .returning('*');

  res.json(user);
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db('users').where({ email }).first();

  if (!user) return res.json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.json({ error: "Wrong password" });

  const token = jwt.sign({ id: user.id }, "secretkey");

  res.json({ token });
});


module.exports = router;
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register new user
 *     responses:
 *       200:
 *         description: User created
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Manisha
 *               email:
 *                 type: string
 *                 example: mani@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: User created
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: mani@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 */
/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               content:
 *                 type: string
 *                 example: Updated content
 *     responses:
 *       200:
 *         description: Note updated
 */


/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted
 */