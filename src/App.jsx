import { useState, useEffect } from "react";
import "./App.css";

const API_URL =
  "https://project-management-tool-codsoft-1.onrender.com/api/projects";

function App() {
  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [taskName, setTaskName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const [loading, setLoading] = useState(true);

  // Load projects from the live backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
      alert("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Create project
  const addProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      setProjects((currentProjects) => [data, ...currentProjects]);

      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
      alert(error.message);
    }
  };

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    if (!selectedProject || !taskName.trim()) {
      alert("Please select a project and enter a task");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${selectedProject}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName,
            assignee: assignee,
            deadline: deadline,
          }),
        }
      );

      const updatedProject = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedProject.message || "Failed to add task"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project._id === updatedProject._id
            ? updatedProject
            : project
        )
      );

      setTaskName("");
      setAssignee("");
      setDeadline("");
      setSelectedProject("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert(error.message);
    }
  };

  // Change task status
  const changeStatus = async (
    projectId,
    taskId,
    newStatus
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/${projectId}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const updatedProject = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedProject.message ||
            "Failed to update task status"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project._id === updatedProject._id
            ? updatedProject
            : project
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      alert(error.message);
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${projectId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project._id !== projectId
        )
      );

      if (selectedProject === projectId) {
        setSelectedProject("");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(error.message);
    }
  };

  const totalTasks = projects.reduce(
    (total, project) => total + project.tasks.length,
    0
  );

  const completedTasks = projects.reduce(
    (total, project) =>
      total +
      project.tasks.filter(
        (task) => task.status === "Completed"
      ).length,
    0
  );

  const inProgressTasks = projects.reduce(
    (total, project) =>
      total +
      project.tasks.filter(
        (task) => task.status === "In Progress"
      ).length,
    0
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Project Management Tool</h1>
            <p>
              Manage projects, tasks, deadlines and progress
            </p>
          </div>

          <div className="header-badge">
            React + Node.js + MongoDB
          </div>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div>
              <h3>Total Projects</h3>
              <strong>{projects.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <h3>Total Tasks</h3>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>In Progress</h3>
              <strong>{inProgressTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>Completed</h3>
              <strong>{completedTasks}</strong>
            </div>
          </div>
        </section>

        <section className="forms">
          <div className="form-card">
            <div className="form-title">
              <span className="form-number">01</span>

              <div>
                <h2>Create Project</h2>
                <p>Start a new project</p>
              </div>
            </div>

            <form onSubmit={addProject}>
              <label>Project Name</label>

              <input
                type="text"
                placeholder="Example: Portfolio Website"
                value={projectName}
                onChange={(e) =>
                  setProjectName(e.target.value)
                }
              />

              <label>Description</label>

              <textarea
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(e.target.value)
                }
              />

              <button type="submit">
                + Create Project
              </button>
            </form>
          </div>

          <div className="form-card">
            <div className="form-title">
              <span className="form-number">02</span>

              <div>
                <h2>Add Task</h2>
                <p>Assign and manage a task</p>
              </div>
            </div>

            <form onSubmit={addTask}>
              <label>Select Project</label>

              <select
                value={selectedProject}
                onChange={(e) =>
                  setSelectedProject(e.target.value)
                }
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              <label>Task Name</label>

              <input
                type="text"
                placeholder="Example: Create Homepage"
                value={taskName}
                onChange={(e) =>
                  setTaskName(e.target.value)
                }
              />

              <label>Assign To</label>

              <input
                type="text"
                placeholder="Example: Prakash"
                value={assignee}
                onChange={(e) =>
                  setAssignee(e.target.value)
                }
              />

              <label>Deadline</label>

              <input
                type="date"
                value={deadline}
                onChange={(e) =>
                  setDeadline(e.target.value)
                }
              />

              <button type="submit">
                + Add Task
              </button>
            </form>
          </div>
        </section>

        <section className="projects">
          <div className="section-heading">
            <div>
              <h2>My Projects</h2>
              <p>
                View and manage your projects and tasks
              </p>
            </div>

            <span className="project-count">
              {projects.length} Projects
            </span>
          </div>

          {loading ? (
            <div className="empty">
              <h3>Loading projects...</h3>
              <p>
                Connecting to the live backend.
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📁</div>

              <h3>No projects yet</h3>

              <p>
                Create your first project using the form above.
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                className="project-card"
                key={project._id}
              >
                <div className="project-header">
                  <div className="project-info">
                    <div className="project-icon">
                      📁
                    </div>

                    <div>
                      <h3>{project.name}</h3>

                      <p>
                        {project.description ||
                          "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div className="project-actions">
                    <span className="task-count">
                      {project.tasks.length} Tasks
                    </span>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        deleteProject(project._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {project.tasks.length === 0 ? (
                  <div className="no-task">
                    <span>📋</span>
                    No tasks added to this project yet.
                  </div>
                ) : (
                  <div className="task-list">
                    {project.tasks.map((task) => (
                      <div
                        className="task"
                        key={task._id}
                      >
                        <div className="task-info">
                          <div className="task-check">
                            {task.status === "Completed"
                              ? "✓"
                              : "○"}
                          </div>

                          <div>
                            <h4>{task.name}</h4>

                            <div className="task-details">
                              <span>
                                👤 {task.assignee}
                              </span>

                              <span>
                                📅 {task.deadline}
                              </span>
                            </div>
                          </div>
                        </div>

                        <select
                          className={`status-${task.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          value={task.status}
                          onChange={(e) =>
                            changeStatus(
                              project._id,
                              task._id,
                              e.target.value
                            )
                          }
                        >
                          <option>To Do</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </main>

      <footer>
        <p>
          Project Management Tool • Built with React,
          Node.js & MongoDB
        </p>
      </footer>
    </div>
  );
}

export default App;