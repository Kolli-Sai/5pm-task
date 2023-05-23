const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task");
const router = express.Router();

router.post("/task", createTask);
router.get("/tasks", getTasks);
router.patch("/task/:id", updateTask);
router.delete("/task/:id", deleteTask);

module.exports = router;
