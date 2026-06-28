import Board from "../models/Board.js";
import Task from "../models/Task.js";
import { boardCreateSchema, boardUpdateSchema } from "../validators/schemas.js";
import { HttpError } from "../utils/httpError.js";

export const getBoards = async (req, res) => {
  const boards = await Board.find({ owner: req.userId }).sort({ updatedAt: -1 });
  res.json({ boards });
};

export const getBoard = async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.userId });

  if (!board) {
    throw new HttpError(404, "Board not found.");
  }

  res.json({ board });
};

export const createBoard = async (req, res) => {
  const input = boardCreateSchema.parse(req.body);
  const board = await Board.create({ ...input, owner: req.userId });

  res.status(201).json({ board });
};

export const updateBoard = async (req, res) => {
  const input = boardUpdateSchema.parse(req.body);
  const board = await Board.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    input,
    { new: true, runValidators: true },
  );

  if (!board) {
    throw new HttpError(404, "Board not found.");
  }

  res.json({ board });
};

export const deleteBoard = async (req, res) => {
  const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.userId });

  if (!board) {
    throw new HttpError(404, "Board not found.");
  }

  await Task.deleteMany({ board: board._id, owner: req.userId });
  res.json({ message: "Board and related tasks deleted." });
};
