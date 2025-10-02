import { useParams, Link } from 'react-router-dom'
import { getTile, getCategoryById } from '@/lib/data'
import { getCategoryColors } from '@/lib/colors'
import { categoryPath } from '@/lib/routing'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { EmptyState } from '@/components/EmptyState'
import { Clock, GraduationCap, BookOpen, ArrowLeft } from 'lucide-react'
import { clsx } from 'clsx'

export function TileDetailPage() {
  const { categoryId, tileId } = useParams<{ categoryId: string; tileId: string }>()
  const tile = categoryId && tileId ? getTile(categoryId, tileId) : undefined
  const category = categoryId ? getCategoryById(categoryId) : undefined
  const colors = categoryId ? getCategoryColors(categoryId) : getCategoryColors('mechanik')

  if (!tile || !category) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon="not-found"
          title="Unterrichtsvorhaben nicht gefunden"
          description="Das angeforderte Unterrichtsvorhaben existiert nicht."
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: category.title, path: category.route },
            { label: tile.title, path: tile.route },
          ]}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <Link
          to={categoryPath(categoryId!)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-ring rounded-md"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Zurück zu {category.title}
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            {tile.code && <div className={clsx("text-sm font-medium mb-2", colors.primary)}>{tile.code}</div>}
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
              {tile.title}
            </h1>
            {tile.subtitle && <p className="text-xl text-muted-foreground">{tile.subtitle}</p>}
            {tile.description && !tile.subtitle && <p className="text-xl text-muted-foreground">{tile.description}</p>}
            
            {/* Sek II Badges */}
            {(tile.level || tile.course || tile.stage) && (
              <div className="flex items-center gap-2 mt-4">
                {tile.level && (
                  <span className={clsx(
                    "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold",
                    tile.level === 'Sek II' 
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                  )}>
                    {tile.level}
                  </span>
                )}
                {tile.course && (
                  <span className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-semibold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                    {tile.course}
                  </span>
                )}
                {tile.stage && tile.stage !== tile.course && (
                  <span className="inline-flex items-center rounded-lg bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
                    {tile.stage}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className={clsx("grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-6 rounded-lg", colors.secondary)}>
            {tile.grade && (
              <div className="flex items-center gap-3">
                <div className={clsx("flex h-10 w-10 items-center justify-center rounded-lg", colors.accent)}>
                  <GraduationCap className={clsx("h-5 w-5", colors.primary)} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Klassenstufe</div>
                  <div className="font-semibold text-foreground">Klasse {tile.grade}</div>
                </div>
              </div>
            )}

            {tile.hours && (
              <div className="flex items-center gap-3">
                <div className={clsx("flex h-10 w-10 items-center justify-center rounded-lg", colors.accent)}>
                  <Clock className={clsx("h-5 w-5", colors.primary)} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Umfang</div>
                  <div className="font-semibold text-foreground">{tile.hours} Stunden</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className={clsx("flex h-10 w-10 items-center justify-center rounded-lg", colors.accent)}>
                <BookOpen className={clsx("h-5 w-5", colors.primary)} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Themen</div>
                <div className="font-semibold text-foreground">{tile.topics.length} Themen</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Behandelte Themen</h2>
            <div className="flex flex-wrap gap-2">
              {tile.topics.map((topic, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-dashed border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Simulation wird hier eingefügt
            </h3>
            <p className="text-sm text-muted-foreground">
              Dieser Bereich ist für zukünftige Physik-Simulationen reserviert.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

