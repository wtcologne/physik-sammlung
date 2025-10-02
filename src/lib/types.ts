import { z } from 'zod'
import { AppMetaSchema, TileSchema, CategorySchema, RootSchema } from './schema'

export type AppMeta = z.infer<typeof AppMetaSchema>
export type Tile = z.infer<typeof TileSchema>
export type Category = z.infer<typeof CategorySchema>
export type Root = z.infer<typeof RootSchema>

export type CourseType = 'EF' | 'GK' | 'LK' | null
export type LevelType = 'Sek I' | 'Sek II'
export type StageType = 'EF' | 'Q1' | 'Q2' | null

export interface FilterOptions {
  searchQuery: string
  selectedGrades: number[]
  selectedLevels: LevelType[]
  selectedCourses: CourseType[]
}

