import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 10000;

app.get("/reviews", async (req, res) => {
  const { placeId, apiKey } = req.query;

  if (!placeId || !apiKey) {
    return res.status(400).json({ error: "Missing placeId or apiKey" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`
    );
    const data = await response.json();

    if (!data.result) {
      return res.status(404).json({ error: "No reviews found" });
    }

    res.json({
      name: data.result.name,
      rating: data.result.rating,
      reviews: data.result.reviews,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));

