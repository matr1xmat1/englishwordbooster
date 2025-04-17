// app.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { generate } from "random-words";
import translate from "translate-google";

const app = express();
const PORT = 3000;

app.use(cors()); // Allow frontend access

app.get("/api/word", async (req, res) => {
  const word = generate();

  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Word not found`);

    const data = await response.json();
    const definition = data[0].meanings[0].definitions[0].definition;
    const example =
      data[0].meanings[0].definitions[0].example || "No example available";

    // Translate definition to Bangla
    const translated = await translate(definition, { to: "bn" });

    res.json({
      word,
      definition,
      example,
      translation: translated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
