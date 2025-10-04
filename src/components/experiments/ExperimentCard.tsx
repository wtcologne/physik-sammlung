import { Beaker, Smartphone, Monitor, Hand } from 'lucide-react'
import { PhyphoxExperiment } from './PhyphoxExperiment'
import { clsx } from 'clsx'

interface Experiment {
  title: string
  type: 'simulation' | 'phyphox' | 'hands-on' | 'virtual'
  description: string
  materials?: string[]
  safety?: string
  procedure?: string[]
  phyphox?: {
    id: string
    title: string
    description: string
    phyphoxUrl: string
    qrCode?: string
    sensors: string[]
    instructions?: string[]
    expectedResults?: string[]
  }
  duration?: number
  difficulty?: 'einfach' | 'mittel' | 'schwer'
}

interface ExperimentCardProps {
  experiment: Experiment
}

const experimentIcons = {
  simulation: Monitor,
  phyphox: Smartphone,
  'hands-on': Beaker,
  virtual: Hand,
}

const difficultyColors = {
  einfach: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  mittel: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  schwer: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const Icon = experimentIcons[experiment.type]

  if (experiment.type === 'phyphox' && experiment.phyphox) {
    return <PhyphoxExperiment experiment={experiment.phyphox} />
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              {experiment.title}
            </h3>
            {experiment.difficulty && (
              <span className={clsx(
                'px-2 py-1 text-xs font-medium rounded-full',
                difficultyColors[experiment.difficulty]
              )}>
                {experiment.difficulty}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mb-3">
            {experiment.description}
          </p>
          
          {experiment.duration && (
            <div className="text-sm text-muted-foreground mb-3">
              ⏱️ Dauer: {experiment.duration} Minuten
            </div>
          )}
        </div>
      </div>

      {/* Materialien */}
      {experiment.materials && experiment.materials.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            🧪 Materialien
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {experiment.materials.map((material, index) => (
              <li key={index}>• {material}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sicherheitshinweise */}
      {experiment.safety && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300 mb-1">
            ⚠️ Sicherheitshinweise
          </h4>
          <p className="text-sm text-orange-800 dark:text-orange-400">
            {experiment.safety}
          </p>
        </div>
      )}

      {/* Durchführung */}
      {experiment.procedure && experiment.procedure.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            📋 Durchführung
          </h4>
          <ol className="space-y-2">
            {experiment.procedure.map((step, index) => (
              <li key={index} className="text-sm text-muted-foreground flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Experiment-spezifische Aktionen */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          {experiment.type === 'simulation' && '💻 Interaktive Simulation verfügbar'}
          {experiment.type === 'hands-on' && '🧪 Praktisches Experiment'}
          {experiment.type === 'virtual' && '🌐 Virtuelles Experiment'}
        </p>
      </div>
    </div>
  )
}
