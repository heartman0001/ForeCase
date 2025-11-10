// pages/CustomersPage.tsx
import React, { useEffect, useState } from 'react'
import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
} from '../services/customerService'
import CustomerFormModal from '../components/CustomerFormModal'
import { Customer } from '../types'

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    useEffect(() => {
        loadCustomers()
    }, [])

    async function loadCustomers() {
        try {
            setLoading(true)
            const data = await getCustomers()
            setCustomers(data)
        } catch (err) {
            console.error('Error loading customers:', err)
        } finally {
            setLoading(false)
        }
    }

    async function handleAddCustomer(data: Omit<Customer, 'id'>) {
        await addCustomer(data)
        await loadCustomers()
    }

    async function handleUpdateCustomer(data: Omit<Customer, 'id'>) {
        if (!selectedCustomer) return
        await updateCustomer(selectedCustomer.id, data)
        setSelectedCustomer(null)
        await loadCustomers()
    }

    async function handleDeleteCustomer(id: number) {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้ารายนี้?')) {
            await deleteCustomer(id)
            await loadCustomers()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">จัดการข้อมูลลูกค้า</h1>
                    <button
                        onClick={() => {
                            setSelectedCustomer(null)
                            setIsModalOpen(true)
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        + เพิ่มลูกค้า
                    </button>
                </div>

                {loading ? (
                    <p>กำลังโหลดข้อมูล...</p>
                ) : customers.length === 0 ? (
                    <p>ยังไม่มีข้อมูลลูกค้า</p>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">ชื่อลูกค้า</th>
                                <th className="p-2 text-left">ผู้ติดต่อ</th>
                                <th className="p-2 text-left">เบอร์โทร</th>
                                <th className="p-2 text-left">เครดิตเทอม</th>
                                <th className="p-2 text-left">มี VAT</th>
                                <th className="p-2 text-left">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((c) => (
                                <tr key={c.id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{c.customer_name}</td>
                                    <td className="p-2">{c.contact_name || '-'}</td>
                                    <td className="p-2">{c.phone || '-'}</td>
                                    <td className="p-2">{c.credit_term_days} วัน</td>
                                    <td className="p-2">{c.vat_registered ? '✅' : '❌'}</td>
                                    <td className="p-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCustomer(c)
                                                setIsModalOpen(true)
                                            }}
                                            className="text-blue-600 hover:underline mr-3"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCustomer(c.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ✅ Modal ฟอร์ม */}
            {isModalOpen && (
                <CustomerFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}
                    initialData={selectedCustomer}
                />
            )}
        </div>
    )
}


