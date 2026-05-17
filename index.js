
// // const express = require('express');
// // const cors = require('cors');
// // const authRoutes = require('./authRoutes'); // 👈 


// // const app = express();

// // app.use(cors());            // ✅ enable frontend access
// // app.use(express.json());
// // app.use('/api/auth', authRoutes);
// // app.use('/auth', require('./authRoutes'));
// // app.use('/notes', require('./noteRoutes'));

// // app.listen(3000, () => {
// //   console.log("Server running on port 3000");
// // });
// const swaggerUi = require("swagger-ui-express");
// const swaggerJsdoc = require("swagger-jsdoc");

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Notes API",
//       version: "1.0.0",
//       description: "API documentation for Notes App",
//     },
//     servers: [
//       {
//         url: "url: "https://notes-api-mrno.onrender.com",
//       },
//     ],
//   },
//   apis: ["./authRoutes.js", "./noteRoutes.js"],
// };

// const swaggerSpec = swaggerJsdoc(options);

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// const express = require('express');
// const app = express();

// const cors = require('cors');
// app.use(cors());

// app.use(express.json());

// // 👇 IMPORT your auth routes
// const authRoutes = require('./authRoutes');

// // 👇 USE your auth routes (THIS IS STEP 3)
// app.use('/api/auth', authRoutes);

// // 👇 your notes routes (if you already have)
// const noteRoutes = require('./noteRoutes');
// app.use('/api/notes', noteRoutes);

// // 👇 start server
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
require("dotenv").config();
const express = require('express');
const app = express();

const cors = require('cors');
const { Pool } = require("pg");
app.use(cors());


app.use(cors({
  origin: "https://notes-app-jipg.vercel.app",
  credentials: true
}));
app.use(express.json());
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ IMPORT SWAGGER
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// ✅ SWAGGER CONFIG
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes API",
      version: "1.0.0",
    },

    // 🔴 THIS IS REQUIRED FOR AUTHORIZE BUTTON
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // 🔴 THIS ENABLES AUTHORIZE GLOBALLY
    security: [
      {
        bearerAuth: [],
      },
    ],

    servers: [
      {
        url: "https://notes-api-mrno.onrender.com/",
      },
    ],
  },

  apis: ["./authRoutes.js", "./noteRoutes.js"],
};

const swaggerSpec = swaggerJsdoc(options);

// ✅ SWAGGER ROUTE (AFTER app CREATED)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// 👇 YOUR ROUTES
const authRoutes = require('./authRoutes');
app.use('/api/auth', authRoutes);

const noteRoutes = require('./noteRoutes');
app.use('/api/notes', noteRoutes);


// ✅ START SERVER




const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend running");
});
app.get("/test-db", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT NOW()"
    );

    res.json({
      success: true,
      time: result.rows[0]
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});