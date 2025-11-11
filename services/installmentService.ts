import { supabase } from '../lib/supabaseClient'
import { Installment } from '../types'

// ✅ ดึงข้อมูลทั้งหมด (พร้อมข้อมูลโครงการ)
export async function getInstallments() {
  const { data, error } = await supabase
    .from('installments')
    .select('*, projects(id, project_name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Installment[]
}

// ✅ เพิ่มข้อมูลใหม่
export async function addInstallment(data: Omit<Installment, 'id' | 'created_at' | 'updated_at'>) {
  const { data: newData, error } = await supabase.from('installments').insert([data]).select()
  if (error) throw error
  return newData[0]
}

// ✅ แก้ไขข้อมูล
export async function updateInstallment(id: number, data: Partial<Installment>) {
  const { data: updated, error } = await supabase
    .from('installments')
    .update(data)
    .eq('id', id)
    .select('*') // เปลี่ยนจาก .select('*, projects(id, project_name)') เป็น .select('*')
  if (error) throw error
  return updated[0]
}

// ✅ ลบข้อมูล
export async function deleteInstallment(id: number) {
  const { error } = await supabase.from('installments').delete().eq('id', id)
  if (error) throw error
}