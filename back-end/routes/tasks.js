const express = require("express");
const router = express.Router();
const Task = require("../model/tasks"); // Task model
const multerUpload = require("../config/multer"); // Multer config
const authen = require("../middleware/auth"); // JWT auth middleware

// // Create a new task (with optional file attachments)
// router.post("/", authen, multerUpload.array("files", 10), async (req, res) => {
//   try {
//     const { title, description, dueDate, status } = req.body;

//     // Collect uploaded file paths
//     const filePaths = req.files ? req.files.map((file) => file.path) : [];

//     const task = new Task({
//       title,
//       description,
//     //   dueDate,
//     //   status: status || "pending",
//       files: filePaths,
//       owner: req.user.id,
//     });

//     await task.save();
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Create a new task (with optional file attachments)
router.post("/", authen, multerUpload.array("files", 10), async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    // Save relative paths instead of absolute disk paths
    const filePaths = req.files
      ? req.files.map((file) => `uploads/${file.filename}`)
      : [];

    const task = new Task({
      title,
      description,
      dueDate,
      status: status || "pending",
      files: filePaths,
      owner: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all tasks for the authenticated user
router.get("/", authen, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single task by ID
router.get("/:id", authen, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.put("/:id", authen, multerUpload.array("files", 10), async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const filePaths = req.files ? req.files.map((file) => file.path) : [];

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      {
        title,
        description,
        dueDate,
        status,
        $push: { files: { $each: filePaths } }, // append new files
      },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
router.delete("/:id", authen, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
 