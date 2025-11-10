// pages/InstallmentsPage.tsx
import React, { useEffect, useState } from 'react'
import {
  getInstallments,
  addInstallment,
  updateInstallment,
  deleteInstallment,
} from '../services/installmentService'
import InstallmentFormModal from '../components/InstallmentFormModal'
import { Installment } from '../types'

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<Installment | null>(null)

  useEffect(() => {
    loadInstallments()
  }, [])

  async function loadInstallments() {
    try {
      setLoading(true)
      const data = await getInstallments()
      setInstallments(data)
    } catch (err) {
      console.error('Error loading installments:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(data: Omit<Installment, 'id'>) {
    await addInstallment(data)
    await loadInstallments()
  }

  async function handleUpdate(data: Omit<Installment, 'id'>) {
    if (!selected) return
    await updateInstallment(selected.id, data)
    setSelected(null)
    await loadInstallments()
  }

  async function handleDelete(id: number) {
    if (window.confirm('แน่ใจหรือไม่ว่าต้องการลบงวดนี้?')) {
      await deleteInstallment(id)
      await loadInstallments()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลงวดการชำระเงิน</h1>
          <button
            onClick={() => {
              setSelected(null)
              setIsModalOpen(true)
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + เพิ่มงวด
          </button>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : installments.length === 0 ? (
          <p>ยังไม่มีข้อมูลงวดการชำระเงิน</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">โครงการ</th>
                <th className="p-2 text-left">งวดที่</th>
                <th className="p-2 text-left">จำนวนเงิน</th>
                <th className="p-2 text-left">วันที่วางบิล</th>
                <th className="p-2 text-left">สถานะ</th>
                <th className="p-2 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((i) => (
                <tr key={i.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{i.projects?.project_name || '-'}</td>
                  <td className="p-2">
                    {i.installment_no}/{i.installment_total}
                  </td>
                  <td className="p-2">{i.amount.toLocaleString()}</td>
                  <td className="p-2">{i.billing_date || '-'}</td>
                  <td className="p-2">{i.status}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setSelected(i)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="text-red-600 hover:underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <InstallmentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={selected ? handleUpdate : handleAdd}
          initialData={selected}
        />
      )}
    </div>
  )
}
