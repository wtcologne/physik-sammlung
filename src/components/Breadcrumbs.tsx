import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { clsx } from 'clsx'

interface BreadcrumbItem {
  label: string
  path: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        to="/"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm px-1"
        aria-label="Zur Startseite"
      >
        <Home className="h-4 w-4" aria-hidden="true" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={item.path} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {isLast ? (
              <span className="font-medium text-foreground px-1" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className={clsx(
                  'hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm px-1'
                )}
              >
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

