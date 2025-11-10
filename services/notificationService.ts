// services/notificationService.ts
import { supabase } from '../lib/supabaseClient'
import { Notification } from '../types'

// ✅ ดึงการแจ้งเตือนทั้งหมด (หรือเฉพาะของ user)
export async function getNotifications(userId?: string) {
  let query = supabase
    .from('notifications')
    .select(
      `
      id,
      message,
      due_date,
      is_read,
      created_at,
      invoice_id,
      invoice_records (id, project_id, billing_date, payment_date, status)
    `
    )
    .order('due_date', { ascending: true })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Notification[]
}

// ✅ เพิ่มการแจ้งเตือนใหม่
export async function addNotification(data: Omit<Notification, 'id' | 'created_at'>) {
  const { data: newNotif, error } = await supabase
    .from('notifications')
    .insert([data])
    .select()
  if (error) throw error
  return newNotif[0]
}

// ✅ อัปเดตสถานะเป็น “อ่านแล้ว”
export async function markAsRead(id: number) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

// ✅ ลบการแจ้งเตือน
export async function deleteNotification(id: number) {
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) throw error
}
