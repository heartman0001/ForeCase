// pages/NotificationsPage.tsx
import React, { useEffect, useState } from 'react'
import {
  getNotifications,
  markAsRead,
  deleteNotification
} from '../services/notificationService'
import { useAuth } from '../context/AuthContext'
import { Notification } from '../types'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadNotifications()
  }, [user])

  async function loadNotifications() {
    try {
      setLoading(true)
      const data = await getNotifications(user?.id)
      setNotifications(data)
    } catch (err) {
      console.error('❌ Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkAsRead(id: number) {
    await markAsRead(id)
    await loadNotifications()
  }

  async function handleDelete(id: number) {
    if (!window.confirm('ต้องการลบการแจ้งเตือนนี้หรือไม่?')) return
    await deleteNotification(id)
    await loadNotifications()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🔔 การแจ้งเตือน
        </h1>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีการแจ้งเตือน</p>
        ) : (
          <ul className="divide-y">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`flex justify-between items-start p-4 transition ${
                  n.is_read ? 'bg-gray-50' : 'bg-yellow-50'
                }`}
              >
                <div>
                  <p className="font-medium">{n.message}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    กำหนดชำระ: {n.due_date ? new Date(n.due_date).toLocaleDateString('th-TH') : '-'}
                  </p>
                  {n.invoice_records && n.invoice_records.length > 0 && (
                    <p className="text-sm text-gray-400">
                      สถานะใบแจ้งหนี้: {n.invoice_records[0].status}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 items-center">
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-blue-600 hover:underline"
                    >
                      ทำเครื่องหมายว่าอ่านแล้ว
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-red-500 hover:underline"
                  >
                    ลบ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
