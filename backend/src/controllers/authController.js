import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { loginSchema, registerSchema } from "../validators/schemas.js";
import { createToken } from "../utils/token.js";
import { HttpError } from "../utils/httpError.js";

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const register = async (req, res) => {
  const input = registerSchema.parse(req.body);
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new HttpError(409, "An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  res.status(201).json({
    user: formatUser(user),
    token: createToken(user._id),
  });
};

export const login = async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await User.findOne({ email: input.email });

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid email or password.");
  }

  res.json({
    user: formatUser(user),
    token: createToken(user._id),
  });
};

export const getMe = async (req, res) => {
  res.json({ user: formatUser(req.user) });
};
