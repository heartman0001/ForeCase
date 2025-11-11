import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getInstallments } from '../services/installmentService'
import { Installment } from '../types'

interface ChartData {
  name: string
  revenue: number
  count: number
}

const RevenueByProjectChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const installments = await getInstallments()

        const revenueByProject = installments.reduce((acc, installment) => {
          const projectName = installment.projects?.project_name || 'Unknown Project'
          const amount = installment.amount || 0
          
          if (!acc[projectName]) {
            acc[projectName] = { revenue: 0, count: 0 };
          }
          acc[projectName].revenue += amount;
          acc[projectName].count += 1;
          return acc
        }, {} as Record<string, { revenue: number; count: number }>)

        const formattedData = Object.entries(revenueByProject).map(([name, data]) => ({
          name,
          revenue: data.revenue,
          count: data.count,
        })).sort((a, b) => b.revenue - a.revenue)

        setChartData(formattedData)
      } catch (err) {
        setError('Failed to fetch revenue data by project')
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
    <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col">
      <h2 className="text-xl font-semibold text-[#2826a9] mb-4">Revenue by Project</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 100 }}
        >
          <defs>
            <linearGradient id="colorRevenueProject" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2b71ed" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#2826a9" stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(40, 38, 169, 0.1)" />
          <XAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: '#4a5568' }} 
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            type="number" 
            tick={{ fill: '#4a5568' }} 
            tickFormatter={(value) => 
              new Intl.NumberFormat('th-TH', { 
                style: 'currency', 
                currency: 'THB', 
                notation: 'compact', 
                compactDisplay: 'short' 
              }).format(value)
            } 
          />
          <Tooltip
            cursor={{ fill: 'rgba(43, 113, 237, 0.05)' }}
            contentStyle={{
              backgroundColor: '#f8fafc',
              borderColor: '#2b71ed',
              color: '#1a202c',
            }}
            formatter={(value: number, name: string, entry: any) => {
              const { count } = entry.payload;
              const formattedRevenue = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
              return [`${formattedRevenue} (${count} installments)`, 'Revenue'];
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="url(#colorRevenueProject)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueByProjectChart
