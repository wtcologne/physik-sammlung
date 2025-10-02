import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'

export function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <EmptyState
        icon="not-found"
        title="Seite nicht gefunden"
        description="Die angeforderte Seite existiert nicht oder wurde verschoben."
      />
      <div className="flex justify-center mt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  )
}

