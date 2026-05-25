import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth"
import { auth } from "../firebase"
import api from "../api/axios"

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  )
  const [loading, setLoading] = useState(true)

  const syncBackendUser = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken()
    localStorage.setItem("token", token)

    const res = await api.get("/auth/me")
    localStorage.setItem("user", JSON.stringify(res.data))
    setUser(res.data)
    return res.data
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setLoading(false)
        return
      }

      try {
        await syncBackendUser(firebaseUser)
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const register = async (name, email, password) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (name) {
      await updateProfile(credential.user, { displayName: name })
      await credential.user.getIdToken(true)
    }

    return syncBackendUser(credential.user)
  }

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return syncBackendUser(credential.user)
  }

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  // ✅ Added — gets fresh Firebase token for backend API calls
  const getToken = async () => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true)
      localStorage.setItem("token", token)
      return token
    }
    // Fallback to localStorage token
    return localStorage.getItem("token")
  }

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      localStorage.setItem("user", JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, getToken, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)