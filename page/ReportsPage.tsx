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

  const handleViewDetails = (entry: any) => {
    setSelectedReportEntry(entry)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedReportEntry(null)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">📅 รายงานรายเดือน</h1>

      <div className="flex justify-between items-center mb-4"> {/* Use flex to align items */}
        <div className="flex gap-2">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border p-2 rounded">
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
          <button onClick={loadReport} className="bg-blue-600 text-white px-4 py-2 rounded">ดูรายงาน</button>
        </div>
        {report.length > 0 && ( // Only show export buttons if there's data
          <ExportButtons
            targetRef={tableRef}
            fileName={`Monthly_Report_${month}_${year}`}
          />
        )}
      </div>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : report.length === 0 ? (
        <p>ไม่มีข้อมูลในเดือนนี้</p>
      ) : (
        <table ref={tableRef} className="w-full border"> {/* Attach ref to the table */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ลูกค้า</th>
              <th className="p-2 border">โปรเจกต์</th>
              <th className="p-2 border">ยอดวางบิล</th>
              <th className="p-2 border">วันที่วางบิล</th>
              <th className="p-2 border">เครดิตเทอม</th>
              <th className="p-2 border">คาดว่าเงินเข้า</th>
              <th className="p-2 border">สถานะ</th>
              <th className="p-2 border no-print">รายละเอียด</th> {/* Add no-print class */}
            </tr>
          </thead>
          <tbody>
            {report.map((r) => (
              <tr key={r.id}>
                <td className="p-2 border">{r.customer_name}</td>
                <td className="p-2 border">{r.project_name}</td>
                <td className="p-2 border text-right">{r.amount?.toLocaleString()}</td>
                <td className="p-2 border">{r.billing_date}</td>
                <td className="p-2 border text-center">{r.credit_term_days || '-'}</td>
                <td className="p-2 border text-blue-600">{r.expected_payment_date}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border text-center no-print"> {/* Add no-print class */}
                  <button
                    onClick={() => handleViewDetails(r)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ReportCustomerDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reportEntry={selectedReportEntry}
      />
    </div>
  )
}
