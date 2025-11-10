// services/projectService.ts
import { supabase } from '../lib/supabaseClient'
import { Project } from '../types'

// ✅ ดึงข้อมูลโครงการทั้งหมด (พร้อมข้อมูลลูกค้า)
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, customers(id, customer_name)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Project[]
}

// ✅ เพิ่มโครงการใหม่
export async function addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('projects').insert([project]).select()
  if (error) throw error
  return data[0]
}

// ✅ แก้ไขโครงการ
export async function updateProject(id: number, data: Partial<Project>) {
  const { error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)

  if (error) throw error
}

// ✅ ลบโครงการ
export async function deleteProject(id: number) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
