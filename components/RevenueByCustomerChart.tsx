
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getInstallments } from '../services/installmentService'
import { getProjects } from '../services/projectService'
import { Installment, Project } from '../types'

interface ChartData {
  name: string
  revenue: number
}

const RevenueByCustomerChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [installments, projects] = await Promise.all([
            getInstallments(),
            getProjects()
        ]);

        const projectCustomerMap = projects.reduce((acc, project) => {
            if (project.customers) {
                acc[project.id] = project.customers.customer_name;
            }
            return acc;
        }, {} as Record<number, string>);

        const revenueByCustomer = installments.reduce((acc, installment) => {
          const customerName = projectCustomerMap[installment.project_id] || 'Unknown Customer';
          const amount = installment.amount || 0
          
          if (!acc[customerName]) {
            acc[customerName] = 0
          }
          acc[customerName] += amount
          return acc
        }, {} as Record<string, number>)

        const formattedData = Object.entries(revenueByCustomer).map(([name, revenue]) => ({
          name,
          revenue,
        })).sort((a, b) => b.revenue - a.revenue); // Sort by revenue descending

        setChartData(formattedData)
      } catch (err) {
        setError('Failed to fetch revenue data by customer')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-500">{error}</div>
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-full flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-4">Revenue by Customer</h2>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
        >
            <defs>
                <linearGradient id="colorRevenueCustomer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4299e1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4299e1" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: '#a0aec0' }} 
                angle={-45}
                textAnchor="end"
                interval={0}
            />
            <YAxis type="number" tick={{ fill: '#a0aec0' }} tickFormatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' }).format(value)} />
            <Tooltip
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            contentStyle={{
                backgroundColor: '#2d3748',
                borderColor: '#4a5568',
                color: '#e2e8f0',
            }}
            formatter={(value: number) => [new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value), 'Revenue']}
            />
            <Legend />
            <Bar dataKey="revenue" fill="url(#colorRevenueCustomer)" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default RevenueByCustomerChart
