import type { Tile, FilterOptions } from './types'

/**
 * Filter tiles based on search query, grade, level, and course
 */
export function filterTiles(tiles: Tile[], filters: FilterOptions): Tile[] {
  return tiles.filter((tile) => {
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      const matchesTitle = tile.title.toLowerCase().includes(query)
      const matchesSubtitle = tile.subtitle?.toLowerCase().includes(query)
      const matchesDescription = tile.description?.toLowerCase().includes(query)
      const matchesTopics = tile.topics.some((topic) => topic.toLowerCase().includes(query))

      if (!matchesTitle && !matchesSubtitle && !matchesDescription && !matchesTopics) {
        return false
      }
    }

    // Grade filter (Sek I)
    if (filters.selectedGrades.length > 0 && tile.grade) {
      if (!filters.selectedGrades.includes(tile.grade)) {
        return false
      }
    }

    // Level filter (Sek I/Sek II)
    if (filters.selectedLevels.length > 0) {
      // Determine level based on code if not explicitly set
      let tileLevel = tile.level
      if (!tileLevel && tile.code) {
        const code = tile.code
        // All codes 6.1-10.5 are Sek I
        if (code.match(/^[6-9]\.|^10\./)) {
          tileLevel = 'Sek I'
        } else {
          tileLevel = 'Sek II'
        }
      }
      
      if (!tileLevel || !filters.selectedLevels.includes(tileLevel)) {
        return false
      }
    }

    // Course filter (EF/GK/LK)
    if (filters.selectedCourses.length > 0) {
      if (!tile.course || !filters.selectedCourses.includes(tile.course)) {
        return false
      }
    }

    return true
  })
}

/**
 * Get unique grades from tiles
 */
export function getUniqueGrades(tiles: Tile[]): number[] {
  const grades = new Set(tiles.map((tile) => tile.grade).filter((grade): grade is number => grade !== null && grade !== undefined))
  return Array.from(grades).sort((a, b) => a - b)
}

