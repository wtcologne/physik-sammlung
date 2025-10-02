import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { getCategoryById } from '@/lib/data'
import { getCategoryColors } from '@/lib/colors'
import { filterTiles, getUniqueGrades } from '@/lib/filters'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { TileGrid } from '@/components/TileGrid'
import { Tile } from '@/components/Tile'
import { EmptyState } from '@/components/EmptyState'
import { clsx } from 'clsx'
import type { FilterOptions } from '@/lib/types'

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categoryId ? getCategoryById(categoryId) : undefined

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    selectedGrades: [],
    selectedLevels: [],
    selectedCourses: [],
  })

  const availableGrades = useMemo(() => {
    if (!category) return []
    return getUniqueGrades(category.tiles)
  }, [category])

  const filteredTiles = useMemo(() => {
    if (!category) return []
    return filterTiles(category.tiles, filters)
  }, [category, filters])

  const colors = categoryId ? getCategoryColors(categoryId) : getCategoryColors('mechanik')

  if (!category) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon="not-found"
          title="Kategorie nicht gefunden"
          description="Die angeforderte Kategorie existiert nicht."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[{ label: category.title, path: category.route }]}
        />
      </div>

      <div className="mb-8">
        <h1 className={clsx("text-3xl font-bold tracking-tight mb-2", colors.primary)}>
          {category.title}
        </h1>
        <p className="text-muted-foreground">
          {category.tiles.length} Unterrichtsvorhaben verfügbar
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <SearchBar
          value={filters.searchQuery}
          onChange={(searchQuery) => setFilters({ ...filters, searchQuery })}
        />

        <FilterBar
          selectedGrades={filters.selectedGrades}
          onGradesChange={(selectedGrades) => setFilters({ ...filters, selectedGrades })}
          availableGrades={availableGrades}
          selectedLevels={filters.selectedLevels}
          onLevelsChange={(selectedLevels) => setFilters({ ...filters, selectedLevels })}
          selectedCourses={filters.selectedCourses}
          onCoursesChange={(selectedCourses) => setFilters({ ...filters, selectedCourses })}
          categoryId={categoryId}
        />
      </div>

      {filteredTiles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredTiles.length} {filteredTiles.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
          </div>
          <TileGrid>
            {filteredTiles.map((tile) => (
              <Tile key={tile.id} tile={tile} categoryId={categoryId} />
            ))}
          </TileGrid>
        </>
      )}
    </div>
  )
}

