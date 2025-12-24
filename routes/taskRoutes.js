const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id });
  res.json(tasks);
});

router.get("/:id", auth, async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.patch("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Task deleted" });
});

module.exports = router;
