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


      {/* Status */}
      <div>
        <label>สถานะงวด:</label>
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

      {/* Note */}
      <div>
        <label>หมายเหตุ :</label>
        <textarea
          name="note"
          value={formData.note || ""}
          onChange={handleChange}
          placeholder="หมายเหตุ"
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>

      {/* Actions */}
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
