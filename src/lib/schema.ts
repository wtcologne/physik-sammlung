import { z } from 'zod'

export const AppMetaSchema = z.object({
  title: z.string(),
  version: z.number(),
})

export const TileSchema = z.object({
  id: z.string(),
  code: z.string().optional(),
  grade: z.number().nullable().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  hours: z.number().optional(),
  topics: z.array(z.string()),
  route: z.string(),
  level: z.enum(['Sek I', 'Sek II']).optional(),
  stage: z.enum(['EF', 'Q1', 'Q2']).nullable().optional(),
  course: z.enum(['EF', 'GK', 'LK']).nullable().optional(),
  // Lehrplan-spezifische Felder
  inhaltsfeld: z.string().optional(),
  kompetenzen: z.array(z.object({
    code: z.string(),
    title: z.string(),
    items: z.array(z.string()).optional(),
  })).optional(),
  inhaltlicheSchwerpunkte: z.array(z.object({
    title: z.string(),
    items: z.array(z.string()),
  })).optional(),
  vereinbarungen: z.object({
    schwerpunktsetzung: z.array(z.string()).optional(),
    vernetzung: z.array(z.string()).optional(),
  }).optional(),
})

export const CategorySchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string(),
  tiles: z.array(TileSchema),
})

export const RootSchema = z.object({
  app: AppMetaSchema,
  categories: z.array(CategorySchema),
})

