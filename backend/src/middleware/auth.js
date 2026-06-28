import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication token is required.");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      throw new HttpError(401, "The account for this token no longer exists.");
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      next(new HttpError(401, "Your session has expired. Please log in again."));
      return;
    }

    next(error);
  }
};
