const { Task } = require("../models/Task");

const createTask = async (req, res) => {
  try {
    req.body.createdBy = req.user.userId;
    const task = await Task.create(req.body);
    res.json(task);
  } catch (error) {
    res.json({ error });
  }
};

const getTasks = async (req, res) => {
  try {
    const { userId } = req.user;
    const tasks = await Task.find({ createdBy: userId });
    res.json(tasks);
  } catch (error) {
    res.json({ error });
  }
};

const updateTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(
      { _id: id, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      res.json({ error: "task not found" });
    }
    res.json(task);
  } catch (error) {
    res.json({ error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const task = await Task.findByIdAndDelete({ _id: id, createdBy: userId });
    if (!task) {
      res.json({ error: "task not found" });
    }
    res.json(task);
  } catch (error) {
    res.json({ error });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
