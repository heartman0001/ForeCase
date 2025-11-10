// services/customerService.ts
import { supabase } from '../lib/supabaseClient'
import { Customer } from '../types'

// ✅ ดึงข้อมูลลูกค้าทั้งหมด
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Customer[]
}

// ✅ เพิ่มลูกค้าใหม่
export async function addCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('customers').insert([customer]).select()
  if (error) throw error
  return data[0]
}

// ✅ แก้ไขข้อมูลลูกค้า
export async function updateCustomer(id: number, customer: Partial<Customer>) {
  const { data, error } = await supabase.from('customers').update(customer).eq('id', id).select()
  if (error) throw error
  return data[0]
}

// ✅ ลบลูกค้า
export async function deleteCustomer(id: number) {
  const { error } = await supabase.from('customers').delete().eq('id', id)
  if (error) throw error
}
