import React, { useRef } from 'react'
import ExportButtons from './ExportButtons' // Import ExportButtons

interface ReportCustomerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  reportEntry: any | null // This will be the entire row object from v_monthly_report
}

export default function ReportCustomerDetailModal({
  isOpen,
  onClose,
  reportEntry,
}: ReportCustomerDetailModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !reportEntry) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">รายละเอียดรายงานลูกค้า</h2>

        <div ref={modalContentRef} className="space-y-3 p-4 border rounded-lg mb-4"> {/* Content to be exported */}
          <p><strong>ID:</strong> {reportEntry.id}</p>
          <p><strong>Customer ID:</strong> {reportEntry.customer_id}</p>
          <p><strong>Project ID:</strong> {reportEntry.project_id}</p>
          <p><strong>ชื่อลูกค้า:</strong> {reportEntry.customer_name}</p>
          <p><strong>โปรเจกต์:</strong> {reportEntry.project_name}</p>
          <p><strong>ยอดวางบิล:</strong> {reportEntry.amount?.toLocaleString()}</p>
          <p><strong>วันที่วางบิล:</strong> {reportEntry.billing_date}</p>
          <p><strong>คาดว่าเงินเข้า:</strong> {reportEntry.expected_payment_date}</p>
          <p><strong>สถานะ:</strong> {reportEntry.status}</p>
          <p><strong>VAT Percent:</strong> {reportEntry.vat_percent || '-'}</p>
          <p><strong>WHT Percent:</strong> {reportEntry.wht_percent || '-'}</p>
          <p><strong>Total with VAT:</strong> {reportEntry.total_with_vat?.toLocaleString() || '-'}</p>
          <p><strong>Net Amount:</strong> {reportEntry.net_amount?.toLocaleString() || '-'}</p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <ExportButtons
            targetRef={modalContentRef}
            fileName={`Customer_Report_${reportEntry.customer_name}_${reportEntry.id}`}
          />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}
