// services/userService.ts
import { supabase } from '../lib/supabaseClient'
import { UserProfile } from '../types'

// ✅ ดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง users
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as UserProfile[]
}

// ✅ เพิ่มผู้ใช้ใหม่ (ปกติระบบจะ upsert อัตโนมัติหลัง login ผ่าน Auth)
export async function addUser(data: Omit<UserProfile, 'id'>) {
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([data])
    .select()
  if (error) throw error
  return newUser[0]
}

// ✅ อัปเดตข้อมูลผู้ใช้ (เปลี่ยน role / ชื่อ)
export async function updateUser(id: string, data: Partial<UserProfile>) {
  const { data: updated, error } = await supabase
    .from('users')
    .update(data)
    .eq('id', id)
    .select()
  if (error) throw error
  return updated[0]
}

// ✅ ลบผู้ใช้
export async function deleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}
