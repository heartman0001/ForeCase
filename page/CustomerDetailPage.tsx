import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { Customer, Project, InvoiceRecord } from '../types'

export default function CustomerDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
    const [loading, setLoading] = useState(true)

    // ✅ Search + Pagination
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        if (id) loadData(id)
    }, [id])

    async function loadData(customerId: string) {
        setLoading(true)

        const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('id', customerId)
            .single()

        const { data: projectData } = await supabase
            .from('projects')
            .select('id, project_name, sale_name, pm_name, phase_total, start_date, end_date')
            .eq('customer_id', customerId)

        const { data: invoiceData } = await supabase
            .from('invoice_records')
            .select('*')
            .eq('customer_id', customerId)

        setCustomer(customerData)
        setProjects(projectData || [])
        setInvoices(invoiceData || [])
        setLoading(false)
    }

    if (loading) return <div className="p-6 text-center text-gray-500">กำลังโหลด...</div>
    if (!customer) return <div className="p-6 text-center text-gray-500">ไม่พบข้อมูลลูกค้า</div>

    // ✅ ฟิลเตอร์โปรเจกต์ตามคำค้นหา
    const filteredProjects = projects.filter(
        (p) =>
            p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sale_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.pm_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // ✅ แบ่งหน้า Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#2826a9] mb-4">
                รายละเอียดลูกค้า: {customer.customer_name}
            </h1>

            <div className="bg-white shadow-md rounded-xl p-4 mb-6">
                <p><b>ชื่อบริษัท:</b> {customer.company_name}</p>
                <p><b>อีเมล:</b> {customer.email ?? '-'}</p>
                <p><b>เบอร์โทร:</b> {customer.phone ?? '-'}</p>
                <p><b>เครดิตเทอม:</b> {customer.credit_term_days ?? 0} วัน</p>
                <p><b>ที่อยู่:</b> {customer.address ?? '-'}</p>
            </div>

            {/* ✅ ช่องค้นหา */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                    โปรเจกต์ทั้งหมด ({filteredProjects.length})
                </h2>
                <input
                    type="text"
                    placeholder="🔍 ค้นหาโปรเจกต์ / Sale / PM"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* ✅ ตารางโปรเจกต์ */}
            <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">ชื่อโปรเจกต์</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Sale</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">PM</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">จำนวนเฟส</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">วันที่เริ่ม</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">วันที่สิ้นสุด</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold">ยอดรวม (บาท)</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-green-100">รับแล้ว</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-red-100">ค้างชำระ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentProjects.map((p, index) => {
                            const relatedInvoices = invoices.filter(inv => inv.project_id === p.id)
                            const totalAmount = relatedInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)
                            const totalPaid = relatedInvoices.reduce((sum, inv) => sum + (Number(inv.real_received) || 0), 0)
                            const outstanding = totalAmount - totalPaid

                            return (
                                <tr
                                    key={p.id}
                                    className={`hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}
                                >
                                    <td className="px-4 py-3 text-sm text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-blue-700">{p.project_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{p.sale_name ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{p.pm_name ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-center">{p.phase_total ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-600">{p.start_date ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-center text-gray-600">{p.end_date ?? '-'}</td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-800">
                                        {totalAmount.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold text-green-600">
                                        {totalPaid.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
                                        {outstanding.toLocaleString()}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* ✅ Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-600">
                    หน้า {currentPage} จาก {totalPages} ({filteredProjects.length} โปรเจกต์)
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        ◀ ก่อนหน้า
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        ถัดไป ▶
                    </button>
                </div>
            </div>
        </div>
    )
}
