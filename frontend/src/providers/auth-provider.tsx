import { AuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {
  const [claims, setClaims] = useState<Record<string, any> | undefined | null>()
  const [profile, setProfile] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session)
      setClaims(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event)
      setClaims(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch profile when claims change
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      if (claims) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', (claims as any).id)
          .single()
        setProfile(data)
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [claims])

  return (
    <AuthContext.Provider
      value={{
        claims,
        isLoading,
        profile,
        isLoggedIn: claims != null && claims != undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
