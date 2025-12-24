const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id }); //post
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ msg: "Create Error" });
  }
};

exports.getTask = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({ userId: req.user.id })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
        currentPage: page,
      },
      data: tasks,
    });
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(404).json({ msg: "Get Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ msg: "No Task" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ msg: "Update Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ msg: "no task" });
    res.status(200).json({ msg: "Delete Successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(400).json({ msg: "Delete Error" });
  }
};
