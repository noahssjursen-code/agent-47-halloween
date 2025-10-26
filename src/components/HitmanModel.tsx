import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Group } from 'three'

function Model() {
  const { scene } = useGLTF('/models/hitman-model.glb')
  const modelRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (modelRef.current) {
      // Continuous wobble motion
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })
  
  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={2.2} 
        position={[0, -1.2, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  )
}

function HitmanModel() {
  return (
    <div className="w-[28rem] h-[32rem] mx-auto">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Ultra Maximum Lighting Setup */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={3} castShadow />
          <directionalLight position={[-10, 10, -5]} intensity={2.5} />
          <directionalLight position={[0, -10, 0]} intensity={2} />
          <directionalLight position={[5, 5, -10]} intensity={1.8} />
          <directionalLight position={[-5, 5, 10]} intensity={1.8} />
          
          {/* Colored Point Lights */}
          <pointLight position={[0, 5, 0]} intensity={2.5} color="#ff6b6b" />
          <pointLight position={[-5, -5, 5]} intensity={2} color="#4ecdc4" />
          <pointLight position={[5, 0, -5]} intensity={2.2} color="#ffd93d" />
          <pointLight position={[0, -3, 0]} intensity={1.5} color="#ff9ff3" />
          <pointLight position={[8, 3, 3]} intensity={1.8} color="#ff4757" />
          <pointLight position={[-8, 3, -3]} intensity={1.8} color="#3742fa" />
          <pointLight position={[0, 8, 0]} intensity={2} color="#2ed573" />
          <pointLight position={[3, -8, 3]} intensity={1.5} color="#ffa502" />
          
          {/* Multiple Spotlights */}
          <spotLight position={[0, 10, 0]} intensity={4} angle={0.4} penumbra={0.2} />
          <spotLight position={[-8, 5, 8]} intensity={3} angle={0.5} penumbra={0.3} />
          <spotLight position={[8, 5, -8]} intensity={3} angle={0.5} penumbra={0.3} />
          <spotLight position={[0, -5, 0]} intensity={2.5} angle={0.6} penumbra={0.4} />
          <spotLight position={[10, 0, 0]} intensity={2.8} angle={0.3} penumbra={0.2} />
          <spotLight position={[-10, 0, 0]} intensity={2.8} angle={0.3} penumbra={0.2} />
          
          {/* Environment */}
          <Environment preset="night" />
          
          {/* Model */}
          <Model />
          
          {/* Controls */}
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI - Math.PI / 3}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HitmanModel
