// 📄 components/AddRecordModal.tsx
import React, { useState, useEffect } from 'react'
import { addInvoice } from '../services/invoiceService'
import { supabase } from '../lib/supabaseClient'

interface AddRecordModalProps {
  isOpen: boolean
  onClose: () => void
  onAdded: () => void // callback ให้ refresh หน้า Dashboard
}

export default function AddRecordModal({ isOpen, onClose, onAdded }: AddRecordModalProps) {
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
    has_vat: true,
    billing_date: '',
    payment_date: '',
    credit_term_days: 30,
    note: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) loadProjects()
  }, [isOpen])

  async function loadProjects() {
    const { data, error } = await supabase.from('projects').select('id, project_name, customer_id')
    if (!error) setProjects(data)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const project = projects.find((p) => p.id == formData.project_id)
      const customer_id = project?.customer_id || null
      await addInvoice({ ...formData, customer_id })
      alert('✅ เพิ่มข้อมูลสำเร็จ')
      onAdded()
      onClose()
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl p-8 w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
    <h2 className="text-2xl font-bold mb-6 text-center text-[#2826a9]">
      เพิ่มรายการ Invoice
    </h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Project Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
          />
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
  {/* VAT & Total */}
  <div className="grid grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium">VAT Amount</label>
      <input
        type="number"
        name="vat_amount"
        value={formData.vat_amount ?? ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
    <div>
      <label className="block text-sm font-medium">Total with VAT</label>
      <input
        type="number"
        name="total_with_vat"
        value={formData.total_with_vat ?? ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
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
        value={formData.wht_amount ?? ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
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
        value={formData.net_amount ?? ""}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
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
        <option value="draft">Draft</option>
        <option value="billed">Billed</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
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
      value={formData.customers?.id ?? ""}
      onChange={handleChange}
      className="w-full border rounded-lg px-3 py-2"
    >
      <option value="">-- Select Customer --</option>
      {/* map customers from DB */}
    </select>
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
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>
    </form>
  </div>
</div>

  )
}
