const express = require('express');
const router = express.Router({ mergeParams: true });
const Task = require('../models/task.model');
const authMiddleware = require('../middleware/auth.middleware');

// POST /api/projects/:projectId/tasks - Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const newTask = new Task({
      title,
      description,
      project: req.params.projectId,
      assignedTo,
      dueDate,
      createdBy: req.user.id
    });

    await newTask.save();

    // ✅ Emit WebSocket notification
    const io = req.app.get('io');
    io.emit('taskAssigned', {
      message: `🆕 New task "${title}" assigned.`,
      taskId: newTask._id,
      projectId: req.params.projectId
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error('❌ Task creation error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// GET /api/projects/:projectId/tasks - Get all tasks for a project
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

module.exports = router;
