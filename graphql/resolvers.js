const Task = require("../models/task");
const User = require("../models/User");
const auth = require("../middleware/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) throw new Error("Not authenticated"); 
      const user = await User.findById(context.user.id);

      if (!user) {
        throw new Error("User not found in database");
      }

      return user;
    },

    myTask: async (parent, args, context) => {
      if (!context.user) throw new Error("Not Authenticated");
      return await Task.find({ userId: context.user.id });
    },

    task: async (parent, { id }, context) => {
      return await Task.findOne({ _id: id, userId: context.user.id });
    },
  },

  Mutation: {
    createTask: async (parent, { title, description }, context) => {
      if (!context.user) throw new Error("You must be logged in");
      const task = new Task({
        title,
        description,
        completed: false,
        userId: context.user.id,
      });
      return await task.save();
    },

    toggleTask: async (parent, { id }, context) => {
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: context.user._id },
        { completed: true },
        { new: true }
      );
      return task;
    },

    deleteTask: async (parent, { id }, context) => {
      const task = await Task.findOneAndDelete({
        _id: id,
        userId: context.user._id,
      });
      return task;
    },
  },

  Task: {
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
};

module.exports = resolvers;
