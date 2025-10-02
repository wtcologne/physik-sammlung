import { Link } from 'react-router-dom'
import { Clock, GraduationCap } from 'lucide-react'
import { clsx } from 'clsx'
import { getCategoryColors } from '@/lib/colors'
import type { Tile as TileType } from '@/lib/types'

interface TileProps {
  tile: TileType
  categoryId?: string
}

export function Tile({ tile, categoryId }: TileProps) {
  const linkPath = categoryId ? `/${categoryId}/${tile.id}` : tile.route
  const colors = categoryId ? getCategoryColors(categoryId) : getCategoryColors('mechanik')

  return (
    <Link
      to={linkPath}
      className={clsx(
        'group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-6',
        'transition-all duration-200 hover:shadow-lg hover:shadow-primary/5',
        categoryId ? colors.hover : 'hover:border-primary/50',
        categoryId ? colors.ring : 'focus:ring-ring',
        'focus:outline-none focus:ring-2 focus:ring-offset-2'
      )}
      aria-label={`${tile.title} - ${tile.subtitle}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {tile.code && <div className="text-xs font-medium text-muted-foreground mb-1">{tile.code}</div>}
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {tile.title}
          </h3>
          {tile.subtitle && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tile.subtitle}</p>}
          {tile.description && !tile.subtitle && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tile.description}</p>}
          
          {/* Sek II Badges */}
          {(tile.level || tile.course || tile.stage) && (
            <div className="flex items-center gap-1.5 mt-2">
              {tile.level && (
                <span className={clsx(
                  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                  tile.level === 'Sek II' 
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                )}>
                  {tile.level}
                </span>
              )}
              {tile.course && (
                <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {tile.course}
                </span>
              )}
              {tile.stage && tile.stage !== tile.course && (
                <span className="inline-flex items-center rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                  {tile.stage}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
        {tile.grade && (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            <span>Klasse {tile.grade}</span>
          </div>
        )}
        {tile.hours && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{tile.hours} Std.</span>
          </div>
        )}
      </div>

      {tile.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tile.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
            >
              {topic}
            </span>
          ))}
          {tile.topics.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              +{tile.topics.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

