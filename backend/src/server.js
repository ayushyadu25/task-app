import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const isLocalDevOrigin = (origin) => /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
const allowedOrigins = [
  ...(process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) || []),
];
const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedOrigin =
        !origin ||
        uniqueAllowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && isLocalDevOrigin(origin));

      if (isAllowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "TaskFlow" });
});

app.get("/", (_req, res) => {
  res.json({
    app: "TaskFlow API",
    status: "running",
    health: "/api/health",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`TaskFlow API running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start TaskFlow API:", error.message);
    process.exit(1);
  });
