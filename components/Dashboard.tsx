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
    <div className="p-6">
     
      

      {/* Main Content Grid */}
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
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold text-gray-400">Total Projects</h2>
            <p className="text-4xl font-bold">{projectCount}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
            <h2 className="text-lg font-semibold text-gray-400">Total Customers</h2>
            <p className="text-4xl font-bold">{customerCount}</p>
          </div>
          <KeyMetrics />
          <RecentlyPaid />
        </div>

      </div>
    </div>
  )
}
