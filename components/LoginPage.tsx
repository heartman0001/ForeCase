import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
// import { useAuth } from '@/context/AuthContext'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const { signInWithGoogle } = useAuth()

  // ✅ เพิ่มตรงนี้ — Login ด้วย Google
  // async function handleGoogleLogin() {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //   })
  //   if (error) alert(error.message)
  // }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
    {/* Logo */}
    <div className="flex justify-center mb-6">
      <img
        src="https://www.wewebplus.com/img/static/wewebplus.svg"
        alt="Logo"
        className="h-12"
      />
    </div>

    {/* Title */}
    <h1 className="text-2xl font-bold mb-6 text-center text-[#2826a9]">
      เข้าสู่ระบบ
    </h1>

    {/* Form */}
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          อีเมล
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2b71ed]"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          รหัสผ่าน
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2b71ed]"
          required
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#2b71ed] text-white py-2 rounded-lg hover:bg-[#2826a9] transition"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>

    {/* Google Login */}
    <button
      onClick={signInWithGoogle}
      className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        className="h-5 w-5"
      />
      <span>Sign in with Google</span>
    </button>

    {/* Register */}
    <p className="text-center text-sm mt-6 text-gray-600">
      ยังไม่มีบัญชี?{" "}
      <button
        onClick={() => navigate("/register")}
        className="text-[#2b71ed] hover:underline font-medium"
      >
        สมัครสมาชิก
      </button>
    </p>
  </div>
</div>

  )
}
