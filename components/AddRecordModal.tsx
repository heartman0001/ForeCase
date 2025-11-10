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
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">เพิ่มรายการ Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Project</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">-- เลือกโครงการ --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium">Amount (บาท)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Has VAT?</label>
              <input
                type="checkbox"
                name="has_vat"
                checked={formData.has_vat}
                onChange={handleChange}
                className="ml-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Billing Date</label>
            <input
              type="date"
              name="billing_date"
              value={formData.billing_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Credit Term (Days)</label>
            <input
              type="number"
              name="credit_term_days"
              value={formData.credit_term_days}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
