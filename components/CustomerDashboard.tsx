import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Customer, InvoiceRecord } from '../types'
import { useNavigate } from 'react-router-dom'
import { Users, DollarSign, CheckCircle, AlertTriangle, Bath, BathIcon } from 'lucide-react'

interface CustomerCardData {
    customer: Customer
    totalAmount: number
    totalPaid: number
    totalOutstanding: number
}

export default function CustomerDashboard() {
    const navigate = useNavigate()
    const [cards, setCards] = useState<CustomerCardData[]>([])
    const [loading, setLoading] = useState(true)

    const [summary, setSummary] = useState({
        totalCustomers: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalOutstanding: 0,
    })

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        const { data: customers, error: customerError } = await supabase
            .from('customers')
            .select('id, customer_name, company_name, email, phone')

        const { data: invoices, error: invoiceError } = await supabase
            .from('invoice_records')
            .select('customer_id, amount, real_received')

        if (customerError || invoiceError) {
            console.error(customerError || invoiceError)
            setLoading(false)
            return
        }

        const cards: CustomerCardData[] = (customers ?? []).map((c: Customer) => {
            const invs = (invoices ?? []).filter((inv: InvoiceRecord) => inv.customer_id === c.id)
            const totalAmount = invs.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
            const totalPaid = invs.reduce((sum, inv) => sum + (Number(inv.real_received) || 0), 0)
            const totalOutstanding = totalAmount - totalPaid
            return { customer: c, totalAmount, totalPaid, totalOutstanding }
        })

        // ✅ คำนวณสรุปภาพรวม
        const totalCustomers = cards.length
        const totalAmount = cards.reduce((sum, c) => sum + c.totalAmount, 0)
        const totalPaid = cards.reduce((sum, c) => sum + c.totalPaid, 0)
        const totalOutstanding = cards.reduce((sum, c) => sum + c.totalOutstanding, 0)

        setSummary({ totalCustomers, totalAmount, totalPaid, totalOutstanding })
        setCards(cards)
        setLoading(false)
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>

    return (
        <div className="p-6 space-y-8">
            {/* ✅ Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <Users className="w-10 h-10" />
                    <div>
                        <div className="text-3xl font-bold">{summary.totalCustomers}</div>
                        <div className="text-sm opacity-80">จำนวนลูกค้าทั้งหมด</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    
                    <div>
                        <div className="text-3xl font-bold">{summary.totalAmount.toLocaleString()}</div>
                        <div className="text-sm opacity-80">ยอดรวมทั้งหมด (บาท)</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <CheckCircle className="w-10 h-10" />
                    <div>
                        <div className="text-3xl font-bold">{summary.totalPaid.toLocaleString()}</div>
                        <div className="text-sm opacity-80">ยอดชำระแล้ว (บาท)</div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg flex items-center gap-4">
                    <AlertTriangle className="w-10 h-10" />
                    <div>
                        <div className="text-3xl font-bold">{summary.totalOutstanding.toLocaleString()}</div>
                        <div className="text-sm opacity-80">ยอดค้างชำระ (บาท)</div>
                    </div>
                </div>
            </div>

            {/* ✅ Customer Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map(({ customer, totalAmount, totalPaid, totalOutstanding }) => (
                    <div
                        key={customer.id}
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 hover:shadow-2xl hover:cursor-pointer transition-all duration-200 border border-gray-100"
                    >
                        <h2 className="text-xl font-semibold text-blue-700">{customer.customer_name}</h2>
                        <div className="text-gray-600">{customer.company_name}</div>
                        <div className="text-sm text-gray-500">📧 {customer.email ?? '-'}</div>
                        <div className="text-sm text-gray-500">📞 {customer.phone ?? '-'}</div>

                        <div className="mt-3 border-t pt-2 text-sm space-y-1">
                            <div className="flex justify-between">
                                <span>ยอดรวมทั้งหมด:</span>
                                <span className="font-semibold text-blue-600">{totalAmount.toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ชำระแล้ว:</span>
                                <span className="font-semibold text-green-600">{totalPaid.toLocaleString()} บาท</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ค้างชำระ:</span>
                                <span className="font-semibold text-red-600">{totalOutstanding.toLocaleString()} บาท</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
