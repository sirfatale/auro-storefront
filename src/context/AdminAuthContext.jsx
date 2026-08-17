import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [aal, setAal] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshAal = useCallback(async () => {
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (error) {
      setAal(null)
      return
    }
    setAal(data)
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      if (session) await refreshAal()
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      setSession(session)
      if (session) {
        await refreshAal()
      } else {
        setAal(null)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [refreshAal])

  // MFA is required: only aal2 counts as fully authenticated. A signed-in
  // user who hasn't enrolled a factor yet, or hasn't passed the challenge
  // this session, is NOT considered admin.
  const isFullyAuthenticated = !!session && aal?.currentLevel === 'aal2'
  const needsEnrollment = !!session && aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal1'
  const needsChallenge = !!session && aal?.currentLevel === 'aal1' && aal?.nextLevel === 'aal2'

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AdminAuthContext.Provider
      value={{
        session,
        loading,
        isFullyAuthenticated,
        needsEnrollment,
        needsChallenge,
        refreshAal,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
