import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GajGuide from './components/GajGuide.jsx'
import { useStadiumData } from './hooks/useStadiumData.js'
import { useTheme } from './contexts/ThemeContext.jsx'

function App() {
  const { crowdData, isOffline } = useStadiumData()
  const { theme, toggleTheme } = useTheme()
  const [orderStatus, setOrderStatus] = useState('ordered')

  useEffect(() => {
    const statuses = ['ordered', 'preparing', 'ready']
    const timer = setTimeout(() => {
      const nextIndex = statuses.indexOf(orderStatus) + 1
      if (nextIndex < statuses.length) {
        setOrderStatus(statuses[nextIndex])
      }
    }, 10000)
    return () => clearTimeout(timer)
  }, [orderStatus])

  const statusConfig = {
    ordered: { color: 'bg-alert/20 text-alert dark:bg-alert/30', text: 'Order placed - Nachos & Beer' },
    preparing: { color: 'bg-accent/20 text-accent dark:bg-accent/30', text: 'Preparing your order...' },
    ready: { color: 'bg-green-400/20 text-green-400 dark:bg-green-400/30 font-bold', text: 'Ready at Stand B! 🏃‍♂️' }
  }

  const cardClass = theme === 'light' 
    ? 'shadow-neumorphic bg-white/80 border border-gray-200/50' 
    : 'bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] shadow-glass-glow'

  const isDay = theme === 'light'

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={theme}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        className={`min-h-screen bg-[var(--bg-primary)] p-4 pb-24 relative overflow-hidden [&>*]:relative [&>*]:z-10 transition-all duration-500 ${isDay ? 'bg-gradient-to-b from-day-bg to-slate-50' : 'bg-gradient-to-b from-primary to-black'}`}
      >
        {/* Background Overlay */}
        <div className={`absolute inset-0 ${isDay ? 'bg-white/50 backdrop-blur-sm' : 'bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)]'}`}></div>
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6 relative z-20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-alert bg-clip-text text-transparent drop-shadow-lg">
            M-Maidan
          </h1>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${isOffline ? 'bg-alert/20 text-alert dark:bg-alert/40' : 'bg-accent/20 text-accent dark:bg-accent/40'}`}>
              {isOffline ? 'Offline Mode' : 'Live'}
            </div>
            <motion.button 
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg ${isDay 
                ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-neumorphic hover:shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff]' 
                : 'bg-[var(--glass-bg)] backdrop-blur-md border border-white/20 text-accent hover:border-accent/50 shadow-glass-glow hover:shadow-[0_0_20px_#00FF88]'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDay ? '🌙 Night' : '☀️ Day'}
            </motion.button>
          </div>
        </header>

        {/* Live Crowd Heatmap */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 relative z-20"
        >
          <h2 className="text-xl font-semibold mb-4 drop-shadow-sm">Live Crowd Heatmap</h2>
          <div className={`w-full h-64 rounded-2xl p-6 relative overflow-hidden ${cardClass}`}>
            {/* Legend */}
            <div className="flex gap-2 mb-4 text-xs opacity-75">
              <div className="w-12 h-3 rounded-full bg-green-400"></div>
              <span>Low</span>
              <div className="flex-1 h-3 bg-red-500 rounded-full"></div>
              <span>High</span>
            </div>
            {/* Stadium SVG */}
            <svg viewBox="0 0 400 250" className="w-full h-full">
              <path d="M50 200 Q200 100 350 200 L350 220 Q200 150 50 220 Z" fill={isDay ? '#e2e8f0' : '#0a1625'} stroke="#00FF88" strokeWidth="2"/>
              <defs>
                {crowdData.heatPoints.map((point, i) => (
                  <radialGradient key={`heat-${i}`} id={`heat-${i}`}>
                    <stop offset="0%" stopColor={isDay ? `hsl(120, 100%, ${50 + point.intensity * 50}%)` : '#00ff88'} />
                    <stop offset="50%" stopColor={isDay ? `hsl(0, 100%, ${50 + point.intensity * 50}%)` : 'rgba(0, 255, 136, 0.4)'} />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                ))}
                {/* Neon glow for night */}
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00ff88" floodOpacity="0.6"/>
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#00ff88" floodOpacity="0.3"/>
                </filter>
              </defs>
              {crowdData.heatPoints.map((point, i) => (
                <motion.circle
                  key={`point-${i}`}
                  cx={point.x}
                  cy={point.y}
                  r={15 * point.intensity}
                  fill={`url(#heat-${i})`}
                  className={isDay ? '' : 'filter drop-shadow-[0_0_10px_#00ff88]'}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              ))}
              {crowdData.gates.map((gate, i) => (
                <motion.circle
                  key={gate.id}
                  cx={50 + i * 75}
                  cy="210"
                  r={8 + gate.crowd * 15}
                  fill={`hsl(${40 + gate.crowd * 40}, 100%, 50%)`}
                  className={isDay ? '' : 'drop-shadow-[0_0_8px_currentColor]'}
                  animate={{ scale: 1 + gate.crowd * 0.3 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
                </motion.circle>
              ))}
            </svg>
          </div>
        </motion.section>

        {/* Smart Path Card */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6 relative z-20">
          <h2 className="text-xl font-semibold mb-4 drop-shadow-sm">Smart Path</h2>
          <div className={`${cardClass} p-6 rounded-2xl`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 ${isDay ? 'bg-accent/20 shadow-neumorphic' : 'bg-accent/20 backdrop-blur-sm border border-accent/30'} rounded-xl flex items-center justify-center`}>
                <span className="text-accent font-bold text-lg drop-shadow-sm">12-5</span>
              </div>
              <div>
                <p className="text-lg font-semibold drop-shadow-sm">Section 12, Row 5</p>
                <p className="text-sm opacity-75">Estimated time: 4min</p>
              </div>
            </div>
            <div className={`w-full h-3 rounded-full overflow-hidden ${isDay ? 'bg-gray-200 shadow-inner' : 'bg-[var(--glass-bg)]'}`}>
              <motion.div 
                className="bg-gradient-to-r from-accent to-alert h-full rounded-full shadow-lg" 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.section>

        {/* Express Order */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative z-20">
          <h2 className="text-xl font-semibold mb-4 drop-shadow-sm">Express Order</h2>
          <div className={`${cardClass} p-6 rounded-2xl transition-all duration-500 ${statusConfig[orderStatus].color}`}>
            <div className="flex items-center gap-4">
              <motion.div 
                className={`w-16 h-16 rounded-2xl ${isDay ? 'bg-gradient-to-br from-accent/30 shadow-neumorphic' : 'bg-gradient-to-br from-accent/30 to-alert/30 backdrop-blur-sm border border-accent/30'} flex items-center justify-center`}
                animate={{ rotate: orderStatus === 'preparing' ? [0, 360] : 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className={`text-2xl drop-shadow-sm ${isDay ? 'text-accent' : ''}`}>🍟</span>
              </motion.div>
              <div>
                <p className="font-semibold text-lg drop-shadow-sm">{statusConfig[orderStatus].text}</p>
                <p className="text-sm opacity-75">Order #4281</p>
              </div>
            </div>
          </div>
        </motion.section>

        <GajGuide />
      </motion.div>
    </AnimatePresence>
  )
}

export default App

