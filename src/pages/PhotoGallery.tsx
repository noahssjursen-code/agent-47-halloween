import { useState, useEffect } from 'react'
import { db, storage } from '../config/firebase'
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'

function PhotoGallery() {
  const navigate = useNavigate()
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploaderName, setUploaderName] = useState('')

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
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
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploaderName.trim()) return

    setUploading(true)
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `photos/${Date.now()}_${selectedFile.name}`)
      const snapshot = await uploadBytes(storageRef, selectedFile)
      const downloadURL = await getDownloadURL(snapshot.ref)

      // Save photo metadata to Firestore
      await addDoc(collection(db, 'photos'), {
        url: downloadURL,
        uploaderName: uploaderName.trim(),
        timestamp: new Date().toISOString(),
        fileName: selectedFile.name
      })

      // Reset form and reload photos
      setSelectedFile(null)
      setUploaderName('')
      setUploading(false)
      loadPhotos()
      
      alert('Photo uploaded successfully!')
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Failed to upload photo. Please try again.')
      setUploading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl font-mono">LOADING PHOTO GALLERY...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-red-900/5"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent tracking-wider font-mono">
            MISSION GALLERY
          </h1>
          <p className="text-gray-400 text-sm font-mono mb-4">Agent 47 Photo Evidence</p>
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 text-sm font-mono hover:text-red-400 transition-colors duration-200"
          >
            ← BACK TO DOSSIER
          </button>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-black/60 via-black/80 to-black/60 backdrop-blur-md rounded-xl p-6 border border-red-500/40 shadow-2xl">
            <h3 className="text-red-400 text-lg font-mono font-bold mb-4 text-center">
              📸 SUBMIT PHOTO EVIDENCE
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-mono mb-2 block">
                  YOUR NAME/ALIAS
                </label>
                <input
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-2 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Enter your name..."
                  maxLength={50}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-mono mb-2 block">
                  SELECT PHOTO
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-2 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              {selectedFile && (
                <div className="text-gray-300 text-sm font-mono">
                  Selected: {selectedFile.name}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || !uploaderName.trim() || uploading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-mono px-6 py-3 rounded-lg transition-all duration-200"
              >
                {uploading ? 'UPLOADING...' : 'UPLOAD PHOTO'}
              </button>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-red-400 text-xl font-mono font-bold mb-6 text-center">
            MISSION EVIDENCE ({photos.length} PHOTOS)
          </h3>
          
          {photos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg font-mono mb-4">
                No photos uploaded yet
              </div>
              <div className="text-gray-600 text-sm font-mono">
                Be the first to submit evidence!
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-gradient-to-br from-black/60 via-black/80 to-black/60 backdrop-blur-md rounded-xl p-4 border border-red-500/40 shadow-2xl">
                  <img
                    src={photo.url}
                    alt={`Photo by ${photo.uploaderName}`}
                    className="w-full h-auto object-contain rounded-lg mb-3"
                  />
                  <div className="text-center">
                    <div className="text-red-400 text-sm font-mono font-bold mb-1">
                      {photo.uploaderName}
                    </div>
                    <div className="text-gray-500 text-xs font-mono">
                      {formatTimestamp(photo.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PhotoGallery
