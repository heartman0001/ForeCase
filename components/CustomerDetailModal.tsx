import React, { useState, useEffect } from 'react'
import { Customer } from '../types'
import { getCustomerById } from '../services/customerService'

interface CustomerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: number | null
}

export default function CustomerDetailModal({
  isOpen,
  onClose,
  customerId,
}: CustomerDetailModalProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomer() {
      if (!customerId) {
        setCustomer(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const data = await getCustomerById(customerId)
        setCustomer(data)
      } catch (err) {
        console.error('Error fetching customer details:', err)
        setError('ไม่สามารถโหลดข้อมูลลูกค้าได้')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchCustomer()
    }
  }, [isOpen, customerId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">รายละเอียดลูกค้า</h2>

        {loading && <p>กำลังโหลดข้อมูลลูกค้า...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {customer && !loading && (
          <div className="space-y-3">
            <p><strong>ชื่อลูกค้า (ชื่อองค์กรหลัก):</strong> {customer.customer_name}</p>
            <p><strong>ชื่อทางการ:</strong> {customer.company_name || '-'}</p>
            <p><strong>ชื่อผู้ติดต่อหลัก:</strong> {customer.contact_name || '-'}</p>
            <p><strong>อีเมล:</strong> {customer.email || '-'}</p>
            <p><strong>เบอร์โทรศัพท์:</strong> {customer.phone || '-'}</p>
            <p><strong>ที่อยู่:</strong> {customer.address || '-'}</p>
            <p><strong>เครดิตเทอม:</strong> {customer.credit_term_days} วัน</p>
            <p><strong>รอบเก็บเงิน (A Date):</strong> {customer.a_date || '-'}</p>
            <p><strong>จดทะเบียน VAT:</strong> {customer.vat_registered ? 'ใช่' : 'ไม่'}</p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}
