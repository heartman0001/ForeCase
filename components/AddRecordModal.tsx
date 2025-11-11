// 📄 components/AddRecordModal.tsx
import React, { useState, useEffect } from 'react'
import { addInvoice, getInvoiceById, updateInvoice } from '../services/invoiceService'
import { supabase } from '../lib/supabaseClient'

interface AddRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onAdded: () => void
  invoiceId?: number | null
    onSubmit?: (data: any) => void 

}

export default function AddRecordModal({ isOpen, onClose, onAdded, invoiceId }: AddRecordModalProps) {
  const [projects, setProjects] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({
    project_id: '',
    customer_id: '',
    year: new Date().getFullYear(),
    month: (new Date().getMonth() + 1).toString(),
    phase: 1,
    installment_no: 1,
    installment_total: 1,
    amount: '',
    vat_percent: 7.0,
    vat_amount: 0,
    wht_percent: 3.0,
    wht_amount: 0,
    total_with_vat: 0,
    net_amount: 0,
    billing_date: '',
    payment_date: '',
    note: '',
    ref_doc: '',
    status: 'Pending'
  })
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      loadProjects()
      loadCustomers()
      if (invoiceId) {
        loadInvoice(invoiceId)
      } else {
        // รีเซ็ตฟอร์มสำหรับเพิ่มใหม่
        setFormData({
          project_id: '',
          customer_id: '',
          year: new Date().getFullYear(),
          month: (new Date().getMonth() + 1).toString(),
          phase: 1,
          installment_no: 1,
          installment_total: 1,
          amount: '',
          vat_percent: 7.0,
          vat_amount: 0,
          wht_percent: 3.0,
          wht_amount: 0,
          total_with_vat: 0,
          net_amount: 0,
          billing_date: '',
          payment_date: '',
          note: '',
          ref_doc: '',
          status: 'Pending'
        })
      }
    }
  }, [isOpen, invoiceId])

  async function loadCustomers() {
    const { data, error } = await supabase.from('customers').select('id, customer_name, credit_term_days')
    if (!error) setCustomers(data)
  }
  async function loadProjects() {
    const { data, error } = await supabase.from('projects').select('id, project_name, customer_id')
    if (!error) setProjects(data)
  }

  async function loadInvoice(id: number) {
    try {
      const inv = await getInvoiceById(id)
      if (!inv) return
      setFormData({
        project_id: inv.project_id ?? '',
        customer_id: inv.customer_id ?? '',
        year: inv.year ?? new Date().getFullYear(),
        month: inv.month ?? (new Date().getMonth() + 1).toString(),
        phase: inv.phase ?? 1,
        installment_no: inv.installment_no ?? 1,
        installment_total: inv.installment_total ?? 1,
        amount: inv.amount != null ? String(inv.amount) : '',
        vat_percent: inv.vat_percent != null ? Number(inv.vat_percent) : 7.0,
        vat_amount: inv.vat_amount != null ? Number(inv.vat_amount) : 0,
        wht_percent: inv.wht_percent != null ? Number(inv.wht_percent) : 3.0,
        wht_amount: inv.wht_amount != null ? Number(inv.wht_amount) : 0,
        total_with_vat: inv.total_with_vat != null ? Number(inv.total_with_vat) : 0,
        net_amount: inv.net_amount != null ? Number(inv.net_amount) : 0,
        billing_date: inv.billing_date ?? '',
        payment_date: inv.payment_date ?? '',
        note: inv.note ?? '',
        ref_doc: inv.ref_doc ?? '',
        sale_name: inv.sale_name ?? '',
        pm_name: inv.pm_name ?? '',
        real_received: inv.real_received ?? '',
        status: inv.status ?? 'Pending'
      })
    } catch (err) {
      console.error('Failed load invoice:', err)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target

    if (name === "project_id") {
      const selectedProject = projects.find((p) => p.id == value)
      setFormData((prev: any) => ({
        ...prev,
        project_id: value,
        customer_id: selectedProject ? selectedProject.customer_id : "",
      }))
      return
    }

    // normalize numeric inputs
    if (['amount', 'vat_percent', 'wht_percent', 'phase', 'installment_no', 'installment_total'].includes(name)) {
      setFormData((prev: any) => ({ ...prev, [name]: value === '' ? '' : Number(value) }))
      return
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  // real-time calculations: recalc when amount / vat_percent / wht_percent change
  useEffect(() => {
    const amount = parseFloat(String(formData.amount || 0)) || 0
    const vatPercent = parseFloat(String(formData.vat_percent || 0)) || 0
    const whtPercent = parseFloat(String(formData.wht_percent || 0)) || 0

    const vat_amount = parseFloat((amount * vatPercent / 100).toFixed(2))
    const wht_amount = parseFloat((amount * whtPercent / 100).toFixed(2))
    const total_with_vat = parseFloat((amount + vat_amount).toFixed(2))
    const net_amount = parseFloat((total_with_vat - wht_amount).toFixed(2))

    setFormData((prev: any) => ({
      ...prev,
      vat_amount,
      wht_amount,
      total_with_vat,
      net_amount
    }))
  }, [formData.amount, formData.vat_percent, formData.wht_percent])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      // ensure customer_id matches project if possible
      const project = projects.find((p) => p.id == formData.project_id)
      const customer_id = project?.customer_id || formData.customer_id || null

      const payload: any = {
        project_id: formData.project_id || null,
        customer_id,
        year: formData.year,
        month: formData.month,
        phase: formData.phase,
        sale_name: formData.sale_name || '',
        pm_name: formData.pm_name || '',
        amount: Number(formData.amount || 0),
        vat_percent: Number(formData.vat_percent || 0),
        vat_amount: Number(formData.vat_amount || 0),
        total_with_vat: Number(formData.total_with_vat || 0),
        wht_percent: Number(formData.wht_percent || 0),
        wht_amount: Number(formData.wht_amount || 0),
        net_amount: Number(formData.net_amount || 0),
        real_received: Number(formData.real_received || 0),
        billing_cycle: formData.billing_cycle || '',
        billing_date: formData.billing_date || null,
        payment_cycle: formData.payment_cycle || '',
        payment_date: formData.payment_date || null,
        note: formData.note || '',
        ref_doc: formData.ref_doc || '',
        status: formData.status || 'Pending',
      }

      if (invoiceId) {
        // update existing invoice
        await updateInvoice(invoiceId, payload)
        alert('✅ อัปเดตข้อมูลเรียบร้อย')
        onAdded()
        onClose()
      } else {
        // add new invoice
        await addInvoice({ ...formData, ...payload })
        alert('✅ เพิ่มข้อมูลสำเร็จ')
        onAdded()
        onClose()
      }
    } catch (err: any) {
      alert(`❌ Error: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2826a9]">
          {invoiceId ? 'แก้ไข Invoice' : 'เพิ่มรายการ Invoice'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
                required
              >
                <option value="">-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phase</label>
              <input
                type="number"
                name="phase"
                value={formData.phase ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
              />
            </div>
          </div>

          {/* Sale & PM */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Name</label>
              <input
                type="text"
                name="sale_name"
                value={formData.sale_name ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">PM Name</label>
              <input
                type="text"
                name="pm_name"
                value={formData.pm_name ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
              />
            </div>
          </div>

          {/* Financial */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (บาท)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">VAT (%)</label>
              <input
                type="number"
                name="vat_percent"
                value={formData.vat_percent ?? ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* VAT & Total (แสดงผลแบบอ่านอย่างเดียว แต่มาจากคำนวณ realtime) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">VAT Amount</label>
                <input
                  type="number"
                  name="vat_amount"
                  value={formData.vat_amount ?? 0}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Total with VAT</label>
                <input
                  type="number"
                  name="total_with_vat"
                  value={formData.total_with_vat ?? 0}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
            </div>

            {/* WHT */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">WHT (%)</label>
                <input
                  type="number"
                  name="wht_percent"
                  value={formData.wht_percent ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WHT Amount</label>
                <input
                  type="number"
                  name="wht_amount"
                  value={formData.wht_amount ?? 0}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
            </div>

            {/* Net & Real Received */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Net Amount</label>
                <input
                  type="number"
                  name="net_amount"
                  value={formData.net_amount ?? 0}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Real Received (บาท)</label>
                <input
                  type="number"
                  name="real_received"
                  value={formData.real_received ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Billing & Payment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Billing Date</label>
                <input
                  type="date"
                  name="billing_date"
                  value={formData.billing_date ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Payment Date</label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Reference & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Reference Document</label>
                <input
                  type="text"
                  name="ref_doc"
                  value={formData.ref_doc ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status ?? ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Select Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Draft">Draft</option>
                  <option value="Billed">Billed</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium">Note</label>
              <textarea
                name="note"
                value={formData.note ?? ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              ></textarea>
            </div>

            {/* Customer */}
            <div>
              <label className="block text-sm font-medium">Customer</label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled
              >
                <option value="">-- Select Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customer_name}
                  </option>
                ))}
              </select>

              {formData.customer_id && (
                <p className="text-sm text-gray-600 mt-1">
                  ลูกค้า: {
                    customers.find((c) => c.id == formData.customer_id)?.customer_name ??
                    "(ไม่พบข้อมูล)"
                  }
                </p>
              )}
            </div>

          </div>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[#2b71ed] text-white hover:bg-[#2826a9] transition"
            >
              {loading ? "กำลังบันทึก..." : (invoiceId ? "บันทึกการแก้ไข" : "บันทึกข้อมูล")}
            </button>
          </div>
        </form>
      </div>
    </div>

  )
}
