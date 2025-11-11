import React, { useEffect, useState, useRef, useCallback } from 'react' // Import useRef, useCallback
import { getFilteredReports } from '../services/reportService' // Updated import
import ReportCustomerDetailModal from '../components/ReportCustomerDetailModal'
import ExportButtons from '../components/ExportButtons'

export default function ReportsPage() {
  const [report, setReport] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReportEntry, setSelectedReportEntry] = useState<any | null>(null)

  const tableRef = useRef<HTMLTableElement>(null)

  // ✅ New Filter States
  const [selectedDateFilter, setSelectedDateFilter] = useState<'today' | 'month' | 'year' | 'none'>('month')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all') // 'all', 'รอดำเนินการ', 'สำเร็จ', 'ยกเลิก'

  // ✅ Search & Pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const loadReport = useCallback(async () => {
    setLoading(true)
    try {
      let startDate: string | null = null
      let endDate: string | null = null
      const today = new Date()
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1 // getMonth() is 0-based

      if (selectedDateFilter === 'today') {
        startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
        endDate = startDate
      } else if (selectedDateFilter === 'month') {
        const lastDay = new Date(currentYear, currentMonth, 0).getDate()
        startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`
        endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
      } else if (selectedDateFilter === 'year') {
        startDate = `${currentYear}-01-01`
        endDate = `${currentYear}-12-31`
      }

      const data = await getFilteredReports(startDate, endDate, selectedStatusFilter)
      setReport(data)
    } catch (err) {
      console.error('Error loading report:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedDateFilter, selectedStatusFilter]) // Dependencies for useCallback

  useEffect(() => {
    loadReport()
  }, [loadReport]) // Dependency for useEffect

  const handleRowClick = (entry: any) => {
    setSelectedReportEntry(entry)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReportEntry(null)
  }

  // ✅ Filter reports by search term
  const filteredReport = report.filter(
    (r) =>
      r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentReports = filteredReport.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReport.length / itemsPerPage)

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">📅 รายงาน</h1> {/* Changed title */}


      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          {/* Date Filter Buttons */}
          <button
            onClick={() => setSelectedDateFilter('today')}
            className={`px-4 py-2 rounded ${selectedDateFilter === 'today' ? 'bg-[#2b71ed] text-white' : 'bg-gray-200'}`}
          >
            วันนี้
          </button>
          <button
            onClick={() => setSelectedDateFilter('month')}
            className={`px-4 py-2 rounded ${selectedDateFilter === 'month' ? 'bg-[#2b71ed] text-white' : 'bg-gray-200'}`}
          >
            เดือนนี้
          </button>
          <button
            onClick={() => setSelectedDateFilter('year')}
            className={`px-4 py-2 rounded ${selectedDateFilter === 'year' ? 'bg-[#2b71ed] text-white' : 'bg-gray-200'}`}
          >
            ปีนี้
          </button>
        </div>

        {/* Search Box and Status Filter */}
        <div className="flex gap-2 w-full md:w-2/3">
          <input
            type="text"
            placeholder="🔍 ค้นหารายงาน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
          />
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Billed">Billed</option>
            <option value="Overdue">Overdue</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : filteredReport.length === 0 ? (
        <p>ไม่มีข้อมูล</p>
      ) : (
        <>
          <div ref={tableRef} className="w-full">
            <h2 className="text-xl font-bold mb-2">รายงาน</h2> {/* Changed title */}
            <p className="mb-1">
              {selectedDateFilter === 'today' && `วันที่: ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              {selectedDateFilter === 'month' && `เดือน: ${new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}`}
              {selectedDateFilter === 'year' && `ปี: ${new Date().toLocaleDateString('th-TH', { year: 'numeric' })}`}
              {selectedDateFilter === 'none' && `ทั้งหมด`}
            </p>
            {selectedStatusFilter !== 'all' && <p className="mb-4">สถานะ: {selectedStatusFilter}</p>}
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ลูกค้า</th>
                  <th className="p-2 border">โปรเจกต์</th>
                  <th className="p-2 border">ยอดวางบิล</th>
                  <th className="p-2 border">วันที่วางบิล</th>
                  <th className="p-2 border">เครดิตเทอม</th>
                  <th className="p-2 border">คาดว่าเงินเข้า</th>
                  <th className="p-2 border">สถานะ</th>
                  <th className="p-2 border action-column">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{r.customer_name}</td>
                    <td className="p-2 border">{r.project_name}</td>
                    <td className="p-2 border text-right">{r.amount?.toLocaleString()}</td>
                    <td className="p-2 border">{r.billing_date}</td>
                    <td className="p-2 border text-center">{r.credit_term_days || '-'}</td>
                    <td className="p-2 border text-blue-600">{r.expected_payment_date}</td>
                    <td className="p-2 border">{r.status}</td>
                    <td className="p-2 border text-center action-column">
                      <button
                        onClick={() => handleRowClick(r)}
                        className="bg-[#2b71ed] text-white px-3 py-1 rounded hover:bg-[#2826a9] transition text-xs"
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          

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
          <ExportButtons
            targetRef={tableRef}
            fileName={`Report_${selectedDateFilter}_${selectedStatusFilter}`}
          />
        </>
      )}

      <ReportCustomerDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reportEntry={selectedReportEntry}
      />
    </div>
  )
}

