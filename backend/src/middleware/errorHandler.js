import { ZodError } from "zod";

export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      message: "Validation failed.",
      errors,
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({ message: "Invalid id supplied." });
    return;
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Something went wrong.",
  });
};
