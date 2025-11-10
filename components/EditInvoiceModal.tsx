// 📄 components/EditInvoiceModal.tsx
import React, { useState, useEffect } from 'react'
import { getInvoiceById, updateInvoice } from '../services/invoiceService'

interface EditInvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    invoiceId: number | null
    onUpdated: () => void
}

export default function EditInvoiceModal({ isOpen, onClose, invoiceId, onUpdated }: EditInvoiceModalProps) {
    const [formData, setFormData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (invoiceId && isOpen) loadData()
    }, [invoiceId, isOpen])

    async function loadData() {
        const data = await getInvoiceById(invoiceId!)
        setFormData(data)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!invoiceId) return
        setLoading(true)
        await updateInvoice(invoiceId, formData)
        alert('✅ อัปเดตข้อมูลสำเร็จ')
        onUpdated()
        onClose()
        setLoading(false)
    }

    if (!isOpen || !formData) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-center">แก้ไข Invoice</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Billing Date</label>
                        <input
                            type="date"
                            name="billing_date"
                            value={formData.billing_date || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Collected">Collected</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
