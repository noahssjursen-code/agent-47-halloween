import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigate } from 'react-router-dom'

interface SignInModalProps {
  onClose: () => void
}

function SignInModal({ onClose }: SignInModalProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('Signed in:', userCredential.user.email)
      
      // Navigate to /admin on successful sign in
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-gradient-to-br from-black/90 via-red-900/20 to-black/90 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 border border-red-500/50 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-red-400 text-2xl font-mono font-bold mb-2">
            ADMIN SIGN IN
          </div>
          <div className="text-white text-sm font-mono">
            CLASSIFIED ACCESS ONLY
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-mono mb-2 block">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-2 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
              placeholder="admin@classified.com"
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-mono mb-2 block">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-red-500/30 rounded-lg px-4 py-2 text-white font-mono focus:border-red-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-mono px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white font-mono px-6 py-2 rounded-lg transition-all duration-200"
            >
              CANCEL
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs font-mono">
            ⚠️ UNAUTHORIZED ACCESS PROHIBITED ⚠️
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInModal

