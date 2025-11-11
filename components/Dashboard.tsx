// 📄 components/Dashboard.tsx
import React, { useEffect, useState } from 'react'
import { getInvoices, deleteInvoice } from '../services/invoiceService'
import { getProjects } from '../services/projectService'
import { getCustomers } from '../services/customerService'
import AddRecordModal from './AddRecordModal'
import EditInvoiceModal from './EditInvoiceModal'
import RevenueByProjectChart from './RevenueByProjectChart'
import RevenueByCustomerChart from './RevenueByCustomerChart'

export default function Dashboard() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [projectCount, setProjectCount] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  async function loadInvoices() {
    setLoading(true)
    try {
      const data = await getInvoices()
      setInvoices(data)
    } finally {
      setLoading(false)
    }
  }

  async function loadCounts() {
    try {
      const [projects, customers] = await Promise.all([getProjects(), getCustomers()])
      setProjectCount(projects.length)
      setCustomerCount(customers.length)
    } catch (error) {
      console.error("Failed to load counts:", error)
    }
  }

  useEffect(() => {
    loadInvoices()
    loadCounts()
  }, [])

  async function handleDelete(id: number) {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return
    await deleteInvoice(id)
    alert('✅ ลบข้อมูลสำเร็จ')
    loadInvoices()
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
<<<<<<< Updated upstream
          <h2 className="text-lg font-semibold text-gray-400">Total Projects</h2>
          <p className="text-4xl font-bold">{projectCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold text-gray-400">Total Customers</h2>
          <p className="text-4xl font-bold">{customerCount}</p>
        </div>
      </div>


=======
            <h2 className="text-lg font-semibold text-gray-400">Total Projects</h2>
            <p className="text-4xl font-bold">{projectCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold text-gray-400">Total Customers</h2>
            <p className="text-4xl font-bold">{customerCount}</p>
        </div>
      </div>

      {/* <h1 className="text-2xl font-bold mb-4">📊 รายการ Invoice</h1>
      
      <button
        onClick={() => setIsAddOpen(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
         เพิ่ม Invoice
      </button> */}

      {/* {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : invoices.length === 0 ? (
        <p>ไม่มีข้อมูล</p>
      ) : (
        <table className="w-full border">
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
              <tr key={inv.id} className="text-center">
                <td className="border p-2">{inv.projects?.project_name}</td>
                <td className="border p-2">{inv.customers?.customer_name}</td>
                <td className="border p-2">{inv.amount?.toLocaleString()}</td>
                <td className="border p-2">{inv.billing_date}</td>
                <td className="border p-2">{inv.status}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedId(inv.id)
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
        </table> */}
      {/* )} */}
      
>>>>>>> Stashed changes
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <RevenueByProjectChart />
        <RevenueByCustomerChart />
      </div>

      <AddRecordModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdded={loadInvoices}
      />

      <EditInvoiceModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        invoiceId={selectedId}
        onUpdated={loadInvoices}
      />
    </div>
  )
}
