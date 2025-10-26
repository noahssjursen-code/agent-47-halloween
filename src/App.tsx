import { useState, useEffect } from 'react'
import HitmanModel from './components/HitmanModel'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [heartRate, setHeartRate] = useState(85)
  const [heartRateHistory, setHeartRateHistory] = useState([85, 87, 83, 89, 85])
  const [bloodPressure, setBloodPressure] = useState('120/80')
  const [temperature, setTemperature] = useState('37.0°C')
  const [oxygenSat, setOxygenSat] = useState('98%')
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString())
  const [missionStatus, setMissionStatus] = useState('')
  const [coverStatus, setCoverStatus] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')

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
        setCoverStatus('CIVILIAN')
        setCurrentLocation('UNKNOWN')
      } else if ((dayOfWeek === 6 && hour >= 18) || (dayOfWeek === 0 && hour < 4)) { // Saturday after 6 PM OR Sunday before 4 AM
        setMissionStatus('BARTENDING')
        setCoverStatus('BARTENDER')
        setCurrentLocation('SJØHUSET')
      } else if (dayOfWeek === 6 && hour < 18) { // Saturday before 6 PM
        setMissionStatus('PREPARATION')
        setCoverStatus('CIVILIAN')
        setCurrentLocation('UNKNOWN')
      } else if (dayOfWeek === 0 && hour >= 4) { // Sunday after 4 AM
        setMissionStatus('DEBRIEFING')
        setCoverStatus('CIVILIAN')
        setCurrentLocation('UNKNOWN')
      } else if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday-Thursday
        setMissionStatus('TRAINING')
        setCoverStatus('CIVILIAN')
        setCurrentLocation('UNKNOWN')
      } else {
        setMissionStatus('STANDBY')
        setCoverStatus('CIVILIAN')
        setCurrentLocation('UNKNOWN')
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
      
      // Temperature simulation (Celsius)
      const temp = (36.5 + Math.random() * 1.5).toFixed(1)
      setTemperature(`${temp}°C`)
      
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
        <div className="text-center max-w-6xl mb-8">
          <div className="bg-gradient-to-br from-black/60 via-black/80 to-black/60 backdrop-blur-md rounded-xl p-6 md:p-8 border border-red-500/40 shadow-2xl">
            <div className="flex items-center justify-center mb-8">
              <h3 className="text-red-400 text-xl md:text-2xl font-mono font-bold tracking-wider">AGENT DOSSIER</h3>
            </div>
            
            {/* Dossier Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              
              {/* Basic Info Section */}
              <div className="bg-gradient-to-br from-black/40 to-black/60 rounded-lg p-4 md:p-5 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <div className="text-red-400 text-sm">👤</div>
                  </div>
                  <h4 className="text-red-400 text-sm md:text-base font-mono font-bold">IDENTITY</h4>
                </div>
                <div className="space-y-3 text-left">
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">IDENTITY</p>
                    <p className="text-white text-sm md:text-base font-semibold">Agent 47</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">ALIAS</p>
                    <p className="text-white text-sm md:text-base font-semibold">Noah</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">AGE</p>
                    <p className="text-white text-sm md:text-base font-semibold">21</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">COVER</p>
                    <p className="text-white text-sm md:text-base font-semibold">{coverStatus}</p>
                  </div>
                  <div className="border-l-2 border-green-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">STATUS</p>
                    <p className="text-green-400 text-sm md:text-base font-semibold">ALIVE</p>
                  </div>
                </div>
              </div>

              {/* Vital Signs Section */}
              <div className="bg-gradient-to-br from-black/40 to-black/60 rounded-lg p-4 md:p-5 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <div className="text-red-400 text-sm">💓</div>
                  </div>
                  <h4 className="text-red-400 text-sm md:text-base font-mono font-bold">VITAL SIGNS</h4>
                </div>
                <div className="space-y-3 text-left">
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">HEART RATE</p>
                    <p className="text-red-400 text-sm md:text-base font-mono font-bold">{heartRate} BPM</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">BLOOD PRESSURE</p>
                    <p className="text-red-400 text-sm md:text-base font-mono font-bold">{bloodPressure}</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">TEMPERATURE</p>
                    <p className="text-red-400 text-sm md:text-base font-mono font-bold">{temperature}</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">OXYGEN SAT</p>
                    <p className="text-red-400 text-sm md:text-base font-mono font-bold">{oxygenSat}</p>
                  </div>
                </div>
              </div>

              {/* Mission Details Section */}
              <div className="bg-gradient-to-br from-black/40 to-black/60 rounded-lg p-4 md:p-5 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <div className="text-red-400 text-sm">🎯</div>
                  </div>
                  <h4 className="text-red-400 text-sm md:text-base font-mono font-bold">MISSION STATUS</h4>
                </div>
                <div className="space-y-3 text-left">
                  <div className="border-l-2 border-yellow-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">PHASE</p>
                    <p className="text-yellow-400 text-sm md:text-base font-mono font-bold">{missionStatus}</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">CLEARANCE</p>
                    <p className="text-white text-sm md:text-base font-semibold">CLASSIFIED</p>
                  </div>
                  <div className="border-l-2 border-gray-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">LAST UPDATE</p>
                    <p className="text-gray-300 text-xs md:text-sm font-mono">{currentTime}</p>
                  </div>
                  <div className="border-l-2 border-blue-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">CURRENT LOCATION</p>
                    <p className="text-blue-400 text-sm md:text-base font-mono font-bold">{currentLocation}</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">PRIORITY</p>
                    <p className="text-red-400 text-sm md:text-base font-semibold">HIGH</p>
                  </div>
                </div>
              </div>

              {/* Agent Statistics Section */}
              <div className="bg-gradient-to-br from-black/40 to-black/60 rounded-lg p-4 md:p-5 border border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                    <div className="text-red-400 text-sm">📊</div>
                  </div>
                  <h4 className="text-red-400 text-sm md:text-base font-mono font-bold">STATISTICS</h4>
                </div>
                <div className="space-y-3 text-left">
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">MAIN TARGETS</p>
                    <p className="text-red-400 text-sm md:text-base font-mono font-bold">39</p>
                  </div>
                  <div className="border-l-2 border-red-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">TOTAL ELIMINATED</p>
                    <p className="text-red-400 text-sm md:text-base font-mono font-bold">876</p>
                  </div>
                  <div className="border-l-2 border-green-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">MONEY EARNED</p>
                    <p className="text-green-400 text-sm md:text-base font-mono font-bold">$2.8M</p>
                  </div>
                  <div className="border-l-2 border-green-500/30 pl-3">
                    <p className="text-gray-400 text-xs font-mono">SUCCESS RATE</p>
                    <p className="text-green-400 text-sm md:text-base font-mono font-bold">98.4%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-8 bg-gradient-to-r from-black/50 via-black/60 to-black/50 rounded-lg p-5 md:p-6 border border-red-500/30">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                  <div className="text-red-400 text-sm">📝</div>
                </div>
                <h4 className="text-red-400 text-sm md:text-base font-mono font-bold">INTELLIGENCE REPORT</h4>
              </div>
              <div className="space-y-4 text-left">
                <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    <span className="text-red-400 font-mono font-bold">OPERATIVE PROFILE:</span> Highly skilled field agent with extensive combat experience and exceptional elimination capabilities. Maintains operational excellence across 39 primary targets and 876 total eliminations.
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    <span className="text-red-400 font-mono font-bold">CURRENT COVER:</span> Operating under bartender identity with expert-level mixology skills and superior customer service capabilities. Cover provides excellent access to target environments and maintains low-profile operational status.
                  </p>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-red-500/20">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                    <span className="text-red-400 font-mono font-bold">TECHNICAL STATUS:</span> QR code tracking system active. Real-time monitoring capabilities enabled. Mission parameters: High priority, classified clearance level.
                  </p>
                </div>
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
