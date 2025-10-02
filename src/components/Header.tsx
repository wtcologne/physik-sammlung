import { Link } from 'react-router-dom'
import { getAppMeta } from '@/lib/data'
import { Atom } from 'lucide-react'

export function Header() {
  const appMeta = getAppMeta()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-semibold tracking-tight transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          aria-label="Zur Startseite"
        >
          <Atom className="h-7 w-7 text-primary" aria-hidden="true" />
          <span>{appMeta.title}</span>
        </Link>
      </div>
    </header>
  )
}

