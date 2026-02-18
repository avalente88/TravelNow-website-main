'use strict';

const express = require("express");
const path = require("path");
const router = require("./router");
const { PORT } = require("./config");

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

const nodemailer = require("nodemailer");

// ROTA PARA ENVIAR EMAIL DO FORMULÁRIO
app.post("/send-email", async (req, res) => {
  const { fullname, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_TO,
      subject: "📩 Nova mensagem do site",
      text: `
Nome: ${fullname}
Email: ${email}

Mensagem:
${message}
      `
    });

    res.json({ success: true });

  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ success: false, error: "Erro ao enviar email" });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
