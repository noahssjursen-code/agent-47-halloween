import { useState, useEffect } from 'react'
import HitmanModel from './components/HitmanModel'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [heartRate, setHeartRate] = useState(85)
  const [heartRateHistory, setHeartRateHistory] = useState([85, 87, 83, 89, 85])
  const [bloodPressure, setBloodPressure] = useState('120/80')
  const [temperature, setTemperature] = useState('98.6°F')
  const [oxygenSat, setOxygenSat] = useState('98%')
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString())
  const [missionStatus, setMissionStatus] = useState('')

  useEffect(() => {
    // Simulate loading time for government system initialization
    const loadingSteps = [
      'ESTABLISHING SECURE CHANNEL',
      'LOADING AGENT DATABASE', 
      'INITIALIZING VITAL MONITORS',
      'ESTABLISHING QR TRACKING',
      'FINALIZING SYSTEM ACCESS'
    ]
    
    let progress = 0
    let step = 0
    
    const progressInterval = setInterval(() => {
      progress += Math.random() * 8 + 3 // Slower progress increments for 5 seconds
      if (progress >= 100) {
        progress = 100
        clearInterval(progressInterval)
        setTimeout(() => setIsLoading(false), 500)
      }
      
      // Update step based on progress
      const newStep = Math.floor((progress / 100) * loadingSteps.length)
      if (newStep !== step) {
        step = newStep
        setCurrentStep(step)
      }
      
      setLoadingProgress(Math.min(progress, 100))
    }, 150)
    
    // Set mission status based on day/time
    const updateMissionStatus = () => {
      const now = new Date()
      const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
      const hour = now.getHours()
      
      if (dayOfWeek === 5) { // Friday
        setMissionStatus('RECONNAISSANCE')
      } else if (dayOfWeek === 6 && hour >= 18) { // Saturday after 6 PM
        setMissionStatus('BARTENDING')
      } else if (dayOfWeek === 6 && hour < 18) { // Saturday before 6 PM
        setMissionStatus('PREPARATION')
      } else if (dayOfWeek === 0) { // Sunday
        setMissionStatus('DEBRIEFING')
      } else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday-Thursday
        setMissionStatus('TRAINING')
      } else {
        setMissionStatus('STANDBY')
      }
    }
    
    // Set initial status
    updateMissionStatus()
    
    // Update status every hour (not every 3 seconds)
    const statusInterval = setInterval(updateMissionStatus, 3600000) // 1 hour
    
    // Vital signs simulation
    const vitalSignsInterval = setInterval(() => {
      // Heart rate simulation
      const baseRate = 85
      const variation = Math.random() * 20 - 10
      const newRate = Math.round(baseRate + variation)
      const clampedRate = Math.max(75, Math.min(95, newRate))
      
      setHeartRate(clampedRate)
      setHeartRateHistory(prev => {
        const newHistory = [...prev, clampedRate]
        return newHistory.slice(-10)
      })
      
      // Blood pressure simulation
      const systolic = Math.round(110 + Math.random() * 20)
      const diastolic = Math.round(70 + Math.random() * 15)
      setBloodPressure(`${systolic}/${diastolic}`)
      
      // Temperature simulation
      const temp = (98.0 + Math.random() * 2).toFixed(1)
      setTemperature(`${temp}°F`)
      
      // Oxygen saturation simulation
      const oxygen = Math.round(95 + Math.random() * 4)
      setOxygenSat(`${oxygen}%`)
      
      // Update timestamp
      setCurrentTime(new Date().toLocaleString())
    }, 3000) // Update every 3 seconds
    
    return () => {
      clearInterval(progressInterval)
      clearInterval(statusInterval)
      clearInterval(vitalSignsInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Government Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="bg-black/90 border border-green-500/50 rounded-lg p-6 md:p-8 max-w-sm md:max-w-lg w-full mx-4">
            {/* Government Header */}
            <div className="text-center mb-6">
              <div className="text-green-400 text-base md:text-lg font-mono font-bold mb-2 animate-pulse">
                CLASSIFIED GOVERNMENT SYSTEM
              </div>
              <div className="text-green-500 text-sm md:text-base font-mono">
                INITIALIZING SECURE CONNECTION...
              </div>
              <div className="text-gray-400 text-xs md:text-sm font-mono mt-1">
                {new Date().toLocaleString()}
              </div>
            </div>
            
            {/* Loading Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs md:text-sm text-green-400 font-mono mb-2">
                <span>SYSTEM STATUS</span>
                <span className="animate-pulse">{Math.round(loadingProgress)}%</span>
              </div>
              <div className="w-full bg-black border border-green-500/30 rounded-full h-2 md:h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-2 md:h-3 rounded-full transition-all duration-300 ease-out"
                  style={{width: `${loadingProgress}%`}}
                ></div>
              </div>
              <div className="text-center text-xs md:text-sm text-green-400 font-mono mt-1">
                {loadingProgress < 100 ? 'INITIALIZING...' : 'ACCESS GRANTED'}
              </div>
            </div>
            
            {/* Loading Steps */}
            <div className="space-y-2 text-xs md:text-sm font-mono">
              {[
                'ESTABLISHING SECURE CHANNEL',
                'LOADING AGENT DATABASE', 
                'INITIALIZING VITAL MONITORS',
                'ESTABLISHING QR TRACKING',
                'FINALIZING SYSTEM ACCESS'
              ].map((step, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={`${index <= currentStep ? 'text-green-400' : 'text-gray-500'}`}>
                    • {step}
                  </span>
                  <span className={`${index < currentStep ? 'text-green-500' : index === currentStep ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`}>
                    {index < currentStep ? '✓' : index === currentStep ? '...' : '○'}
                  </span>
                </div>
              ))}
            </div>
            
            {/* System Info */}
            <div className="mt-6 bg-black/50 rounded p-3 md:p-4 border border-green-500/20">
              <div className="text-xs md:text-sm font-mono text-green-400 mb-2">SYSTEM INFORMATION</div>
              <div className="space-y-1 text-xs md:text-sm font-mono text-gray-300">
                <div className="flex justify-between">
                  <span>CONNECTION:</span>
                  <span className="text-green-400">SECURE</span>
                </div>
                <div className="flex justify-between">
                  <span>ENCRYPTION:</span>
                  <span className="text-green-400">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span>ACCESS LEVEL:</span>
                  <span className="text-red-400">CLASSIFIED</span>
                </div>
              </div>
            </div>
            
            {/* Warning */}
            <div className="mt-6 text-center">
              <div className="text-red-400 text-xs md:text-sm font-mono animate-pulse">
                ⚠️ UNAUTHORIZED ACCESS PROHIBITED ⚠️
              </div>
              <div className="text-gray-400 text-xs font-mono mt-1">
                This system is monitored and logged
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-red-900/5"></div>
      
      {/* Target Crosshair Overlay */}
      {false && (
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-2 border-red-500 rounded-full animate-ping">
              <div className="absolute top-1/2 left-0 w-8 h-0.5 bg-red-500 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 right-0 w-8 h-0.5 bg-red-500 transform -translate-y-1/2"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-8 bg-red-500 transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-8 bg-red-500 transform -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        

        {/* Full Hero Section with Model */}
        <div className="relative w-full max-w-4xl mx-auto h-[70vh] md:h-[80vh] mb-8">
          {/* 3D Model Container */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl border border-red-500/20 backdrop-blur-sm">
            <HitmanModel />
            
            {/* Spinning Rings */}
            <div className="absolute -inset-3 border border-red-500/20 rounded-2xl animate-spin-slow"></div>
            <div className="absolute -inset-6 border border-red-400/10 rounded-2xl animate-spin-reverse"></div>
          </div>
          
          {/* Title Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-start text-center z-10 pt-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent tracking-wider font-mono">
              AGENT 47
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-mono tracking-widest">
              MISSION ACTIVE
            </p>
          </div>
          
          {/* Heart Rate Monitor Overlay */}
          <div className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto bg-black/95 backdrop-blur-sm rounded-lg p-3 border-2 border-red-500/60 z-20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="text-red-500 text-xl animate-pulse">❤️</div>
                <div className="text-red-400 text-sm font-mono font-bold">HEART RATE</div>
              </div>
              <div className="text-red-400 text-xl font-mono font-bold">{heartRate} BPM</div>
            </div>
            
            {/* Hospital-style Heartbeat Waveform */}
            <div className="w-full h-6 bg-black/70 rounded border border-red-500/40 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 100 20">
                {heartRateHistory.map((rate, index) => {
                  const x = (index / (heartRateHistory.length - 1)) * 100
                  const y = 20 - ((rate - 70) / 30) * 20 // Normalize to 0-20
                  const nextRate = heartRateHistory[index + 1]
                  if (nextRate) {
                    const nextX = ((index + 1) / (heartRateHistory.length - 1)) * 100
                    const nextY = 20 - ((nextRate - 70) / 30) * 20
                    return (
                      <line
                        key={index}
                        x1={x}
                        y1={y}
                        x2={nextX}
                        y2={nextY}
                        stroke="#ef4444"
                        strokeWidth="1"
                        opacity={index === heartRateHistory.length - 2 ? 1 : 0.7}
                      />
                    )
                  }
                  return null
                })}
                {/* Heartbeat spike effect */}
                <circle
                  cx={(heartRateHistory.length - 1) / (heartRateHistory.length - 1) * 100}
                  cy={20 - ((heartRate - 70) / 30) * 20}
                  r="1.5"
                  fill="#ef4444"
                  opacity="1"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="flex justify-center mb-8">
        </div>

        {/* Agent Dossier */}
        <div className="text-center max-w-4xl mb-8">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">
            <h3 className="text-red-400 text-lg font-mono mb-6">AGENT DOSSIER</h3>
            
            {/* Dossier Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Basic Info Section */}
              <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                <h4 className="text-red-400 text-sm font-mono mb-3">IDENTITY</h4>
                <div className="space-y-2 text-left">
                  <div>
                    <p className="text-gray-400 text-xs font-mono">IDENTITY</p>
                    <p className="text-white text-sm">Agent 47</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">ALIAS</p>
                    <p className="text-white text-sm">Noah</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">AGE</p>
                    <p className="text-white text-sm">21</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">COVER</p>
                    <p className="text-white text-sm">Bartender</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">STATUS</p>
                    <p className="text-green-400 text-sm">ALIVE</p>
                  </div>
                </div>
              </div>

              {/* Vital Signs Section */}
              <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                <h4 className="text-red-400 text-sm font-mono mb-3">VITAL SIGNS</h4>
                <div className="space-y-2 text-left">
                  <div>
                    <p className="text-gray-400 text-xs font-mono">HEART RATE</p>
                    <p className="text-red-400 text-sm font-mono">{heartRate} BPM</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">BLOOD PRESSURE</p>
                    <p className="text-red-400 text-sm font-mono">{bloodPressure}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">TEMPERATURE</p>
                    <p className="text-red-400 text-sm font-mono">{temperature}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">OXYGEN SAT</p>
                    <p className="text-red-400 text-sm font-mono">{oxygenSat}</p>
                  </div>
                </div>
              </div>

              {/* Mission Details Section */}
              <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                <h4 className="text-red-400 text-sm font-mono mb-3">MISSION STATUS</h4>
                <div className="space-y-2 text-left">
                  <div>
                    <p className="text-gray-400 text-xs font-mono">PHASE</p>
                    <p className="text-yellow-400 text-sm font-mono">{missionStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">CLEARANCE</p>
                    <p className="text-white text-sm">CLASSIFIED</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">LAST UPDATE</p>
                    <p className="text-gray-300 text-xs font-mono">{currentTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">PRIORITY</p>
                    <p className="text-red-400 text-sm">HIGH</p>
                  </div>
                </div>
              </div>

              {/* Agent Statistics Section */}
              <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                <h4 className="text-red-400 text-sm font-mono mb-3">AGENT STATISTICS</h4>
                <div className="space-y-2 text-left">
                  <div>
                    <p className="text-gray-400 text-xs font-mono">MAIN TARGETS ELIMINATED</p>
                    <p className="text-red-400 text-sm font-mono">39</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">TOTAL TARGETS ELIMINATED</p>
                    <p className="text-red-400 text-sm font-mono">876</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-mono">MONEY EARNED</p>
                    <p className="text-green-400 text-sm font-mono">$2,847,500</p>
                  </div>
      <div>
                    <p className="text-gray-400 text-xs font-mono">SUCCESS RATE</p>
                    <p className="text-green-400 text-sm font-mono">98.4%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6 bg-black/30 rounded-lg p-4 border border-red-500/20">
              <h4 className="text-red-400 text-sm font-mono mb-3">NOTES</h4>
              <div className="space-y-3 text-left">
                <p className="text-gray-300 text-sm">
                  <span className="text-red-400 font-mono">OPERATIVE PROFILE:</span> Highly skilled field agent with extensive combat experience and exceptional elimination capabilities. Maintains operational excellence across 39 primary targets and 876 total eliminations.
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-red-400 font-mono">CURRENT COVER:</span> Operating under bartender identity with expert-level mixology skills and superior customer service capabilities. Cover provides excellent access to target environments and maintains low-profile operational status.
                </p>
                <p className="text-gray-300 text-sm">
                  <span className="text-red-400 font-mono">TECHNICAL STATUS:</span> QR code tracking system active. Real-time monitoring capabilities enabled. Mission parameters: High priority, classified clearance level.
                </p>
              </div>
            </div>
          </div>
      </div>

        {/* Status Bar */}
        <div className="text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-red-500/30">
            <p className="text-red-400 text-sm font-mono tracking-wider">
              MISSION STATUS: ACTIVE
            </p>
            <p className="text-gray-500 text-xs mt-1 font-mono">
              QR CODE SCANNED • TARGET ACQUIRED
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
