import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // ✅ ดึง session ปัจจุบัน
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data?.session?.user ?? null)
      setLoading(false)
    }
    getSession()

    // ✅ ฟัง event login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // ✅ Sync user ลงตาราง users
  useEffect(() => {
    if (user) {
      supabase.from('users').upsert({
        auth_uid: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name ?? '',
      })
    }
  }, [user])

  // ✅ Login ด้วย Google พร้อม redirect กลับ Dashboard
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // สำคัญมาก!
      },
    })
  }

  // ✅ Logout
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
