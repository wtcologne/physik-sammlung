import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Radio, Ear, Mic, Music, Volume2, User } from 'lucide-react'
import { clsx } from 'clsx'

type SenderType = 'speaker' | 'instrument' | 'voice'
type EmpfaengerType = 'ear' | 'microphone'

const senderConfig = {
  speaker: { 
    icon: Radio, 
    label: 'Lautsprecher', 
    color: '#3b82f6',
    wavePattern: 'continuous', // Gleichmäßige Wellen
    waveWidth: 2,
  },
  instrument: { 
    icon: Music, 
    label: 'Musikinstrument', 
    color: '#8b5cf6',
    wavePattern: 'thick', // Dickere Wellen
    waveWidth: 3,
  },
  voice: { 
    icon: User, 
    label: 'Stimme', 
    color: '#ec4899',
    wavePattern: 'variable', // Variierende Wellendicke
    waveWidth: 2.5,
  },
}

const empfaengerConfig = {
  ear: { icon: Ear, label: 'Ohr', color: '#10b981' },
  microphone: { icon: Mic, label: 'Mikrofon', color: '#f59e0b' },
}

export function SenderEmpfaengerSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [frequency, setFrequency] = useState(0.5) // Waves per second
  const [waveSpeed, setWaveSpeed] = useState(5) // pixels per second (sehr langsam!)
  const [sender, setSender] = useState<SenderType>('speaker')
  const [empfaenger, setEmpfaenger] = useState<EmpfaengerType>('ear')
  const [time, setTime] = useState(0)

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.fillStyle = '#f9fafb'
      ctx.fillRect(0, 0, width, height)

      // Draw sender position
      const senderX = 100
      const senderY = height / 2

      // Draw empfänger position
      const empfaengerX = width - 100
      const empfaengerY = height / 2

      // Draw waves (only concentric circles emanating from sender)
      if (isPlaying) {
        const wavelength = waveSpeed / frequency
        // Berechne wie viele Wellen der Sender bereits ausgesendet hat
        const totalWavesEmitted = Math.floor(time * frequency)
        const senderCfg = senderConfig[sender]

        // Zeichne nur die Wellen, die tatsächlich existieren
        for (let i = 0; i <= totalWavesEmitted; i++) {
          // Berechne wann diese Welle gestartet wurde
          const waveStartTime = i / frequency
          const waveAge = time - waveStartTime
          const radius = waveAge * waveSpeed
          
          // Zeichne nur Wellen die noch sichtbar sind
          if (radius > 0 && radius < empfaengerX - senderX + 100) {
            const opacity = Math.max(0, 1 - radius / (empfaengerX - senderX))
            ctx.globalAlpha = opacity * 0.7

            // Unterschiedliche Wellenmuster je nach Sender
            ctx.strokeStyle = senderCfg.color
            
            if (senderCfg.wavePattern === 'variable') {
              // Variable Dicke für Stimme
              ctx.lineWidth = senderCfg.waveWidth + Math.sin(time * 3 + i) * 0.8
            } else {
              ctx.lineWidth = senderCfg.waveWidth
            }

            ctx.beginPath()
            ctx.arc(senderX, senderY, radius, 0, Math.PI * 2)
            ctx.stroke()

            // Für Instrumente: zusätzliche dünnere Welle (Oberton)
            if (senderCfg.wavePattern === 'thick' && i % 2 === 0) {
              ctx.lineWidth = 1
              ctx.globalAlpha = opacity * 0.4
              ctx.beginPath()
              ctx.arc(senderX, senderY, radius + 3, 0, Math.PI * 2)
              ctx.stroke()
            }
          }
        }

        ctx.globalAlpha = 1

        // Empfänger-Reaktion visualisieren
        const distanceToEmpfaenger = empfaengerX - senderX
        
        // Prüfe ob irgendeine Welle gerade beim Empfänger ist
        let empfaengerReached = false
        for (let i = 0; i <= totalWavesEmitted; i++) {
          const waveStartTime = i / frequency
          const waveAge = time - waveStartTime
          const radius = waveAge * waveSpeed
          
          if (Math.abs(radius - distanceToEmpfaenger) < 20) {
            empfaengerReached = true
            const empfaengerCfg = empfaengerConfig[empfaenger]
            const pulseIntensity = 1 - Math.abs(radius - distanceToEmpfaenger) / 20
            
            // Empfänger pulsiert wenn Welle ankommt
            ctx.fillStyle = empfaengerCfg.color + Math.round(pulseIntensity * 60).toString(16).padStart(2, '0')
            ctx.beginPath()
            ctx.arc(empfaengerX, empfaengerY, 45 + pulseIntensity * 5, 0, Math.PI * 2)
            ctx.fill()
            break
          }
        }
      }

      // Draw sender icon background
      ctx.fillStyle = senderConfig[sender].color + '20'
      ctx.beginPath()
      ctx.arc(senderX, senderY, 40, 0, Math.PI * 2)
      ctx.fill()

      // Draw empfänger icon background
      ctx.fillStyle = empfaengerConfig[empfaenger].color + '20'
      ctx.beginPath()
      ctx.arc(empfaengerX, empfaengerY, 40, 0, Math.PI * 2)
      ctx.fill()

      // Draw connecting line
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(senderX + 40, senderY)
      ctx.lineTo(empfaengerX - 40, empfaengerY)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw labels
      ctx.fillStyle = '#6b7280'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SENDER', senderX, senderY + 70)
      ctx.fillText('EMPFÄNGER', empfaengerX, empfaengerY + 70)

      // Update time
      if (isPlaying) {
        setTime((t) => t + 0.016) // ~60 FPS
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, frequency, waveSpeed, sender, empfaenger, time])

  const handlePlayPause = () => {
    if (!isPlaying) {
      setTime(0)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Sender-Empfänger-Modell
          </h3>
        </div>

        {/* Canvas */}
        <div className="bg-gray-50 rounded-lg border border-border overflow-hidden mb-6 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full h-auto"
          />
          
          {/* Overlay Icons (SVG would be better, using text as fallback) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-12">
            <div className="flex flex-col items-center">
              <div className={clsx(
                "rounded-full p-3 shadow-lg",
                "bg-white border-2"
              )} style={{ borderColor: senderConfig[sender].color }}>
                {(() => {
                  const Icon = senderConfig[sender].icon
                  return <Icon className="h-8 w-8" style={{ color: senderConfig[sender].color }} />
                })()}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className={clsx(
                "rounded-full p-3 shadow-lg",
                "bg-white border-2"
              )} style={{ borderColor: empfaengerConfig[empfaenger].color }}>
                {(() => {
                  const Icon = empfaengerConfig[empfaenger].icon
                  return <Icon className="h-8 w-8" style={{ color: empfaengerConfig[empfaenger].color }} />
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Sender & Empfänger Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sender Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Schallquelle (Sender)
              </label>
              <div className="flex gap-2">
                {(Object.entries(senderConfig) as [SenderType, typeof senderConfig[SenderType]][]).map(([key, config]) => {
                  const Icon = config.icon
                  const isSelected = sender === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSender(key)}
                      className={clsx(
                        'flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:bg-accent'
                      )}
                      style={isSelected ? { borderColor: config.color } : {}}
                    >
                      <Icon className="h-6 w-6" style={{ color: config.color }} />
                      <span className="text-xs font-medium text-foreground">{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Empfänger Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Schallempfänger (Empfänger)
              </label>
              <div className="flex gap-2">
                {(Object.entries(empfaengerConfig) as [EmpfaengerType, typeof empfaengerConfig[EmpfaengerType]][]).map(([key, config]) => {
                  const Icon = config.icon
                  const isSelected = empfaenger === key
                  return (
                    <button
                      key={key}
                      onClick={() => setEmpfaenger(key)}
                      className={clsx(
                        'flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:bg-accent'
                      )}
                      style={isSelected ? { borderColor: config.color } : {}}
                    >
                      <Icon className="h-6 w-6" style={{ color: config.color }} />
                      <span className="text-xs font-medium text-foreground">{config.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-center">
            <button
              onClick={handlePlayPause}
              className={clsx(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5" />
                  Animation stoppen
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Animation starten
                </>
              )}
            </button>
          </div>

          {/* Wave Speed Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                Schallgeschwindigkeit
              </label>
              <div className="text-sm font-mono text-muted-foreground">
                {waveSpeed} px/s
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={waveSpeed}
              onChange={(e) => setWaveSpeed(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>sehr langsam (1)</span>
              <span>schneller (10)</span>
            </div>
          </div>

          {/* Frequency Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                Wellenfrequenz
              </label>
              <div className="text-sm font-mono text-muted-foreground">
                {frequency.toFixed(1)} Wellen/Sekunde
              </div>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.1 Wellen/s</span>
              <span>1 Welle/s</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Das Sender-Empfänger-Modell:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Der <strong>Sender</strong> erzeugt Schallwellen, die sich kreisförmig ausbreiten</li>
            <li>• <strong>Lautsprecher:</strong> Gleichmäßige, dünne Wellen</li>
            <li>• <strong>Musikinstrument:</strong> Dickere Wellen mit Obertönen (Doppellinien)</li>
            <li>• <strong>Stimme:</strong> Variable Wellendicke (schwankt mit der Zeit)</li>
            <li>• Der <strong>Empfänger pulsiert</strong>, wenn eine Welle ankommt!</li>
            <li>• Ohne Medium (z.B. im Vakuum) kann sich Schall <strong>nicht</strong> ausbreiten!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

