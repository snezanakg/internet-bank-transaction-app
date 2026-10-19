
import { z } from "zod";

// The five allowed classification categories
export const CategorySchema = z.enum([
  "Household",
  "Transport",
  "Food",
  "Entertainment",
  "Unknown",
]);

// TypeScript type generated from the Zod enum
export type Category = z.infer<typeof CategorySchema>;

// Fixed list returned by GET /classifications
export const categories = CategorySchema.options;
