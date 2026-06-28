import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "../controllers/boardController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);
router.route("/").get(asyncHandler(getBoards)).post(asyncHandler(createBoard));
router
  .route("/:id")
  .get(asyncHandler(getBoard))
  .patch(asyncHandler(updateBoard))
  .delete(asyncHandler(deleteBoard));

export default router;
