// types.ts

/** ตารางลูกค้า (customers) */
export interface Customer {
  id: number
  customer_name: string
  contact_name?: string
  phone?: string
  credit_term_days?: number
  vat_registered?: boolean
  // เพิ่มฟิลด์อื่น ๆ ตาม DB ถ้ามี
}


/** ตารางโครงการ (projects) */
export interface Project {
  id: number
  project_name: string
  customer_id?: number
  sale_name?: string
  pm_name?: string
  phase_total?: number
  start_date?: string
  end_date?: string
  description?: string
  created_at?: string
  updated_at?: string
  customers?: Customer | null
}

/** ตารางงวดการชำระเงิน (installments) */
export interface Installment {
  id: number
  project_id: number
  installment_no: number
  installment_total: number
  amount: number
  billing_date?: string
  expected_payment_date?: string
  actual_payment_date?: string
  status?: string
  note?: string
  created_at?: string
  updated_at?: string
  customers?: Customer | null
  projects?: Project | null
}

/** ตารางหลัก (invoice_records) */
export interface InvoiceRecord {
  id: number
  year?: number | null
  month?: string | null
  sale_name?: string | null
  pm_name?: string | null
  phase?: number | null
  project_name?: string | null
  amount?: number | string | null
  vat_percent?: number | null
  vat_amount?: number | null
  total_with_vat?: number | string | null
  wht_percent?: number | null
  wht_amount?: number | string | null
  net_amount?: number | string | null
  real_received?: number | string | null
  billing_cycle?: string | null
  billing_date?: string | null
  payment_cycle?: string | null
  payment_date?: string | null
  note?: string | null
  ref_doc?: string | null
  status?: string | null
  created_at?: string | null
  updated_at?: string | null

  // field from select('*, customers(...)')
  customers?: Customer | null
}

/** ตารางผู้ใช้ระบบ (users) */
export interface AppUser {
  id: string
  auth_uid?: string
  email: string
  display_name?: string
  role?: 'user' | 'admin' | 'manager'
  created_at?: string
}

// types.ts
export interface UserProfile {
  id: string
  email: string
  display_name?: string | null
  // เพิ่ม role ให้ชัดเจน (หรือใช้ union ของค่าที่ระบบใช้)
  role?: 'user' | 'manager' | 'admin' | string | null
  created_at?: string | null
  // ...อื่นๆตามจริง
}

/** ตารางแจ้งเตือน (notifications) */
// export interface Notification {
//   id?: number
//   invoice_id: number
//   user_id: string
//   message: string
//   due_date?: string
//   is_read?: boolean
//   created_at?: string
// }

export interface Notification {
  id: number
  message: string
  due_date?: string
  is_read: boolean
  created_at: string
  user_id: string
  invoice_id?: number
  invoice_records?: {
    id: number
    project_id: number
    billing_date: string
    payment_date: string
    status: string
  }
}
