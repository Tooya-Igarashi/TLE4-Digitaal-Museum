const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/ping", (req, res) => {
  res.json({ ok: true, apiUrl: process.env.API_URL });
});

app.listen(PORT, () => console.log(`API listening on ${PORT}`));
