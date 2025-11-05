const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const router = express.Router();

// GET /api/files/:id - Stream image from GridFS
router.get("/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads"
    });

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId));

    // Handle errors
    downloadStream.on("error", (err) => {
      console.error("Download stream error:", err);
      return res.status(404).json({ message: "File not found" });
    });

    // Get file info for content-type
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray();
    if (files.length > 0 && files[0].contentType) {
      res.set("Content-Type", files[0].contentType);
    }

    // Set cache headers for better performance
    res.set("Cache-Control", "public, max-age=31536000");

    // Stream file to response
    downloadStream.pipe(res);
  } catch (err) {
    console.error("File retrieval error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
