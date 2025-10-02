import structureData from '@/data/structure.json'
import sekIIData from '@/data/sekII_additions.json'
import { RootSchema, TileSchema } from './schema'
import { z } from 'zod'
import type { Root, Category, Tile } from './types'

let cachedStructure: Root | null = null
let validationError: Error | null = null

type Additions = {
  mechanik?: unknown[]
  optik?: unknown[]
  elektrizitaetslehre?: unknown[]
}

function ensureArray<T>(arr: unknown[], schema: z.ZodType<T>): T[] {
  return z.array(schema).parse(arr)
}

/**
 * Load and validate structure.json + sekII_additions.json, then merge them
 */
export function loadStructure(): Root {
  if (cachedStructure) return cachedStructure

  try {
    // Parse base structure
    const base = RootSchema.parse(structureData)
    const additions = sekIIData as Additions

    // Create map for easy category lookup
    const byId = new Map(base.categories.map((c) => [c.id, c]))

    // Merge function for each category
    const mergeFor = (catId: string, newTiles: unknown[] | undefined) => {
      if (!newTiles || newTiles.length === 0) return
      const parsedTiles = ensureArray(newTiles, TileSchema)
      const cat = byId.get(catId)
      if (cat) {
        const existing = new Set(cat.tiles.map((t) => t.id))
        const toAdd = parsedTiles.filter((t) => !existing.has(t.id))
        cat.tiles.push(...toAdd)
      } else {
        // Fallback: create new category (should not be needed)
        byId.set(catId, {
          id: catId,
          title: catId[0].toUpperCase() + catId.slice(1),
          route: `/${catId}`,
          tiles: parsedTiles,
        })
      }
    }

    // Merge Sek II additions
    mergeFor('mechanik', additions.mechanik)
    mergeFor('optik', additions.optik)
    mergeFor('elektrizitaetslehre', additions.elektrizitaetslehre)

    const result = { ...base, categories: Array.from(byId.values()) }
    cachedStructure = result
    return result
  } catch (error) {
    validationError = error as Error
    throw new Error(`Failed to validate structure.json: ${error}`)
  }
}

export function getValidationError(): Error | null {
  return validationError
}

/**
 * Get all categories
 */
export function getCategories(): Category[] {
  const structure = loadStructure()
  return structure.categories
}

/**
 * Get a category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  const structure = loadStructure()
  return structure.categories.find((cat) => cat.id === id)
}

/**
 * Get a tile by category ID and tile ID
 */
export function getTile(categoryId: string, tileId: string): Tile | undefined {
  const category = getCategoryById(categoryId)
  if (!category) return undefined
  return category.tiles.find((tile) => tile.id === tileId)
}

/**
 * Get app metadata
 */
export function getAppMeta() {
  const structure = loadStructure()
  return structure.app
}

/**
 * Get all tiles across all categories (useful for global search)
 */
export function getAllTiles(): Array<Tile & { categoryId: string }> {
  const structure = loadStructure()
  const tiles: Array<Tile & { categoryId: string }> = []

  structure.categories.forEach((category) => {
    category.tiles.forEach((tile) => {
      tiles.push({ ...tile, categoryId: category.id })
    })
  })

  return tiles
}

