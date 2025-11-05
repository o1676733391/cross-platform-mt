const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const { Readable } = require("stream");
const User = require("../models/User");
const router = express.Router();

// Setup multer storage (use memoryStorage for GridFS)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// CREATE user (POST)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let imageFileId = "";

    console.log("📝 Request body:", { username, email });
    console.log("📷 File received:", req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : "No file");

    // Upload image to GridFS if provided
    if (req.file) {
      console.log("🚀 Starting GridFS upload...");
      
      // Check if MongoDB is connected
      if (!mongoose.connection.db) {
        throw new Error("MongoDB not connected");
      }
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
      });

      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedAt: new Date()
        }
      });

      // Stream buffer to GridFS
      const readableStream = Readable.from(req.file.buffer);
      readableStream.pipe(uploadStream);

      // Wait for upload to finish
      await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => {
          console.log("✅ GridFS upload finished");
          resolve();
        });
        uploadStream.on("error", (error) => {
          console.error("❌ GridFS upload error:", error);
          reject(error);
        });
      });

      imageFileId = uploadStream.id.toString();
      console.log("💾 Saved fileId:", imageFileId);
    } else {
      console.log("⚠️ No file to upload");
    }

    const newUser = await User.create({ 
      username, 
      email, 
      password, 
      image: imageFileId 
    });
    
    console.log("✅ User created:", { 
      _id: newUser._id, 
      username: newUser.username,
      hasImage: !!newUser.image 
    });
    
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: err.message });
  }
});

// READ all users (GET)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    
    // Transform image field to full URL
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const usersWithImageUrls = users.map(user => {
      const userObj = user.toObject();
      if (userObj.image) {
        userObj.image = `${baseUrl}/api/files/${userObj.image}`;
      }
      return userObj;
    });
    
    res.json(usersWithImageUrls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ single user (GET)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Transform image field to full URL
    const userObj = user.toObject();
    if (userObj.image) {
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      userObj.image = `${baseUrl}/api/files/${userObj.image}`;
    }
    
    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE user (PUT)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = { username, email, password };
    
    // Upload new image to GridFS if provided
    if (req.file) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
      });

      // Delete old image if exists
      const user = await User.findById(req.params.id);
      if (user && user.image) {
        try {
          const { ObjectId } = require("mongodb");
          await bucket.delete(new ObjectId(user.image));
        } catch (deleteErr) {
          console.error("Error deleting old image:", deleteErr);
        }
      }

      // Upload new image
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedAt: new Date()
        }
      });

      const readableStream = Readable.from(req.file.buffer);
      readableStream.pipe(uploadStream);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      update.image = uploadStream.id.toString();
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete image from GridFS if exists
    if (user.image) {
      try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: "uploads"
        });
        const { ObjectId } = require("mongodb");
        await bucket.delete(new ObjectId(user.image));
      } catch (deleteErr) {
        console.error("Error deleting image:", deleteErr);
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
