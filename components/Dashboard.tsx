// 📄 components/Dashboard.tsx
import React, { useEffect, useState } from 'react'
import { getProjects } from '../services/projectService'
import { getCustomers } from '../services/customerService'
import { useAuth } from '../context/AuthContext'
import RevenueByProjectChart from './RevenueByProjectChart'
import RevenueByCustomerChart from './RevenueByCustomerChart'
import UpcomingInstallments from './UpcomingInstallments'
import KeyMetrics from './KeyMetrics'
import RecentlyPaid from './RecentlyPaid'

export default function Dashboard() {
  const { user } = useAuth()
  const [projectCount, setProjectCount] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)

  async function loadCounts() {
    try {
      const [projects, customers] = await Promise.all([getProjects(), getCustomers()])
      setProjectCount(projects.length)
      setCustomerCount(customers.length)
    } catch (error) {
      console.error("Failed to load counts:", error)
    }
  }

  useEffect(() => {
    loadCounts()
  }, [])

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* ✅ Header Section */}
      <div className="mb-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 text-center">
          <h1 className="text-4xl font-bold text-[#2826a9] mb-4">
            📊 Dashboard Overview
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            หน้านี้คือ <span className="font-semibold text-[#2b71ed]">Dashboard</span> 
            ของระบบ ForeCash ที่สรุปข้อมูลสำคัญทั้งหมดในที่เดียว  
            คุณสามารถดูจำนวนโครงการ, ลูกค้า, รายได้รวม, ยอดที่ยังไม่ได้เก็บ 
            และการคาดการณ์ช่วงเวลาเงินเข้า เพื่อช่วยในการวางแผนการเงินและการเก็บเงินได้อย่างมีประสิทธิภาพ
          </p>
        </div>
      </div>

      {/* ✅ Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card: Projects */}
        <div className="bg-[#2b71ed]/10 border border-[#2b71ed]/30 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2b71ed]/20 mb-3">
              📁
            </div>
            <h2 className="text-lg font-semibold text-[#2b71ed]">Total Projects</h2>
            <p className="text-4xl font-bold mt-2 text-[#2b71ed]">{projectCount}</p>
            <p className="text-sm text-gray-600 mt-1">จำนวนโครงการทั้งหมด</p>
          </div>
        </div>

        {/* Card: Customers */}
        <div className="bg-[#2826a9]/10 border border-[#2826a9]/30 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2826a9]/20 mb-3">
              👥
            </div>
            <h2 className="text-lg font-semibold text-[#2826a9]">Total Customers</h2>
            <p className="text-4xl font-bold mt-2 text-[#2826a9]">{customerCount}</p>
            <p className="text-sm text-gray-600 mt-1">จำนวนลูกค้าทั้งหมด</p>
          </div>
        </div>

        {/* Card: Revenue */}
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-3">
              💰
            </div>
            <h2 className="text-lg font-semibold text-green-600">Total Revenue</h2>
            <p className="text-4xl font-bold mt-2 text-green-600">฿0</p>
            <p className="text-sm text-gray-600 mt-1">รายได้รวมทั้งหมด</p>
          </div>
        </div>

        {/* Card: Outstanding Invoices */}
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mb-3">
              📑
            </div>
            <h2 className="text-lg font-semibold text-red-600">Outstanding Invoices</h2>
            <p className="text-4xl font-bold mt-2 text-red-600">฿0</p>
            <p className="text-sm text-gray-600 mt-1">ยอดที่ยังไม่ได้เก็บ</p>
          </div>
        </div>
      </div>

      {/* ✅ Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueByProjectChart />
            <RevenueByCustomerChart />
          </div>
          <UpcomingInstallments />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <KeyMetrics />
          <RecentlyPaid />
        </div>
      </div>
    </div>
  )
}
