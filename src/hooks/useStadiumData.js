import { useState, useEffect } from 'react'

export const useStadiumData = () => {
  const [crowdData, setCrowdData] = useState({
    gates: [
      { id: 1, crowd: 0.8 },
      { id: 2, crowd: 0.73 },
      { id: 3, crowd: 0.92 },
      { id: 4, crowd: 0.65 }
    ],
    heatPoints: [
      { x: 120, y: 140, intensity: 0.8 },
      { x: 220, y: 130, intensity: 0.6 },
      { x: 300, y: 160, intensity: 0.9 }
    ]
  })
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCrowdData(prev => ({
        gates: prev.gates.map(gate => ({
          ...gate,
          crowd: Math.max(0, Math.min(1, gate.crowd + (Math.random() - 0.5) * 0.1))
        })),
        heatPoints: prev.heatPoints.map(point => ({
          ...point,
          intensity: Math.max(0, Math.min(1, point.intensity + (Math.random() - 0.5) * 0.15))
        }))
      }))
    }, 10000)

    // Mock offline detection
    const offlineInterval = setInterval(() => {
      setIsOffline(Math.random() < 0.1)
    }, 30000)

    window.addEventListener('offline', () => setIsOffline(true))
    window.addEventListener('online', () => setIsOffline(false))

    return () => {
      clearInterval(interval)
      clearInterval(offlineInterval)
    }
  }, [])

  return { crowdData, isOffline }
}
