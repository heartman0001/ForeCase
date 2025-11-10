import React, { useState, useEffect } from 'react'
import { Customer } from '../types'

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Customer, 'id'>) => Promise<void>
  initialData?: Customer | null
}

export default function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CustomerFormModalProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    customer_name: '',
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    credit_term_days: 30,
    a_date: '',
    vat_registered: true,
  })

  useEffect(() => {
    if (initialData) setFormData(initialData)
  }, [initialData])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="ชื่อลูกค้า"
            required
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="text"
            name="company_name"
            value={formData.company_name || ''}
            onChange={handleChange}
            placeholder="ชื่อบริษัท (ถ้ามี)"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="text"
            name="contact_name"
            value={formData.contact_name || ''}
            onChange={handleChange}
            placeholder="ผู้ติดต่อ"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="อีเมล"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <input
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            placeholder="เบอร์โทรศัพท์"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="ที่อยู่"
            className="w-full border px-3 py-2 rounded-lg"
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">เครดิตเทอม (วัน)</label>
              <input
                type="number"
                name="credit_term_days"
                value={formData.credit_term_days}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">รอบเก็บเงิน (A Date)</label>
              <input
                type="text"
                name="a_date"
                value={formData.a_date || ''}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="vat_registered"
              checked={formData.vat_registered}
              onChange={handleChange}
            />
            มี VAT
          </label>

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
