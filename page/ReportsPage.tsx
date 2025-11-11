import React, { useEffect, useState } from 'react'
import { getMonthlyReport } from '../services/reportService'

export default function ReportsPage() {
  const [report, setReport] = useState<any[]>([])
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">📅 รายงานรายเดือน</h1>

      <div className="flex gap-2 mb-4">
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

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : report.length === 0 ? (
        <p>ไม่มีข้อมูลในเดือนนี้</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ลูกค้า</th>
              <th className="p-2 border">โปรเจกต์</th>
              <th className="p-2 border">ยอดวางบิล</th>
              <th className="p-2 border">วันที่วางบิล</th>
              <th className="p-2 border">เครดิตเทอม</th>
              <th className="p-2 border">คาดว่าเงินเข้า</th>
              <th className="p-2 border">สถานะ</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
