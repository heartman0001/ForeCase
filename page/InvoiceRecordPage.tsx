import React, { useEffect, useState } from "react"
import {
  getInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
} from "../services/invoiceService"
import { InvoiceRecord } from "../types"
import AddRecordModal from "../components/AddRecordModal"

export default function InvoiceRecordPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null)

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">📊 รายการ Invoice</h1>

        <button
          onClick={() => setIsAddOpen(true)}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          ➕ เพิ่ม Invoice
        </button>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : invoices.length === 0 ? (
          <p>ไม่มีข้อมูล</p>
        ) : (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Project</th>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Billing Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{inv.projects?.project_name || "-"}</td>
                  <td className="border p-2">{inv.customers?.customer_name || "-"}</td>
                  <td className="border p-2">
                    {Number(inv.amount || 0).toLocaleString()}
                  </td>
                  <td className="border p-2">{inv.billing_date || "-"}</td>
                  <td className="border p-2">{inv.status || "Pending"}</td>
                  <td className="border p-2 space-x-2">
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
        )}
      </div>

      {/* ✅ Modal สำหรับเพิ่ม/แก้ไข */}
      {isAddOpen && (
        <AddRecordModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddInvoice}
        />
      )}
      {isEditOpen && selectedInvoice && (
        <AddRecordModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditInvoice}
          initialData={selectedInvoice}
        />
      )}
    </div>
  )
}
