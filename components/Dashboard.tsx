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
          <h2 className="text-lg font-semibold text-gray-400">Total Projects</h2>
          <p className="text-4xl font-bold">{projectCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-lg font-semibold text-gray-400">Total Customers</h2>
          <p className="text-4xl font-bold">{customerCount}</p>
        </div>
      </div>


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
