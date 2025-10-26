import { useState, useEffect } from 'react'
import HitmanModel from './components/HitmanModel'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-red-900/5"></div>
      
      {/* Animated Background Dots */}
      <div className="absolute top-20 left-20 w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-red-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute top-60 left-1/2 w-1 h-1 bg-red-500/60 rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-60 right-20 w-0.5 h-0.5 bg-red-400/80 rounded-full animate-pulse delay-1500"></div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent tracking-wider">
            AGENT 47
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-mono tracking-widest">
            HALLOWEEN 2025
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-300"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-700"></div>
          </div>
        </div>

        {/* 3D Model */}
        <div className="mb-8">
          <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl p-6 shadow-2xl border border-red-500/20 backdrop-blur-sm">
            <HitmanModel />
            
            {/* Spinning Rings */}
            <div className="absolute -inset-3 border border-red-500/20 rounded-2xl animate-spin-slow"></div>
            <div className="absolute -inset-6 border border-red-400/10 rounded-2xl animate-spin-reverse"></div>
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
