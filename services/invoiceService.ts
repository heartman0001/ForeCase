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

export async function addInvoice(data: any) {
  // ✅ 1. ดึง credit_term_days ของลูกค้า
  let credit_term_days = 0
  if (data.customer_id) {
    const { data: customer } = await supabase
      .from('customers')
      .select('credit_term_days')
      .eq('id', data.customer_id)
      .single()

    credit_term_days = customer?.credit_term_days || 0
  }

  // ✅ 2. คำนวณ VAT / WHT / NET
  const vat_percent = data.vat_percent ? parseFloat(data.vat_percent) : 0
  const amount = parseFloat(data.amount || 0)
  const vat_amount = (amount * vat_percent) / 100
  const wht_percent = parseFloat(data.wht_percent || 3.0)
  const wht_amount = (amount * wht_percent) / 100
  const total_with_vat = amount + vat_amount
  const net_amount = total_with_vat - wht_amount

  // ✅ 3. คำนวณ expected_collection_date (จาก credit_term_days ของลูกค้า)
  let expected_collection_date = null
  if (data.billing_date && credit_term_days) {
    const billingDate = new Date(data.billing_date)
    billingDate.setDate(billingDate.getDate() + Number(credit_term_days))
    expected_collection_date = billingDate.toISOString().split('T')[0]
  }

  // ✅ 4. สร้างอ็อบเจกต์ที่จะ insert ลง invoice_records
  //     (ตัดฟิลด์ที่ไม่เกี่ยวกับตารางออก เช่น installment_no, installment_total)
  const {
    installment_no,
    installment_total,
    ...invoiceData
  } = data

  const insertData = {
    ...invoiceData,
    vat_percent,
    vat_amount,
    wht_percent,
    wht_amount,
    total_with_vat,
    net_amount,
    expected_collection_date,
    status: data.status || 'Pending',
  }

  // ✅ 5. เพิ่มข้อมูลในตาราง invoice_records
  const { data: insertedInvoice, error } = await supabase
    .from('invoice_records')
    .insert([insertData])
    .select()
    .single()

  if (error) throw error

  // ✅ 6. ถ้ามีข้อมูลงวด → บันทึกหรืออัปเดตตาราง installments ด้วย
  if (installment_no) {
    const { error: instError } = await supabase
      .from('installments')
      .upsert({
        project_id: insertedInvoice.project_id,
        installment_no,
        installment_total: installment_total || 1,
        amount,
        // due_date: insertedInvoice.billing_date,
        status: 'billed',
      })

    if (instError) throw instError
  }

  return true
}


// เพิ่มข้อมูล invoice ใหม่
// export async function addInvoice(data: any) {
//   const vat_percent = data.has_vat ? 7.0 : 0.0
//   const vat_amount = (data.amount * vat_percent) / 100
//   const wht_percent = 3.0
//   const wht_amount = (data.amount * wht_percent) / 100
//   const total_with_vat = data.amount + vat_amount
//   const net_amount = total_with_vat - wht_amount

//   let expected_collection_date = null
//   if (data.billing_date && data.credit_term_days) {
//     const billingDate = new Date(data.billing_date)
//     billingDate.setDate(billingDate.getDate() + Number(data.credit_term_days))
//     expected_collection_date = billingDate.toISOString().split('T')[0]
//   }

//   const insertData = {
//     ...data,
//     vat_percent,
//     vat_amount,
//     wht_percent,
//     wht_amount,
//     total_with_vat,
//     net_amount,
//     expected_collection_date,
//     status: 'Pending',
//   }

//   const { error } = await supabase.from('invoice_records').insert([insertData])
//   if (error) throw error
//   return true
// }
// ✅ เพิ่มข้อมูล invoice ใหม่ (ให้ค่ามาจาก Modal โดยตรง)
// export async function addInvoice(data: any) {
//   const insertData = {
//     ...data,
//     status: data.status || 'Pending',
//   }

//   const { error } = await supabase.from('invoice_records').insert([insertData])
//   if (error) throw error
//   return true
// }

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
