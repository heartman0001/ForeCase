import React, { useEffect, useState } from "react"
import {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from "../services/invoiceService"
import { InvoiceRecord } from "../types"
import AddRecordModal from "../components/AddRecordModal"
import { Edit } from "lucide-react"

export default function InvoiceRecordPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      setLoading(true)
      const data = await getInvoices()
      setInvoices(data)
    } catch (err) {
      console.error("❌ Error loading invoices:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddInvoice(data: Omit<InvoiceRecord, "id">) {
    try {
      await addInvoice(data)
      setIsAddOpen(false)
      await loadInvoices()
    } catch (err) {
      console.error("❌ Add error:", err)
    }
  }

  async function handleEditInvoice(data: Partial<InvoiceRecord>) {
    if (!selectedInvoice) return
    try {
      await updateInvoice(selectedInvoice.id, data)
      setSelectedInvoice(null)
      setIsEditOpen(false)
      await loadInvoices()
    } catch (err) {
      console.error("❌ Edit error:", err)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบ Invoice นี้?")) return
    try {
      await deleteInvoice(id)
      await loadInvoices()
    } catch (err) {
      console.error("❌ Delete error:", err)
    }
  }

  // ✅ Filter invoices by search term
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.projects?.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customers?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ✅ Pagination logic (ใช้ filteredInvoices แทน invoices)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-12xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">📊 รายการ Invoice</h1>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Search Box */}
          <input
            type="text"
            placeholder="🔍 ค้นหา Invoice..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // ✅ รีเซ็ตไปหน้าแรกเมื่อค้นหา
            }}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
          />

          {/* Add Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#2b71ed] text-white px-4 py-2 rounded-lg hover:bg-[#2826a9] transition"
          >
            ➕ เพิ่ม Invoice
          </button>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : filteredInvoices.length === 0 ? (
          <p>ไม่พบข้อมูล</p>
        ) : (
          <>
            <table className="min-w-full border text-sm table-auto">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-3 border text-left">Project</th>
      <th className="px-4 py-3 border text-left">Customer</th>
      <th className="px-4 py-3 border text-right">Amount</th>
      <th className="px-4 py-3 border text-center">Billing Date</th>
      <th className="px-4 py-3 border text-center">Status</th>
      <th className="px-4 py-3 border text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentInvoices.map((inv) => (
      <tr key={inv.id} className="hover:bg-gray-50">
        <td className="border px-4 py-3">{inv.projects?.project_name || "-"}</td>
        <td className="border px-4 py-3">{inv.customers?.customer_name || "-"}</td>
        <td className="border px-4 py-3 text-right">
          {Number(inv.amount || 0).toLocaleString()}
        </td>
        <td className="border px-4 py-3 text-center">{inv.billing_date || "-"}</td>
        <td className="border px-4 py-3 text-center">{inv.status || "Pending"}</td>
        <td className="border px-4 py-3 space-x-2 text-center">
          <button
            onClick={() => {
              setSelectedInvoice(inv)
              setIsEditOpen(true)
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            ✏️ แก้ไข
          </button>
          <button
            onClick={() => handleDelete(inv.id)}
            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
          >
            🗑️ ลบ
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

      {/* ✅ Modal สำหรับเพิ่ม/แก้ไข */}
      {isAddOpen && (
        <AddRecordModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddInvoice}
          onAdded={loadInvoices}
        />
      )}
      {isEditOpen && selectedInvoice && (
        <AddRecordModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onAdded={loadInvoices}
          invoiceId={selectedInvoice.id}
        />
      )}
    </div>
  )
}
