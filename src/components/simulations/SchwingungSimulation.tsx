import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { Play, Pause, Volume2, Activity } from 'lucide-react'
import { clsx } from 'clsx'

export function SchwingungSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const synthRef = useRef<Tone.Synth | null>(null)
  const animationRef = useRef<number | null>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [frequency, setFrequency] = useState(440) // A4 note
  const [amplitude, setAmplitude] = useState(0.5)
  const [isAudioReady, setIsAudioReady] = useState(false)

  // Initialize Tone.js synth (lazy initialization)
  useEffect(() => {
    // Don't initialize audio until user interaction
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose()
      }
    }
  }, [])

  // Initialize audio on first user interaction
  const initializeAudio = async () => {
    if (!isAudioReady && !synthRef.current) {
      try {
        await Tone.start()
        synthRef.current = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.9,
            release: 0.1,
          },
        }).toDestination()

        synthRef.current.volume.value = -10
        setIsAudioReady(true)
      } catch (error) {
        console.warn('Audio initialization failed:', error)
      }
    }
  }

  // Animation loop for canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let phase = 0

    const animate = () => {
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = '#e5e7eb'
      ctx.lineWidth = 1
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Draw center line
      ctx.strokeStyle = '#d1d5db'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()

      // Draw wave
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.beginPath()

      const wavelength = 200 * (440 / frequency) // Adjust wavelength based on frequency
      const amplitudePixels = (height / 2 - 20) * amplitude

      for (let x = 0; x < width; x++) {
        const y =
          height / 2 +
          amplitudePixels * Math.sin((2 * Math.PI * (x - phase)) / wavelength)
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // Update phase for animation
      if (isPlaying) {
        phase += 2
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [frequency, amplitude, isPlaying])

  const handlePlayPause = async () => {
    // Initialize audio on first user interaction
    await initializeAudio()

    if (isPlaying) {
      synthRef.current?.triggerRelease()
      setIsPlaying(false)
    } else {
      synthRef.current?.triggerAttack(frequency)
      setIsPlaying(true)
    }
  }

  const handleFrequencyChange = async (value: number) => {
    setFrequency(value)
    if (isPlaying && synthRef.current) {
      // Ensure audio is initialized before changing frequency
      await initializeAudio()
      synthRef.current.frequency.rampTo(value, 0.1)
    }
  }

  const handleAmplitudeChange = (value: number) => {
    setAmplitude(value)
    if (synthRef.current) {
      synthRef.current.volume.value = -30 + value * 20
    }
  }

  const frequencyToNote = (freq: number): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const midiNote = 12 * Math.log2(freq / 440) + 69
    const octave = Math.floor(midiNote / 12) - 1
    const noteIndex = Math.round(midiNote) % 12
    return `${notes[noteIndex]}${octave}`
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Schwingende Saite – Tonhöhe und Lautstärke
          </h3>
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-lg border border-border overflow-hidden mb-6">
          <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full h-auto"
          />
        </div>

        {/* Controls */}
        <div className="space-y-6">
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
                  Ton stoppen
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Ton abspielen
                </>
              )}
            </button>
          </div>

          {/* Frequency Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Frequenz (Tonhöhe)
              </label>
              <div className="text-sm font-mono text-muted-foreground">
                {frequency} Hz ({frequencyToNote(frequency)})
              </div>
            </div>
            <input
              type="range"
              min="220"
              max="880"
              step="1"
              value={frequency}
              onChange={(e) => handleFrequencyChange(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>220 Hz (tief)</span>
              <span>880 Hz (hoch)</span>
            </div>
          </div>

          {/* Amplitude Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                Amplitude (Lautstärke)
              </label>
              <div className="text-sm font-mono text-muted-foreground">
                {Math.round(amplitude * 100)}%
              </div>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={amplitude}
              onChange={(e) => handleAmplitudeChange(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>leise</span>
              <span>laut</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Beobachte:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• <strong>Frequenz ↑</strong> → Wellenlänge ↓ → Ton wird höher</li>
            <li>• <strong>Amplitude ↑</strong> → Wellenhöhe ↑ → Ton wird lauter</li>
            <li>• Die Schwingung wiederholt sich periodisch</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

