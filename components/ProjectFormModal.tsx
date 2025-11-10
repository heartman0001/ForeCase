import React, { useEffect, useState } from 'react'
import { Project, Customer } from '../types'
import { getCustomers } from '../services/customerService'

interface ProjectFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'customers'>) => Promise<void>
  initialData?: Project | null
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProjectFormModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at' | 'customers'>>({
    project_name: '',
    customer_id: 0,
    sale_name: '',
    pm_name: '',
    phase_total: 1,
    start_date: '',
    end_date: '',
    description: '',
  })

  useEffect(() => {
    loadCustomers()
    if (initialData) {
      // Map only the fields we manage (drop nested `customers` or other props)
      setFormData({
        project_name: initialData.project_name ?? '',
        customer_id: initialData.customer_id ?? 0,
        sale_name: initialData.sale_name ?? '',
        pm_name: initialData.pm_name ?? '',
        phase_total: initialData.phase_total ?? 1,
        start_date: initialData.start_date ?? '',
        end_date: initialData.end_date ?? '',
        description: initialData.description ?? '',
      })
    }
  }, [initialData])

  async function loadCustomers() {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error('Error loading customers:', err)
    }
  }

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    let value: string | number = e.target.value

    // normalize numeric fields
    if (name === 'customer_id' || name === 'phase_total') {
      // empty string -> 0 as "no selection"
      value = value === '' ? 0 : Number(value)
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // sanitize payload: don't send nested `customers` or other unexpected props
    const payload: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'customers'> = {
      project_name: String(formData.project_name).trim(),
      customer_id: Number(formData.customer_id) || 0,
      sale_name: formData.sale_name ? String(formData.sale_name).trim() : '',
      pm_name: formData.pm_name ? String(formData.pm_name).trim() : '',
      phase_total: Number(formData.phase_total) || 1,
      start_date: formData.start_date || '',
      end_date: formData.end_date || '',
      description: formData.description || '',
    }

    await onSubmit(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'แก้ไขโครงการ' : 'เพิ่มโครงการใหม่'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChange}
            placeholder="ชื่อโครงการ"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />

          <select
            name="customer_id"
            value={formData.customer_id ? String(formData.customer_id) : ''}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">เลือกชื่อลูกค้า</option>
            {customers.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.customer_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="sale_name"
            value={formData.sale_name}
            onChange={handleChange}
            placeholder="ชื่อเซลล์ (Sale)"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="text"
            name="pm_name"
            value={formData.pm_name}
            onChange={handleChange}
            placeholder="ชื่อผู้จัดการโครงการ (PM)"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="number"
            name="phase_total"
            value={formData.phase_total}
            onChange={handleChange}
            placeholder="จำนวนเฟสทั้งหมด"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm">วันที่เริ่มต้น</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">วันที่สิ้นสุด</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>

          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="รายละเอียดเพิ่มเติม"
            className="w-full border px-3 py-2 rounded-lg"
          />

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
