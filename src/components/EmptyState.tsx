import { Search, FileQuestion } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: 'search' | 'not-found'
}

export function EmptyState({
  title = 'Keine Ergebnisse gefunden',
  description = 'Versuche es mit anderen Suchbegriffen oder Filtern.',
  icon = 'search',
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : FileQuestion

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  )
}

