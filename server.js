'use strict';

const express = require("express");
const path = require("path");
const router = require("./router");
const { PORT } = require("./config");


'use strict';

require("dotenv").config();   // ← LOAD .env FIRST

const http = require('http');
const fs = require('fs');
const url = require('url');
const Amadeus = require('amadeus');

const port = process.env.PORT || 3000;
const baseDir = process.cwd();

const app = express();

// Parse JSON
app.use(express.json());

// Serve static files (HTML, JS, CSS, images)
app.use(express.static(path.join(__dirname)));

// API routes
app.use("/", router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
