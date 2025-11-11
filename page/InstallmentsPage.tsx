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

  // ✅ Search & Pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

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

  // ✅ Filter installments by search term
  const filteredInstallments = installments.filter(
    (i) =>
      i.projects?.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInstallments = filteredInstallments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredInstallments.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลงวดการชำระเงิน</h1>

          {/* Search Box */}
          <input
            type="text"
            placeholder="🔍 ค้นหางวดการชำระเงิน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
          />

          <button
            onClick={() => {
              setSelected(null)
              setIsModalOpen(true)
            }}
            className="bg-[#2b71ed] text-white px-4 py-2 rounded-md hover:bg-[#2826a9] transition"
          >
            + เพิ่มงวด
          </button>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : filteredInstallments.length === 0 ? (
          <p>ไม่พบข้อมูลงวดการชำระเงิน</p>
        ) : (
          <>
            <table className="w-full border text-sm">
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
                {currentInstallments.map((i) => (
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

            {/* ✅ Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                ◀ ก่อนหน้า
              </button>
              <span>
                หน้า {currentPage} จาก {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                ถัดไป ▶
              </button>
            </div>
          </>
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
