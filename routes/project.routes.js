const express = require('express');
const router = express.Router();
const Project = require('../models/project.model');
const authMiddleware = require('../middleware/auth.middleware');
const Task = require('../models/task.model');
// POST /api/projects - Create a new project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    const newProject = new Project({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id] // Creator is the first member
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// GET /api/projects - Get all projects where the user is a member
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id }).populate('createdBy', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// ✅ NEW: GET /api/projects/:id - Get a specific project by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Optional: check if the user is a member
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ✅ NEW: PUT /api/projects/:id - Update a project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Optional: only creator can update
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can update the project' });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the creator can delete the project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add a member to a project
router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can add members' });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ error: 'User already a member' });
    }

    project.members.push(userId);
    await project.save();

    res.json({ message: 'Member added successfully', project });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// DELETE /api/projects/:projectId/members/:userId - Remove member from project
router.delete('/:projectId/members/:userId', authMiddleware, async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Only the project creator can remove members
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only project creator can remove members' });
    }

    // Prevent removing the creator themselves
    if (userId === project.createdBy.toString()) {
      return res.status(400).json({ error: 'Cannot remove project creator' });
    }

    // Check if member exists
    if (!project.members.includes(userId)) {
      return res.status(404).json({ error: 'User is not a project member' });
    }

    // Remove the member
    project.members = project.members.filter((id) => id.toString() !== userId);
    await project.save();

    res.json({ message: 'Member removed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// POST /api/projects/:projectId/tasks - Create a task in a project
router.post('/:projectId/tasks', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, dueDate, assignedTo } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      project: projectId,
      createdBy: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});





module.exports = router;
