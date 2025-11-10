import React from 'react'
import { InvoiceRecord } from '../types'

type Props = {
  data?: InvoiceRecord[] | null
}

export default function ReceivablesTable({ data }: Props) {
  if (!data || !Array.isArray(data)) {
    return <p className="text-center text-gray-500">No data available.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Project</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Billing Date</th>
          <th>Payment Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((inv) => (
          <tr key={inv.id}>
            <td>{inv.project_name}</td>
            <td>{inv.customers?.customer_name || '-'}</td>
            <td>{inv.amount != null ? Number(inv.amount).toLocaleString() : '-'}</td>
            <td>{inv.billing_date ?? '-'}</td>
            <td>{inv.payment_date ?? '-'}</td>
            <td>{inv.status ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
