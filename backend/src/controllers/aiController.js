import { aiEstimateSchema } from "../validators/schemas.js";
import { suggestTaskEstimate } from "../services/geminiService.js";

export const suggestEstimate = async (req, res) => {
  const input = aiEstimateSchema.parse(req.body);
  const estimate = await suggestTaskEstimate(input);

  res.json({ estimate });
};
