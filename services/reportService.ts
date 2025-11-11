import { supabase } from '../lib/supabaseClient'

export async function getMonthlyReport(month: number, year: number) {
  // คำนวณวันสุดท้ายของเดือน
  const lastDay = new Date(year, month, 0).getDate() // month เป็น 1-based
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
  const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`

  const { data, error } = await supabase
    .from('v_monthly_report')
    .select('*')
    .gte('billing_date', startDate)
    .lte('billing_date', endDate)
    .order('billing_date', { ascending: true })

  if (error) throw error
  return data
}
