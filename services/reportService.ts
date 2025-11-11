import { supabase } from '../lib/supabaseClient'

export async function getFilteredReports(
  startDate: string | null = null,
  endDate: string | null = null,
  status: string | null = null
) {
  let query = supabase.from('v_monthly_report').select('*')

  if (startDate && endDate) {
    query = query.gte('billing_date', startDate).lte('billing_date', endDate)
  }

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  query = query.order('billing_date', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data
}

// This function is no longer needed as getFilteredReports is more flexible
// export async function getMonthlyReport(month: number, year: number) {
//   // คำนวณวันสุดท้ายของเดือน
//   const lastDay = new Date(year, month, 0).getDate() // month เป็น 1-based
//   const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
//   const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`

//   const { data, error } = await supabase
//     .from('v_monthly_report')
//     .select('*')
//     .gte('billing_date', startDate)
//     .lte('billing_date', endDate)
//     .order('billing_date', { ascending: true })

//   if (error) throw error
//   return data
// }
