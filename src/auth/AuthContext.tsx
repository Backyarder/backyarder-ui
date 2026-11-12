import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { getMe, login as apiLogin, logout as apiLogout, signup as apiSignup, updateMe as apiUpdateMe, User, ApiError } from '../apiCalls'

type AuthState = {
  user: User | null
  loading: boolean          // true until the first /auth/me answer
  login: (email: string, password: string) => Promise<User>
  signup: (email: string, password: string, zipCode?: string) => Promise<User>
  logout: () => Promise<void>
  updateMe: (changes: { zip_code?: string }) => Promise<User>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  // A 401 from any call means the session ended (expired, or logged out in
  // another tab); drop the user so RequireAuth sends them to the login page.
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener('backyarder:unauthorized', onUnauthorized)
    return () => window.removeEventListener('backyarder:unauthorized', onUnauthorized)
  }, [])

  const login = useCallback((email: string, password: string) => apiLogin(email, password).then(u => { setUser(u); return u }), [])
  const signup = useCallback((email: string, password: string, zipCode?: string) => apiSignup(email, password, zipCode).then(u => { setUser(u); return u }), [])
  // Optimistic: the user is signed out locally at once (RequireAuth redirects
  // immediately), while the server call finishes in the background. It can
  // take a while when the free-tier backend has to wake up, and it rejects
  // if the server could not be reached so the caller can say so.
  const logout = useCallback(() => {
    setUser(null)
    return apiLogout().then(() => undefined)
  }, [])
  const updateMe = useCallback((changes: { zip_code?: string }) => apiUpdateMe(changes).then(u => { setUser(u); return u }), [])

  const value = useMemo(() => ({ user, loading, login, signup, logout, updateMe }), [user, loading, login, signup, logout, updateMe])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export const isUnauthorized = (err: unknown): boolean => err instanceof ApiError && err.status === 401
