const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const router = express.Router();

// Setup multer storage (save to /uploads/)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// CREATE user (POST)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "";
    const newUser = await User.create({ username, email, password, image });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ all users (GET)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ single user (GET)
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE user (PUT)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const update = { username, email, password };
    if (req.file) {
      update.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
