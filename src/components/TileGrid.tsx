import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface TileGridProps {
  children: ReactNode
  className?: string
}

export function TileGrid({ children, className }: TileGridProps) {
  return (
    <div
      role="list"
      className={clsx(
        'grid gap-6',
        'grid-cols-1',
        'sm:grid-cols-2',
        'lg:grid-cols-3',
        'xl:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  )
}

