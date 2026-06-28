import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id.");
const optionalDate = z
  .union([z.string().date(), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value === "" || value === null ? null : value));

const titleSchema = z.string().trim().min(2, "Task title must be at least 2 characters.").max(140);
const descriptionSchema = z.string().trim().max(1000);
const statusSchema = z.enum(["todo", "in-progress", "done"]);
const prioritySchema = z.enum(["low", "medium", "high"]);

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export const boardCreateSchema = z.object({
  title: z.string().trim().min(2, "Board title must be at least 2 characters.").max(100),
  description: z.string().trim().max(500).optional().default(""),
});

export const boardUpdateSchema = z
  .object({
    title: z.string().trim().min(2, "Board title must be at least 2 characters.").max(100).optional(),
    description: z.string().trim().max(500).optional(),
  })
  .refine(
  (value) => Object.keys(value).length > 0,
  "Send at least one board field to update.",
  );

export const taskCreateSchema = z.object({
  boardId: objectId,
  title: titleSchema,
  description: descriptionSchema.optional().default(""),
  status: statusSchema.optional().default("todo"),
  priority: prioritySchema.optional().default("medium"),
  dueDate: optionalDate,
  estimatedEffort: z.string().trim().max(60).optional().default(""),
});

export const taskUpdateSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    status: statusSchema.optional(),
    priority: prioritySchema.optional(),
    dueDate: optionalDate,
    estimatedEffort: z.string().trim().max(60).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, "Send at least one task field to update.");

export const aiEstimateSchema = z.object({
  title: z.string().trim().min(2, "Task title must be at least 2 characters.").max(140),
  description: z.string().trim().max(1000).optional().default(""),
});
