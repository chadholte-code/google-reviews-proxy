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
    // New Places API (v1) endpoint and header format
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,rating,reviews,googleMapsUri`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "displayName,rating,reviews,googleMapsUri",
        },
      }
    );

    const data = await response.json();

    if (!data.reviews || data.reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found" });
    }

    res.json({
      name: data.displayName?.text || "Unknown Place",
      rating: data.rating,
      reviews: data.reviews.map((r) => ({
        author: r.authorAttribution?.displayName || "Anonymous",
        rating: r.rating,
        text: r.text?.text || "",
        publishTime: r.publishTime,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
