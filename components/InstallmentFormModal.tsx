// components/InstallmentFormModal.tsx
import React, { useEffect, useState } from 'react'
import { Installment, Project } from '../types'
import { getProjects } from '../services/projectService'

interface InstallmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Installment, 'id'>) => Promise<void>
  initialData?: Installment | null
}

export default function InstallmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: InstallmentFormModalProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [formData, setFormData] = useState<Omit<Installment, 'id'>>({
    project_id: 0,
    installment_no: 1,
    installment_total: 1,
    amount: 0,
    billing_date: '',
    expected_payment_date: '',
    actual_payment_date: '',
    status: 'Pending',
    note: '',
  })

  useEffect(() => {
    loadProjects()
    if (initialData) setFormData(initialData)
  }, [initialData])

  async function loadProjects() {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Error loading projects:', err)
    }
  }

  if (!isOpen) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // สร้าง payload เฉพาะฟิลด์ที่ schema รับ ไม่ส่ง projects
    const payload = {
      project_id: Number(formData.project_id),
      installment_no: Number(formData.installment_no),
      installment_total: Number(formData.installment_total),
      amount: Number(formData.amount),
      billing_date: formData.billing_date || '',
      expected_payment_date: formData.expected_payment_date || '',
      actual_payment_date: formData.actual_payment_date || '',
      status: formData.status || 'Pending',
      note: formData.note || '',
    }
    await onSubmit(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'แก้ไขงวดการชำระเงิน' : 'เพิ่มงวดการชำระเงิน'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>     <label htmlFor="">ระบุว่างวดนี้เป็นของโครงการใด</label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">เลือกโครงการ</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.project_name}
                </option>
              ))}
            </select></div>

          <div className="grid grid-cols-2 gap-4">
            <label htmlFor="">งวดที่เท่าไร เช่น งวดที่ 1, 2, 3 :</label>
            <input
              type="number"
              name="installment_no"
              value={formData.installment_no}
              onChange={handleChange}
              placeholder="งวดที่"
              className="border px-3 py-2 rounded-lg"
              required
            />
            <label htmlFor="">จำนวนงวดทั้งหมดของโครงการนั้น เช่น 3 งวด, 6 งวด :</label>
            <input
              type="number"
              name="installment_total"
              value={formData.installment_total}
              onChange={handleChange}
              placeholder="จำนวนงวดทั้งหมด"
              className="border px-3 py-2 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="">จำนวนเงินของงวดนั้น (ก่อนหัก VAT/WHT) : </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="จำนวนเงิน"
              className="w-full border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">วันที่วางบิล</label>
              <input
                type="date"
                name="billing_date"
                value={formData.billing_date || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm">คาดว่าจะได้รับเงิน</label>
              <input
                type="date"
                name="expected_payment_date"
                value={formData.expected_payment_date || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="text-sm">วันที่รับจริง</label>
            <input
              type="date"
              name="actual_payment_date"
              value={formData.actual_payment_date || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="">สถานะงวด:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>     <label htmlFor="">หมายเหตุ :</label>
            <textarea
              name="note"
              value={formData.note || ''}
              onChange={handleChange}
              placeholder="หมายเหตุ"
              className="w-full border px-3 py-2 rounded-lg"
            /></div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
