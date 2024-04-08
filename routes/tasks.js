import express from "express";
import verifyToken from "../middleware/auth.js";
import User from "../model/user.js";

const router = express.Router();

// creating a new task
router.post("/tasks", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { taskName, taskDesc, reminderTime } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTask = {
      taskName,
      taskDesc,
      reminderTime,
    };

    user.tasks.push(newTask);
    await user.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// for getting all tasks
router.get("/tasks", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate("tasks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ tasks: user.tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get a specific task
router.get('/tasks/:taskId', verifyToken, async (req, res)=> {
  try {
    const userId = req.userId;
    const taskId = req.params.taskId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const task = user.tasks.find(task => task._id.toString() === taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task found successfully", task });

  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

//updating a specific task
router.put("/tasks/:taskId", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.taskId;

    const { taskName, taskDesc, reminderTime } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() == taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    //update the task
    user.tasks[taskIndex].taskName = taskName;
    user.tasks[taskIndex].taskDesc = taskDesc;
    user.tasks[taskIndex].reminderTime = reminderTime;

    await user.save();

    res.status(200).json({
      message: "Task updated successfully",
      task: user.tasks[taskIndex],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//deleting a specific task
router.delete("/tasks/:taskId", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const taskId = req.params.taskId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() == taskId
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    // removing task from array
    user.tasks.splice(taskIndex, 1);

    await user.save();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
