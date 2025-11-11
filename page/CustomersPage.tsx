// pages/CustomersPage.tsx
import React, { useEffect, useState } from 'react'
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '../services/customerService'
import CustomerFormModal from '../components/CustomerFormModal'
import { Customer } from '../types'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    try {
      setLoading(true)
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      console.error('Error loading customers:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCustomer(data: Omit<Customer, 'id'>) {
    await addCustomer(data)
    await loadCustomers()
  }

  async function handleUpdateCustomer(data: Omit<Customer, 'id'>) {
    if (!selectedCustomer) return
    await updateCustomer(selectedCustomer.id, data)
    setSelectedCustomer(null)
    await loadCustomers()
  }

  async function handleDeleteCustomer(id: number) {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้ารายนี้?')) {
      await deleteCustomer(id)
      await loadCustomers()
    }
  }

  // ✅ Filter customers by search term
  const filteredCustomers = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ✅ Pagination logic (ใช้ filteredCustomers แทน customers)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลลูกค้า</h1>
          {/* Search Box */}
          <input
            type="text"
            placeholder="🔍 ค้นหาข้อมูลลูกค้า"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // ✅ รีเซ็ตไปหน้าแรกเมื่อค้นหาใหม่
            }}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
          />
          <button
            onClick={() => {
              setSelectedCustomer(null)
              setIsModalOpen(true)
            }}
            className="bg-[#2b71ed] text-white px-4 py-2 rounded-md hover:bg-[#2826a9] transition"
          >
            + เพิ่มลูกค้า
          </button>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : filteredCustomers.length === 0 ? (
          <p>ไม่พบข้อมูลลูกค้า</p>
        ) : (
          <>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ชื่อลูกค้า</th>
                  <th className="p-2 text-left">ผู้ติดต่อ</th>
                  <th className="p-2 text-left">เบอร์โทร</th>
                  <th className="p-2 text-left">เครดิตเทอม</th>
                  <th className="p-2 text-left">มี VAT</th>
                  <th className="p-2 text-left">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((c) => (
                  <tr key={c.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{c.customer_name}</td>
                    <td className="p-2">{c.contact_name || '-'}</td>
                    <td className="p-2">{c.phone || '-'}</td>
                    <td className="p-2">{c.credit_term_days} วัน</td>
                    <td className="p-2">{c.vat_registered ? '✅' : '❌'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(c)
                          setIsModalOpen(true)
                        }}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
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

      {/* ✅ Modal ฟอร์ม */}
      {isModalOpen && (
        <CustomerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
          initialData={selectedCustomer}
        />
      )}
    </div>
  )
}
