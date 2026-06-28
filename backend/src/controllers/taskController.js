import Board from "../models/Board.js";
import Task from "../models/Task.js";
import { taskCreateSchema, taskUpdateSchema } from "../validators/schemas.js";
import { HttpError } from "../utils/httpError.js";

const ensureBoardOwner = async (boardId, userId) => {
  const board = await Board.findOne({ _id: boardId, owner: userId });

  if (!board) {
    throw new HttpError(404, "Board not found.");
  }

  return board;
};

export const getTasksForBoard = async (req, res) => {
  await ensureBoardOwner(req.params.boardId, req.userId);
  const tasks = await Task.find({ board: req.params.boardId, owner: req.userId }).sort({
    createdAt: -1,
  });

  res.json({ tasks });
};

export const getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, owner: req.userId });

  if (!task) {
    throw new HttpError(404, "Task not found.");
  }

  res.json({ task });
};

export const createTask = async (req, res) => {
  const input = taskCreateSchema.parse(req.body);
  await ensureBoardOwner(input.boardId, req.userId);

  const task = await Task.create({
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
    estimatedEffort: input.estimatedEffort,
    board: input.boardId,
    owner: req.userId,
  });

  res.status(201).json({ task });
};

export const updateTask = async (req, res) => {
  const input = taskUpdateSchema.parse(req.body);
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    input,
    { new: true, runValidators: true },
  );

  if (!task) {
    throw new HttpError(404, "Task not found.");
  }

  res.json({ task });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.userId });

  if (!task) {
    throw new HttpError(404, "Task not found.");
  }

  res.json({ message: "Task deleted." });
};
