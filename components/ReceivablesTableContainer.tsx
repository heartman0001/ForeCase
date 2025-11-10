// components/ReceivablesTableContainer.tsx
import React, { useEffect, useState } from 'react'
import { getInvoices } from '../services/invoiceService'
import ReceivablesTable from './ReceivablesTable'

export default function ReceivablesTableContainer() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        const result = await getInvoices()
        if (!cancelled) setInvoices(result)
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load invoices')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [])

  if (loading) return <p>Loading invoices...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>

  return <ReceivablesTable data={invoices} />
}
