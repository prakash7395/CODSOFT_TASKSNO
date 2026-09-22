const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Project = require("./models/Project");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Project Management Tool Backend is running!",
  });
});

// Get all projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
});

// Create a project
app.post("/api/projects", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      tasks: [],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
});

// Add a task
app.post("/api/projects/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, assignee, deadline } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Task name is required",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.tasks.push({
      name: name.trim(),
      assignee: assignee || "Not assigned",
      deadline: deadline || "No deadline",
      status: "To Do",
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add task",
      error: error.message,
    });
  }
});

// Update task status
app.patch(
  "/api/projects/:projectId/tasks/:taskId",
  async (req, res) => {
    try {
      const { projectId, taskId } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "To Do",
        "In Progress",
        "Completed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid task status",
        });
      }

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({
          message: "Project not found",
        });
      }

      const task = project.tasks.id(taskId);

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      task.status = status;

      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({
        message: "Failed to update task",
        error: error.message,
      });
    }
  }
);

// Delete project
app.delete("/api/projects/:projectId", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });