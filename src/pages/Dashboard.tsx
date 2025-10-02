import { Link } from 'react-router-dom'
import { getCategories } from '@/lib/data'
import { getCategoryGradient } from '@/lib/colors'
import { Zap, Eye, Lightbulb } from 'lucide-react'
import { clsx } from 'clsx'

const categoryIcons = {
  mechanik: Zap,
  optik: Eye,
  elektrizitaetslehre: Lightbulb,
}

export function Dashboard() {
  const categories = getCategories()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Physik-Sammlung
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecke Unterrichtsvorhaben in drei Hauptbereichen der Physik
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons]
            const gradient = getCategoryGradient(category.id)

            return (
              <Link
                key={category.id}
                to={category.route}
                className={clsx(
                  'group relative overflow-hidden rounded-2xl p-8 text-white',
                  'transition-all duration-300 hover:scale-105 hover:shadow-2xl',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                )}
                aria-label={`${category.title} - ${category.tiles.length} Unterrichtsvorhaben`}
              >
                <div className={clsx('absolute inset-0 bg-gradient-to-br', gradient)} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                <div className="relative z-10">
                  <Icon className="h-12 w-12 mb-4" aria-hidden="true" />
                  <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                  <p className="text-white/90 text-sm">
                    {category.tiles.length} Unterrichtsvorhaben
                  </p>
                </div>

                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full transform translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

