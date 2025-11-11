/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // เพิ่มตัวแปรสภาพแวดล้อมอื่นๆ ที่คุณใช้ในโปรเจกต์ที่นี่
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
