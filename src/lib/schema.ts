import { z } from 'zod'

export const AppMetaSchema = z.object({
  title: z.string(),
  version: z.number(),
})

export const PhyphoxExperimentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  phyphoxUrl: z.string().url(),
  qrCode: z.string().optional(),
  sensors: z.array(z.string()),
  instructions: z.array(z.string()).optional(),
  expectedResults: z.array(z.string()).optional(),
})

export const ExperimentSchema = z.object({
  title: z.string(),
  type: z.enum(['simulation', 'phyphox', 'hands-on', 'virtual']),
  description: z.string(),
  materials: z.array(z.string()).optional(),
  safety: z.string().optional(),
  procedure: z.array(z.string()).optional(),
  phyphox: PhyphoxExperimentSchema.optional(),
  duration: z.number().optional(), // in Minuten
  difficulty: z.enum(['einfach', 'mittel', 'schwer']).optional(),
})

export const InhaltsfeldSchema = z.object({
  code: z.string(),
  title: z.string(),
  schwerpunkte: z.array(z.string()),
})

// Legacy Kompetenz-Schema (für Rückwärtskompatibilität)
export const LegacyKompetenzSchema = z.object({
  code: z.string(),
  title: z.string(),
  items: z.array(z.string()).optional(),
})

// Neue Kompetenz-Schema
export const KompetenzSchema = z.object({
  code: z.string(),
  bereich: z.string(),
  punkte: z.array(z.string()),
})

// Union Schema für beide Formate
export const FlexibleKompetenzSchema = z.union([LegacyKompetenzSchema, KompetenzSchema])

export const VereinbarungenSchema = z.object({
  schwerpunktsetzung: z.array(z.string()).optional(),
  vernetzung: z.array(z.string()).optional(),
  synergien: z.array(z.string()).optional(),
  zusatz: z.array(z.string()).optional(),
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
  // Erweiterte Lehrplan-Felder
  guiding_question: z.string().optional(),
  time_hours: z.number().optional(),
  inhaltsfelder: z.array(InhaltsfeldSchema).optional(),
  kompetenzen: z.array(FlexibleKompetenzSchema).optional(),
  weitere_vereinbarungen: VereinbarungenSchema.optional(),
  // Legacy-Felder für Rückwärtskompatibilität
  inhaltsfeld: z.string().optional(),
  inhaltlicheSchwerpunkte: z.array(z.object({
    title: z.string(),
    items: z.array(z.string()),
  })).optional(),
  vereinbarungen: z.object({
    schwerpunktsetzung: z.array(z.string()).optional(),
    vernetzung: z.array(z.string()).optional(),
  }).optional(),
  // Erweiterte Felder für Experimente und Phyphox
  experiments: z.array(ExperimentSchema).optional(),
  simulations: z.array(z.string()).optional(), // IDs der verfügbaren Simulationen
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

