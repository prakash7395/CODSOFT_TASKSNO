const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    default: "Not assigned",
  },
  deadline: {
    type: String,
    default: "No deadline",
  },
  status: {
    type: String,
    default: "To Do",
  },
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    tasks: [taskSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);