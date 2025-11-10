// 📄 services/invoiceService.ts
import { supabase } from '../lib/supabaseClient'

// ดึงข้อมูลทั้งหมด (พร้อม join projects และ customers)
export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoice_records')
    .select(`
      *,
      projects (
        id,
        project_name
      ),
      customers (
        id,
        customer_name
      )
    `)
    .order('billing_date', { ascending: true })

  if (error) throw error
  return data || []
}

// ✅ ดึงข้อมูล invoice ตาม id
export async function getInvoiceById(id: number) {
  const { data, error } = await supabase
    .from('invoice_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// เพิ่มข้อมูล invoice ใหม่
export async function addInvoice(data: any) {
  const vat_percent = data.has_vat ? 7.0 : 0.0
  const vat_amount = (data.amount * vat_percent) / 100
  const wht_percent = 3.0
  const wht_amount = (data.amount * wht_percent) / 100
  const total_with_vat = data.amount + vat_amount
  const net_amount = total_with_vat - wht_amount

  let expected_collection_date = null
  if (data.billing_date && data.credit_term_days) {
    const billingDate = new Date(data.billing_date)
    billingDate.setDate(billingDate.getDate() + Number(data.credit_term_days))
    expected_collection_date = billingDate.toISOString().split('T')[0]
  }

  const insertData = {
    ...data,
    vat_percent,
    vat_amount,
    wht_percent,
    wht_amount,
    total_with_vat,
    net_amount,
    expected_collection_date,
    status: 'Pending',
  }

  const { error } = await supabase.from('invoice_records').insert([insertData])
  if (error) throw error
  return true
}

// ลบ invoice
export async function deleteInvoice(id: number) {
  const { error } = await supabase.from('invoice_records').delete().eq('id', id)
  if (error) throw error
}

// อัปเดตข้อมูล invoice
export async function updateInvoice(id: number, updates: any) {
  const { error } = await supabase.from('invoice_records').update(updates).eq('id', id)
  if (error) throw error
}
