import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasksForBoard,
  updateTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);
router.get("/board/:boardId", asyncHandler(getTasksForBoard));
router.post("/", asyncHandler(createTask));
router.route("/:id").get(asyncHandler(getTask)).patch(asyncHandler(updateTask)).delete(asyncHandler(deleteTask));

export default router;
