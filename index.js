import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// Example use:
// https://YOUR-RENDER-APP.onrender.com/reviews?placeId=YOUR_PLACE_ID&apiKey=YOUR_KEY
app.get("/reviews", async (req, res) => {
  const { placeId, apiKey } = req.query;
  if (!placeId || !apiKey) {
    return res.status(400).json({ error: "Missing placeId or apiKey" });
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Google API", details: error.message });
  }
});

app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
