import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'


export default function PaymentCalendarPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data, error } = await supabase
      .from('invoice_records')
      .select(`
        id, status, billing_date, expected_collection_date, payment_date, amount,
        customers ( customer_name ), projects ( project_name )
      `)
    if (error) throw error

    const eventData = data.map(inv => ({
      id: inv.id,
      title: `${inv.customers?.customer_name || 'ไม่ทราบลูกค้า'} (${inv.projects?.project_name || '-'})`,
      start: inv.expected_collection_date || inv.billing_date,
      color: getStatusColor(inv.status),
    }))
    setEvents(eventData)
  }

  function getStatusColor(status) {
    switch (status) {
      case 'Pending': return '#facc15'
      case 'Billed': return '#3b82f6'
      case 'Paid': return '#22c55e'
      case 'Overdue': return '#ef4444'
      default: return '#9ca3af'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2826a9] mb-4">📅 ปฏิทินการเก็บเงิน</h1>
      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={(info) => {
            alert(`บริษัท: ${info.event.title}\nสถานะ: ${info.event.extendedProps.status}`)
          }}
          height="auto"
        />
      </div>
    </div>
  )
}
