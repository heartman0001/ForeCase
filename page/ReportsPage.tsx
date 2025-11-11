import React, { useEffect, useState, useRef } from 'react' // Import useRef
import { getMonthlyReport } from '../services/reportService'
import ReportCustomerDetailModal from '../components/ReportCustomerDetailModal'
import ExportButtons from '../components/ExportButtons' // Import ExportButtons

export default function ReportsPage() {
  const [report, setReport] = useState<any[]>([])
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReportEntry, setSelectedReportEntry] = useState<any | null>(null)

  const tableRef = useRef<HTMLTableElement>(null) // Create a ref for the table

  // ✅ Search & Pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadReport()
  }, [month, year])

  async function loadReport() {
    setLoading(true)
    try {
      const data = await getMonthlyReport(month, year)
      setReport(data)
    } catch (err) {
      console.error('Error loading report:', err)
    } finally {
      setLoading(false)
    }
  }


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
      <h1 className="text-2xl font-bold mb-4">📅 รายงานรายเดือน</h1>


      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border p-2 rounded"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>เดือน {m}</option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-2 rounded w-24"
          />
          <button
            onClick={loadReport}
            className="bg-[#2b71ed] text-white px-4 py-2 rounded hover:bg-[#2826a9] transition"
          >
            ดูรายงาน
          </button>
        </div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="🔍 ค้นหารายงาน..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
        />
      </div>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : filteredReport.length === 0 ? (
        <p>ไม่มีข้อมูลในเดือนนี้</p>
      ) : (
        <>
          <div ref={tableRef} className="w-full">
            <h2 className="text-xl font-bold mb-2">รายงานรายเดือน</h2>
            <p className="mb-1">ปี: {year}</p>
            <p className="mb-4">เดือน: {month}</p>
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
                  <th className="p-2 border">การดำเนินการ</th>
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
                    <td className="p-2 border text-center">
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
            targetRef={tableRef} // Changed to tableRef
            fileName={`Monthly_Report_${month}_${year}`}
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
