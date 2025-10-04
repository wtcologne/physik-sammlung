import { useParams, Link } from 'react-router-dom'
import { getTile, getCategoryById } from '@/lib/data'
import { getCategoryColors } from '@/lib/colors'
import { categoryPath } from '@/lib/routing'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { EmptyState } from '@/components/EmptyState'
import { SchwingungSimulation } from '@/components/simulations/SchwingungSimulation'
import { SenderEmpfaengerSimulation } from '@/components/simulations/SenderEmpfaengerSimulation'
import { ExperimentCard } from '@/components/experiments/ExperimentCard'
import { CollapsibleSection } from '@/components/CollapsibleSection'
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

          {/* Inhaltsfelder (neue Struktur) */}
          {tile.inhaltsfelder && tile.inhaltsfelder.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Inhaltsfelder</h2>
              <div className="space-y-4">
                {tile.inhaltsfelder.map((inhaltsfeld, index) => (
                  <div key={index} className={clsx("p-4 rounded-lg", colors.secondary)}>
                    <div className="flex items-start gap-3 mb-3">
                      <span className={clsx(
                        "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-bold flex-shrink-0",
                        colors.primaryBg,
                        "text-white"
                      )}>
                        {inhaltsfeld.code}
                      </span>
                      <h3 className="font-semibold text-foreground">{inhaltsfeld.title}</h3>
                    </div>
                    <ul className="space-y-2 ml-2">
                      {inhaltsfeld.schwerpunkte.map((schwerpunkt, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className={clsx("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", colors.primaryBg)} />
                          <span>{schwerpunkt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy Inhaltsfeld (fallback) */}
          {!tile.inhaltsfelder && tile.inhaltsfeld && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Inhaltsfeld</h2>
              <div className={clsx("p-4 rounded-lg", colors.secondary)}>
                <p className="font-medium text-foreground">{tile.inhaltsfeld}</p>
              </div>
            </div>
          )}

          {/* Legacy Inhaltliche Schwerpunkte (fallback) */}
          {!tile.inhaltsfelder && tile.inhaltlicheSchwerpunkte && tile.inhaltlicheSchwerpunkte.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Inhaltliche Schwerpunkte</h2>
              <div className="space-y-4">
                {tile.inhaltlicheSchwerpunkte.map((schwerpunkt, index) => (
                  <div key={index} className={clsx("p-4 rounded-lg", colors.secondary)}>
                    <h3 className="font-semibold text-foreground mb-2">{schwerpunkt.title}</h3>
                    <ul className="space-y-1">
                      {schwerpunkt.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className={clsx("mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", colors.primaryBg)} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kompetenzen */}
          {tile.kompetenzen && tile.kompetenzen.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Schwerpunkte der Kompetenzentwicklung</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {tile.kompetenzen.map((kompetenz, index) => {
                  // Prüfe ob es das neue oder Legacy-Format ist
                  const isNewFormat = 'bereich' in kompetenz && 'punkte' in kompetenz
                  const title = isNewFormat ? kompetenz.bereich : kompetenz.title
                  const items = isNewFormat ? kompetenz.punkte : kompetenz.items
                  
                  return (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-start gap-3">
                        <span className={clsx(
                          "inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-bold flex-shrink-0",
                          colors.primaryBg,
                          "text-white"
                        )}>
                          {kompetenz.code}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
                          {items && items.length > 0 && (
                            <ul className="space-y-1">
                              {items.map((item, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground">
                                  • {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Weitere Vereinbarungen (neue Struktur) */}
          {tile.weitere_vereinbarungen && (tile.weitere_vereinbarungen.schwerpunktsetzung || tile.weitere_vereinbarungen.vernetzung || tile.weitere_vereinbarungen.synergien || tile.weitere_vereinbarungen.zusatz) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Weitere Vereinbarungen</h2>
              <div className="space-y-4">
                {tile.weitere_vereinbarungen.schwerpunktsetzung && tile.weitere_vereinbarungen.schwerpunktsetzung.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-2">… zur Schwerpunktsetzung</h3>
                    <ul className="space-y-1">
                      {tile.weitere_vereinbarungen.schwerpunktsetzung.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tile.weitere_vereinbarungen.vernetzung && tile.weitere_vereinbarungen.vernetzung.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-2">… zur Vernetzung</h3>
                    <ul className="space-y-1">
                      {tile.weitere_vereinbarungen.vernetzung.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">↔</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tile.weitere_vereinbarungen.synergien && tile.weitere_vereinbarungen.synergien.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-2">… zu Synergien</h3>
                    <ul className="space-y-1">
                      {tile.weitere_vereinbarungen.synergien.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">⇄</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tile.weitere_vereinbarungen.zusatz && tile.weitere_vereinbarungen.zusatz.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Zusätzliche Vereinbarungen</h3>
                    <ul className="space-y-1">
                      {tile.weitere_vereinbarungen.zusatz.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legacy Vereinbarungen (fallback) */}
          {!tile.weitere_vereinbarungen && tile.vereinbarungen && (tile.vereinbarungen.schwerpunktsetzung || tile.vereinbarungen.vernetzung) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground mb-3">Weitere Vereinbarungen</h2>
              <div className="space-y-4">
                {tile.vereinbarungen.schwerpunktsetzung && tile.vereinbarungen.schwerpunktsetzung.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-2">… zur Schwerpunktsetzung</h3>
                    <ul className="space-y-1">
                      {tile.vereinbarungen.schwerpunktsetzung.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tile.vereinbarungen.vernetzung && tile.vereinbarungen.vernetzung.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-2">… zur Vernetzung</h3>
                    <ul className="space-y-1">
                      {tile.vereinbarungen.vernetzung.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">↔</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Simulation Section */}
          <CollapsibleSection 
            title="Interaktive Simulationen" 
            icon="🔬"
            defaultOpen={false}
          >
            {tile.id === '6-5-physik-und-musik' ? (
              <div className="space-y-8">
                <p className="text-muted-foreground mb-6">
                  Experimentiere mit den Simulationen und beobachte die physikalischen Zusammenhänge!
                </p>
                <SchwingungSimulation />
                <SenderEmpfaengerSimulation />
              </div>
            ) : (
              <div className="p-6 bg-muted/30 rounded-lg border border-dashed border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Simulation wird hier eingefügt
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dieser Bereich ist für zukünftige Physik-Simulationen reserviert.
                </p>
              </div>
            )}
          </CollapsibleSection>

          {/* Experimente Section */}
          {tile.experiments && tile.experiments.length > 0 && (
            <CollapsibleSection 
              title="Experimente & Aktivitäten" 
              icon="🧪"
              defaultOpen={false}
            >
              <p className="text-muted-foreground mb-6">
                Entdecke verschiedene Experimente und Aktivitäten zu diesem Thema!
              </p>
              <div className="space-y-6">
                {tile.experiments.map((experiment, index) => (
                  <ExperimentCard key={index} experiment={experiment} />
                ))}
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  )
}

