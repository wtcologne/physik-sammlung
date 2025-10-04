import { useState } from 'react'
import { Smartphone, QrCode, ExternalLink, Volume2, Activity, Zap } from 'lucide-react'

interface PhyphoxExperimentProps {
  experiment: {
    id: string
    title: string
    description: string
    phyphoxUrl: string
    qrCode?: string
    sensors: string[]
    instructions?: string[]
    expectedResults?: string[]
  }
}

const sensorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Mikrofon': Volume2,
  'Beschleunigungssensor': Activity,
  'Gyroskop': Zap,
  'Lichtsensor': Activity,
  'Magnetometer': Activity,
}

export function PhyphoxExperiment({ experiment }: PhyphoxExperimentProps) {
  const [showQR, setShowQR] = useState(false)

  const generateQRCode = () => {
    // Einfache QR-Code-Generierung über externe API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(experiment.phyphoxUrl)}`
    setShowQR(true)
    return qrCodeUrl
  }

  const openPhyphox = () => {
    window.open(experiment.phyphoxUrl, '_blank')
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {experiment.title}
          </h3>
          <p className="text-muted-foreground mb-4">
            {experiment.description}
          </p>
          
          {/* Sensoren */}
          <div className="flex flex-wrap gap-2 mb-4">
            {experiment.sensors.map((sensor) => {
              const Icon = sensorIcons[sensor] || Activity
              return (
                <span
                  key={sensor}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                >
                  <Icon className="h-3 w-3" />
                  {sensor}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Phyphox öffnen
          </h4>
          <button
            onClick={generateQRCode}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            QR-Code generieren
          </button>
        </div>
        
        <div className="flex gap-4 items-center">
          <button
            onClick={openPhyphox}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            In Phyphox öffnen
          </button>
          
          {showQR && (
            <div className="flex flex-col items-center gap-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(experiment.phyphoxUrl)}`} 
                alt="Phyphox QR Code" 
                className="w-20 h-20" 
              />
              <span className="text-xs text-muted-foreground">QR-Code scannen</span>
            </div>
          )}
        </div>
      </div>

      {/* Anweisungen */}
      {experiment.instructions && experiment.instructions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            📋 Anweisungen
          </h4>
          <ol className="space-y-2">
            {experiment.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-muted-foreground flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Erwartete Ergebnisse */}
      {experiment.expectedResults && experiment.expectedResults.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-2">
            🎯 Erwartete Ergebnisse
          </h4>
          <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
            {experiment.expectedResults.map((result, index) => (
              <li key={index}>• {result}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Phyphox Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-400">
          <strong>💡 Tipp:</strong> Installiere die kostenlose Phyphox-App auf deinem Smartphone, 
          um die Sensoren für physikalische Messungen zu nutzen.
        </p>
      </div>
    </div>
  )
}
