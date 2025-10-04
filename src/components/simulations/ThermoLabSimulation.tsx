import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Thermometer, Flame, Snowflake, Zap } from 'lucide-react'
import { clsx } from 'clsx'

interface ThermoLabState {
  temperature: number // in °C
  targetTemperature: number // Zieltemperatur
  isHeating: boolean
  isCooling: boolean
  thermometerReading: number // Thermometer-Anzeige (mit Trägheit)
  isRunning: boolean
  time: number // Zeit in Sekunden
  history: { time: number; temp: number; thermometer: number }[] // Verlauf für Diagramm
}

export function ThermoLabSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(Date.now())
  
  const [state, setState] = useState<ThermoLabState>({
    temperature: 20,
    targetTemperature: 20,
    isHeating: false,
    isCooling: false,
    thermometerReading: 20,
    isRunning: false,
    time: 0,
    history: [{ time: 0, temp: 20, thermometer: 20 }]
  })

  // Physik-Konstanten (realistisch!)
  const HEATING_RATE = 0.015 // °C pro Frame (aktives Heizen)
  const COOLING_RATE = 0.02 // °C pro Frame (aktives Kühlen - schneller als Heizen!)
  const PASSIVE_COOLING_RATE = 0.0005 // Sehr langsame passive Abkühlung zur Raumtemperatur
  const THERMOMETER_LAG = 0.008 // Trägheit des Thermometers
  const ROOM_TEMPERATURE = 20 // Umgebungstemperatur
  const MAX_HISTORY = 10000 // Maximale Anzahl von Datenpunkten im Diagramm (sehr viele für lange Experimente)

  // Animation Loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      const deltaTime = (now - lastTimeRef.current) / 1000 // in Sekunden
      lastTimeRef.current = now

      setState(prevState => {
        let newTemp = prevState.temperature
        let newThermometerReading = prevState.thermometerReading
        let newTime = prevState.time + deltaTime

        // Heizen/Kühlen mit realistischer Physik
        if (prevState.isHeating && newTemp < prevState.targetTemperature) {
          // Aktives Heizen
          newTemp = Math.min(newTemp + HEATING_RATE, prevState.targetTemperature)
        } else if (prevState.isCooling && newTemp > prevState.targetTemperature) {
          // Aktives Kühlen - schneller als Heizen!
          newTemp = Math.max(newTemp - COOLING_RATE, prevState.targetTemperature)
        } else if (!prevState.isHeating && !prevState.isCooling) {
          // Passive Abkühlung/Erwärmung zur Raumtemperatur (sehr langsam!)
          const diff = ROOM_TEMPERATURE - newTemp
          if (Math.abs(diff) > 0.1) {
            // Nur wenn Temperaturdifferenz > 0.1°C
            newTemp += diff * PASSIVE_COOLING_RATE
          }
        }

        // Thermometer-Trägheit simulieren
        const thermometerDiff = newTemp - newThermometerReading
        newThermometerReading += thermometerDiff * THERMOMETER_LAG

        // History aktualisieren (alle 5 Frames)
        let newHistory = prevState.history
        if (Math.floor(prevState.time * 10) !== Math.floor(newTime * 10)) {
          newHistory = [...prevState.history, { 
            time: newTime, 
            temp: newTemp, 
            thermometer: newThermometerReading 
          }]
          if (newHistory.length > MAX_HISTORY) {
            newHistory = newHistory.slice(-MAX_HISTORY)
          }
        }

        return {
          ...prevState,
          temperature: newTemp,
          thermometerReading: newThermometerReading,
          time: newTime,
          history: newHistory
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    if (state.isRunning) {
      lastTimeRef.current = Date.now()
      animate()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [state.isRunning])

  // Rendering-Effekt - wird bei jeder State-Änderung aufgerufen
  useEffect(() => {
    render()
    renderChart()
  }, [state.temperature, state.thermometerReading, state.history, state.isHeating, state.isCooling])

  // Rendering
  const render = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const centerY = height / 2

    // Canvas leeren
    ctx.clearRect(0, 0, width, height)

    // Hintergrund - eleganter Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#f8fafc')
    gradient.addColorStop(1, '#e2e8f0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Thermometer zeichnen (links)
    drawThermometer(ctx, 80, centerY - 80, state.thermometerReading)
    
    // Temperatur-Objekt zeichnen (rechts)
    drawTemperatureObject(ctx, width - 120, centerY, state.temperature)
    
    // Wärmequellen zeichnen
    if (state.isHeating) {
      drawHeatSource(ctx, width - 120, centerY + 100, 'heating')
    }
    if (state.isCooling) {
      drawHeatSource(ctx, width - 120, centerY + 100, 'cooling')
    }

    // Labels
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    
    // Thermometer Label
    ctx.fillText('Thermometer', 80, centerY - 110)
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
    ctx.fillText(`${state.thermometerReading.toFixed(1)}°C`, 80, centerY + 100)
    
    // Objekt Label
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
    ctx.fillText('Objekt', width - 120, centerY - 110)
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
    ctx.fillText(`${state.temperature.toFixed(1)}°C`, width - 120, centerY - 85)
  }

  const drawThermometer = (ctx: CanvasRenderingContext2D, x: number, y: number, temp: number) => {
    const tubeWidth = 24
    const tubeHeight = 140
    const bulbRadius = 28
    
    // Thermometer-Hintergrund (Glas-Effekt)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 2
    
    // Rohr
    ctx.beginPath()
    ctx.roundRect(x - tubeWidth/2, y, tubeWidth, tubeHeight, 8)
    ctx.fill()
    ctx.stroke()
    
    // Bulb (Kugel unten)
    ctx.beginPath()
    ctx.arc(x, y + tubeHeight + bulbRadius - 5, bulbRadius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    
    // Quecksilber-Säule (mit Gradient)
    const mercuryHeight = Math.max(0, Math.min(100, (temp - 0) / 100 * tubeHeight))
    const mercuryGradient = ctx.createLinearGradient(0, y + tubeHeight, 0, y + tubeHeight - mercuryHeight)
    mercuryGradient.addColorStop(0, '#dc2626')
    mercuryGradient.addColorStop(1, '#ef4444')
    ctx.fillStyle = mercuryGradient
    
    // Quecksilber in der Kugel
    ctx.beginPath()
    ctx.arc(x, y + tubeHeight + bulbRadius - 5, bulbRadius - 4, 0, 2 * Math.PI)
    ctx.fill()
    
    // Quecksilber im Rohr
    if (mercuryHeight > 0) {
      ctx.fillRect(x - 6, y + tubeHeight - mercuryHeight, 12, mercuryHeight)
    }
    
    // Skala (eleganter)
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1.5
    ctx.font = '11px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#475569'
    
    for (let i = 0; i <= 100; i += 10) {
      const scaleY = y + tubeHeight - (i / 100 * tubeHeight)
      const isMainMark = i % 20 === 0
      
      ctx.beginPath()
      ctx.moveTo(x + tubeWidth/2 + 2, scaleY)
      ctx.lineTo(x + tubeWidth/2 + (isMainMark ? 10 : 6), scaleY)
      ctx.stroke()
      
      if (isMainMark) {
        ctx.textAlign = 'left'
        ctx.fillText(`${i}°`, x + tubeWidth/2 + 14, scaleY + 4)
      }
    }
  }

  const drawTemperatureObject = (ctx: CanvasRenderingContext2D, x: number, y: number, temp: number) => {
    const size = 50
    
    // Sanfter Farbübergang von Blau (0°C) über Grün/Gelb zu Rot (100°C)
    const normalizedTemp = Math.max(0, Math.min(100, temp)) / 100
    
    let r, g, b
    if (normalizedTemp < 0.2) {
      // Kalt: Blau (0-20°C)
      const t = normalizedTemp / 0.2
      r = Math.round(59 + (100 - 59) * t)
      g = Math.round(130 + (149 - 130) * t)
      b = Math.round(246 + (237 - 246) * t)
    } else if (normalizedTemp < 0.5) {
      // Kühl bis warm: Cyan zu Grün (20-50°C)
      const t = (normalizedTemp - 0.2) / 0.3
      r = Math.round(100 + (34 - 100) * t)
      g = Math.round(149 + (197 - 149) * t)
      b = Math.round(237 + (94 - 237) * t)
    } else if (normalizedTemp < 0.7) {
      // Warm: Grün zu Gelb (50-70°C)
      const t = (normalizedTemp - 0.5) / 0.2
      r = Math.round(34 + (234 - 34) * t)
      g = Math.round(197 + (179 - 197) * t)
      b = Math.round(94 + (8 - 94) * t)
    } else {
      // Heiß: Gelb zu Rot (70-100°C)
      const t = (normalizedTemp - 0.7) / 0.3
      r = Math.round(234 + (239 - 234) * t)
      g = Math.round(179 + (68 - 179) * t)
      b = Math.round(8 + (68 - 8) * t)
    }
    
    const color = `rgb(${r}, ${g}, ${b})`
    
    // Äußerer Schatten
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.shadowBlur = 15
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 5
    
    // Hauptobjekt mit Gradient
    const gradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size)
    gradient.addColorStop(0, `rgba(${r + 50}, ${g + 50}, ${b + 50}, 1)`)
    gradient.addColorStop(0.7, color)
    gradient.addColorStop(1, `rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 1)`)
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.fill()
    
    // Schatten zurücksetzen
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    // Glanz-Effekt (Highlight)
    const highlightGradient = ctx.createRadialGradient(x - size * 0.4, y - size * 0.4, 0, x - size * 0.4, y - size * 0.4, size * 0.6)
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)')
    highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = highlightGradient
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.fill()
    
    // Rand
    ctx.strokeStyle = `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 0.5)`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI)
    ctx.stroke()
  }

  const drawHeatSource = (ctx: CanvasRenderingContext2D, x: number, y: number, type: 'heating' | 'cooling') => {
    if (type === 'heating') {
      // Animierte Flammen
      const time = Date.now() * 0.003
      for (let i = 0; i < 3; i++) {
        const flameX = x + (i - 1) * 20
        const flameY = y + Math.sin(time + i) * 8
        const flameSize = 10 + Math.sin(time * 2 + i) * 3
        
        // Flammen-Gradient
        const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, flameSize)
        flameGradient.addColorStop(0, '#fbbf24')
        flameGradient.addColorStop(0.5, '#f97316')
        flameGradient.addColorStop(1, '#dc2626')
        
        ctx.fillStyle = flameGradient
        ctx.beginPath()
        ctx.arc(flameX, flameY, flameSize, 0, 2 * Math.PI)
        ctx.fill()
      }
    } else {
      // Animierte Schneeflocken
      const time = Date.now() * 0.002
      for (let i = 0; i < 5; i++) {
        const snowX = x + (i - 2) * 15
        const snowY = y + Math.sin(time + i) * 5
        
        ctx.fillStyle = '#60a5fa'
        ctx.strokeStyle = '#93c5fd'
        ctx.lineWidth = 1
        
        // Schneeflocke zeichnen
        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const angle = (j * Math.PI) / 3
          ctx.moveTo(snowX, snowY)
          ctx.lineTo(snowX + Math.cos(angle) * 6, snowY + Math.sin(angle) * 6)
        }
        ctx.stroke()
      }
    }
  }

  // Chart Rendering
  const renderChart = () => {
    const canvas = chartCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const padding = 50
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    // Canvas leeren
    ctx.clearRect(0, 0, width, height)

    // Hintergrund
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Gitter
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1

    // Horizontale Gitterlinien (Temperatur)
    for (let i = 0; i <= 10; i++) {
      const y = padding + (chartHeight / 10) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-Achsen-Labels
      const temp = 100 - i * 10
      ctx.fillStyle = '#64748b'
      ctx.font = '12px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${temp}°C`, padding - 10, y + 4)
    }

    // Vertikale Gitterlinien (Zeit) - dynamische Skalierung
    const timeRange = Math.max(20, state.time) // Zeigt immer die gesamte Zeit
    const timeStep = timeRange / 10
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()

      // X-Achsen-Labels
      const time = i * timeStep
      ctx.fillStyle = '#64748b'
      ctx.font = '12px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${time.toFixed(0)}s`, x, height - padding + 20)
    }

    // Achsenbeschriftungen
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Zeit (Sekunden)', width / 2, height - 10)
    
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Temperatur (°C)', 0, 0)
    ctx.restore()

    // Daten zeichnen - zeigt immer die gesamte Historie
    if (state.history.length > 0) {
      // Tatsächliche Temperatur (durchgezogene Linie)
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.beginPath()
      
      let firstPoint = true
      state.history.forEach((point) => {
        const x = padding + (point.time / timeRange) * chartWidth
        const y = padding + ((100 - point.temp) / 100) * chartHeight
        
        if (firstPoint) {
          ctx.moveTo(x, y)
          firstPoint = false
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Thermometer-Anzeige (gestrichelte Linie)
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      
      firstPoint = true
      state.history.forEach((point) => {
        const x = padding + (point.time / timeRange) * chartWidth
        const y = padding + ((100 - point.thermometer) / 100) * chartHeight
        
        if (firstPoint) {
          ctx.moveTo(x, y)
          firstPoint = false
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      ctx.setLineDash([])

      // Aktuelle Position markieren (Punkte)
      if (state.history.length > 0) {
        const lastPoint = state.history[state.history.length - 1]
        const x = padding + (lastPoint.time / timeRange) * chartWidth
        
        // Tatsächliche Temperatur Punkt
        const yTemp = padding + ((100 - lastPoint.temp) / 100) * chartHeight
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.arc(x, yTemp, 5, 0, 2 * Math.PI)
        ctx.fill()
        
        // Thermometer Punkt
        const yThermo = padding + ((100 - lastPoint.thermometer) / 100) * chartHeight
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(x, yThermo, 5, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    // Legende
    const legendX = width - padding - 150
    const legendY = padding + 20

    // Tatsächliche Temperatur
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 30, legendY)
    ctx.stroke()
    
    ctx.fillStyle = '#1e293b'
    ctx.font = '12px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('Tatsächliche Temperatur', legendX + 35, legendY + 4)

    // Thermometer
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 20)
    ctx.lineTo(legendX + 30, legendY + 20)
    ctx.stroke()
    ctx.setLineDash([])
    
    ctx.fillText('Thermometer-Anzeige', legendX + 35, legendY + 24)
  }

  const handleStart = () => {
    setState(prev => ({ ...prev, isRunning: true }))
  }

  const handleStop = () => {
    setState(prev => ({ ...prev, isRunning: false }))
  }

  const handleReset = () => {
    setState({
      temperature: 20,
      targetTemperature: 20,
      isHeating: false,
      isCooling: false,
      thermometerReading: 20,
      isRunning: false,
      time: 0,
      history: [{ time: 0, temp: 20, thermometer: 20 }]
    })
    lastTimeRef.current = Date.now()
  }

  const handleHeating = () => {
    setState(prev => ({
      ...prev,
      isHeating: true,
      isCooling: false,
      targetTemperature: 80,
      isRunning: true
    }))
  }

  const handleCooling = () => {
    setState(prev => ({
      ...prev,
      isHeating: false,
      isCooling: true,
      targetTemperature: 0,
      isRunning: true
    }))
  }

  const handleStopHeatingCooling = () => {
    setState(prev => ({
      ...prev,
      isHeating: false,
      isCooling: false
      // isRunning bleibt unverändert - Simulation läuft weiter!
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Thermometer className="h-8 w-8 text-blue-600" />
          ThermoLab – Heizen, Kühlen & Messen
        </h2>
        <p className="text-gray-600">
          Entdecke den Unterschied zwischen Wärme und Temperatur! Heize oder kühle das Objekt und beobachte, 
          wie das Thermometer reagiert.
        </p>
      </div>

      {/* Visualisierung */}
      <div className="mb-6 flex justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={280}
          className="border-2 border-gray-200 rounded-lg shadow-sm"
        />
      </div>

      {/* Temperatur-Verlauf Diagramm */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          📊 Temperatur-Verlauf über die Zeit
        </h3>
        <div className="flex justify-center">
          <canvas
            ref={chartCanvasRef}
            width={700}
            height={350}
            className="border-2 border-gray-200 rounded-lg shadow-sm bg-white"
          />
        </div>
      </div>

      {/* Kontrollen */}
      <div className="space-y-4">
        {/* Haupt-Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={state.isRunning ? handleStop : handleStart}
            className={clsx(
              "px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors",
              state.isRunning
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            )}
          >
            {state.isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {state.isRunning ? "Stopp" : "Start"}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            Zurücksetzen
          </button>
        </div>

        {/* Heizen/Kühlen */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleHeating}
            disabled={state.isHeating}
            className={clsx(
              "px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors",
              state.isHeating
                ? "bg-orange-300 text-orange-800 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            )}
          >
            <Flame className="h-5 w-5" />
            Heizen (80°C)
          </button>

          <button
            onClick={handleCooling}
            disabled={state.isCooling}
            className={clsx(
              "px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors",
              state.isCooling
                ? "bg-blue-300 text-blue-800 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            <Snowflake className="h-5 w-5" />
            Kühlen (0°C)
          </button>

          <button
            onClick={handleStopHeatingCooling}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <Zap className="h-5 w-5" />
            Heizen/Kühlen stoppen
          </button>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 font-medium mb-1">Tatsächliche Temperatur</div>
            <div className="text-3xl font-bold text-blue-700">{state.temperature.toFixed(1)}°C</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-sm text-red-600 font-medium mb-1">Thermometer-Anzeige</div>
            <div className="text-3xl font-bold text-red-700">{state.thermometerReading.toFixed(1)}°C</div>
            {Math.abs(state.temperature - state.thermometerReading) > 1 && (
              <div className="text-xs text-orange-600 mt-1">⚠️ Hinkt hinterher!</div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 font-medium mb-1">Verstrichene Zeit</div>
            <div className="text-3xl font-bold text-gray-700">{state.time.toFixed(1)}s</div>
          </div>
        </div>

        {/* Lernziel */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <h3 className="font-semibold text-blue-800 mb-2">Was lernst du hier?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Temperatur</strong> ist, wie warm oder kalt etwas ist</li>
            <li>• <strong>Wärme</strong> ist Energie, die von warmen zu kalten Objekten fließt</li>
            <li>• Thermometer brauchen Zeit, um die richtige Temperatur zu zeigen (Trägheit)</li>
            <li>• Heizen = Temperatur steigt, Kühlen = Temperatur sinkt</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
