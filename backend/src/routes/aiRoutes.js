import { Router } from "express";
import { suggestEstimate } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(protect);
router.post("/task-estimate", asyncHandler(suggestEstimate));

export default router;
