import { z } from "zod";

import { categoryOptions } from "@/lib/types";

const categorySchema = z.enum(categoryOptions);
const nullableString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

const nullableNumber = z
  .union([z.number(), z.null(), z.undefined()])
  .transform((value) => (value == null || Number.isNaN(value) ? null : Math.round(value)));

export const productSchema = z.object({
  name: z.string().trim().min(2),
  category: categorySchema,
  price: nullableNumber,
  label: nullableString,
  image: nullableString,
  externalUrl: nullableString,
  isActive: z.boolean().default(true),
  description: nullableString,
  sortOrder: z.number().int().default(0),
});

export const bannerSchema = z.object({
  name: z.string().trim().min(2),
  category: categorySchema.nullable().optional(),
  price: nullableNumber,
  label: nullableString,
  image: nullableString,
  externalUrl: nullableString,
  isActive: z.boolean().default(true),
  headline: nullableString,
  subheadline: nullableString,
});

export const sectionSchema = z.object({
  name: z.string().trim().min(2),
  category: categorySchema.nullable().optional(),
  price: nullableNumber,
  label: nullableString,
  image: nullableString,
  externalUrl: nullableString,
  isActive: z.boolean().default(true),
  title: nullableString,
  content: nullableString,
  kind: z.string().trim().min(2),
  sortOrder: z.number().int().default(0),
});
