import { useState, useEffect } from 'react'
import { auth, db, storage } from '../config/firebase'
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

function AdminPage() {
  const navigate = useNavigate()
  const [alcoholConsumed, setAlcoholConsumed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<any[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)

  useEffect(() => {
    // Check if user is signed in
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/')
      } else {
        loadAlcoholCount()
        loadPhotos()
      }
    })
  }, [navigate])

  const loadPhotos = async () => {
    setPhotosLoading(true)
    try {
      const photosRef = collection(db, 'photos')
      const q = query(photosRef, orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const photosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setPhotos(photosData)
    } catch (error) {
      console.error('Error loading photos:', error)
      setError('Failed to load photos')
    } finally {
      setPhotosLoading(false)
    }
  }

  const deleteSelectedPhotos = async () => {
    if (selectedPhotos.length === 0) return
    if (!confirm(`Delete ${selectedPhotos.length} photo(s)?`)) return

    setPhotosLoading(true)
    try {
      for (const photoId of selectedPhotos) {
        const photo = photos.find(p => p.id === photoId)
        if (photo) {
          // Delete from Storage
          const storageRef = ref(storage, photo.url)
          await deleteObject(storageRef)
          
          // Delete from Firestore
          await deleteDoc(doc(db, 'photos', photoId))
        }
      }
      
      setSelectedPhotos([])
      loadPhotos()
      setError('')
    } catch (err: any) {
      setError(err.message || 'Failed to delete photos')
    } finally {
      setPhotosLoading(false)
    }
  }

  const deleteAllPhotos = async () => {
    if (photos.length === 0) return
    if (!confirm(`Delete ALL ${photos.length} photos? This cannot be undone!`)) return

    setPhotosLoading(true)
    try {
      for (const photo of photos) {
        // Delete from Storage
        const storageRef = ref(storage, photo.url)
        await deleteObject(storageRef)
        
        // Delete from Firestore
        await deleteDoc(doc(db, 'photos', photo.id))
      }
      
      setPhotos([])
      setSelectedPhotos([])
      setError('')
    } catch (err: any) {
      setError(err.message || 'Failed to delete all photos')
    } finally {
      setPhotosLoading(false)
    }
  }

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const loadAlcoholCount = async () => {
    try {
      const docRef = doc(db, 'agent', 'status')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setAlcoholConsumed(data.alcoholConsumed || 0)
      } else {
        // Create document if it doesn't exist
        await setDoc(docRef, {
          alcoholConsumed: 0,
          drinks: [],
          lastUpdated: new Date().toISOString()
        })
        setAlcoholConsumed(0)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const updateAlcoholCount = async (newCount: number) => {
    try {
      const now = new Date()
      const drinkEntry = {
        timestamp: now.toISOString(),
        drinkType: '0.4L Beer 4%',
        volume: 0.4,
        alcoholContent: 4,
        alcoholGrams: 12.8 // 0.4L * 4% * 0.8 density * 1000ml/L
      }
      
      setAlcoholConsumed(newCount)
      
      if (newCount > alcoholConsumed) {
        // Adding drinks - append to drinks array
        const docRef = doc(db, 'agent', 'status')
        const docSnap = await getDoc(docRef)
        const currentDrinks = docSnap.data()?.drinks || []
        
        await updateDoc(docRef, {
          alcoholConsumed: newCount,
          drinks: [...currentDrinks, drinkEntry],
          lastUpdated: now.toISOString()
        })
      } else {
        // Removing drinks - update count only
        await updateDoc(doc(db, 'agent', 'status'), {
          alcoholConsumed: newCount,
          lastUpdated: now.toISOString()
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update')
      setAlcoholConsumed(alcoholConsumed) // Revert on error
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign out')
    }
  }

  const getStatus = () => {
    if (alcoholConsumed === 0) return { text: 'SOBER', color: 'text-green-400' }
    if (alcoholConsumed <= 3) return { text: 'TIPSY', color: 'text-yellow-400' }
    if (alcoholConsumed <= 6) return { text: 'BUZZED', color: 'text-orange-400' }
    return { text: 'WASTED', color: 'text-red-400' }
  }

  const calculateBAC = () => {
    // BAC calculation: 0.4L beer = ~12.8g alcohol
    // 77kg body weight, 21 years old male
    const alcoholGrams = alcoholConsumed * 12.8
    const bodyWeight = 77 // kg
    const bac = (alcoholGrams / (bodyWeight * 1000)) * 100 // Convert to percentage
    return Math.max(0, bac - 0.015) // Subtract ~0.015% per hour (simplified)
  }

  const status = getStatus()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono">LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-red-900/5"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent tracking-wider font-mono">
            ADMIN CONTROL PANEL
          </h1>
          <p className="text-gray-400 text-sm font-mono">Agent 47 Mission Control</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 max-w-md w-full">
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-gradient-to-br from-black/60 via-black/80 to-black/60 backdrop-blur-md rounded-xl p-8 border border-red-500/40 shadow-2xl max-w-md w-full">
          
          {/* Alcohol Counter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-400 text-lg font-mono font-bold">ALCOHOL CONSUMPTION</h3>
              <div className={`text-2xl font-mono font-bold ${status.color}`}>{status.text}</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4 border border-red-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-mono">DRINKS</span>
                <span className="text-yellow-400 text-xl font-mono font-bold">{alcoholConsumed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-mono">BAC ESTIMATE</span>
                <span className="text-yellow-400 text-lg font-mono font-bold">{calculateBAC().toFixed(3)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm font-mono">ALCOHOL VOLUME</span>
                <span className="text-yellow-400 text-lg font-mono font-bold">{(alcoholConsumed * 0.4).toFixed(1)}L</span>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => updateAlcoholCount(alcoholConsumed + 1)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-mono px-6 py-3 rounded-lg transition-all duration-200"
            >
              +1 DRINK
            </button>
            <button
              onClick={() => updateAlcoholCount(Math.max(0, alcoholConsumed - 1))}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-mono px-6 py-3 rounded-lg transition-all duration-200"
            >
              -1 DRINK
            </button>
            <button
              onClick={() => updateAlcoholCount(0)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-mono px-6 py-3 rounded-lg transition-all duration-200"
            >
              RESET TO 0
            </button>
          </div>
        </div>

        {/* Photo Management Section */}
        <div className="bg-gradient-to-br from-black/60 via-black/80 to-black/60 backdrop-blur-md rounded-xl p-8 border border-red-500/40 shadow-2xl max-w-4xl w-full mt-8">
          <h3 className="text-red-400 text-lg font-mono font-bold mb-4 text-center">PHOTO MANAGEMENT ({photos.length})</h3>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={deleteSelectedPhotos}
              disabled={selectedPhotos.length === 0 || photosLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-mono px-4 py-2 rounded-lg transition-all duration-200"
            >
              DELETE SELECTED ({selectedPhotos.length})
            </button>
            <button
              onClick={deleteAllPhotos}
              disabled={photos.length === 0 || photosLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-mono px-4 py-2 rounded-lg transition-all duration-200"
            >
              DELETE ALL
            </button>
          </div>

          {/* Photos Grid */}
          {photosLoading ? (
            <div className="text-center py-8 text-gray-400 font-mono">Loading photos...</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-mono">No photos uploaded yet</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedPhotos.includes(photo.id)
                      ? 'border-red-500 shadow-lg shadow-red-500/50'
                      : 'border-gray-700 hover:border-red-500/50'
                  }`}
                  onClick={() => togglePhotoSelection(photo.id)}
                >
                  <img
                    src={photo.url}
                    alt={`By ${photo.uploaderName}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <input
                      type="checkbox"
                      checked={selectedPhotos.includes(photo.id)}
                      onChange={() => togglePhotoSelection(photo.id)}
                      className="w-5 h-5 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="bg-black/80 p-2">
                    <div className="text-white text-xs font-mono truncate">{photo.uploaderName}</div>
                    <div className="text-gray-400 text-xs font-mono">{new Date(photo.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="text-gray-500 text-sm font-mono hover:text-red-400 transition-colors duration-200"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPage

