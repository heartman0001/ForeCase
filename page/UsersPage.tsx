// pages/UsersPage.tsx
import React, { useEffect, useState } from 'react'
import { getUsers, updateUser, deleteUser } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import { UserProfile } from '../types'

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editRoleUser, setEditRoleUser] = useState<string | null>(null)
  const [newRole, setNewRole] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      setLoading(true)
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleChangeRole(id: string) {
    if (!newRole) return alert('กรุณาเลือก Role ใหม่')
    await updateUser(id, { role: newRole })
    setEditRoleUser(null)
    setNewRole('')
    await loadUsers()
  }

  async function handleDeleteUser(id: string) {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) return
    await deleteUser(id)
    await loadUsers()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้ระบบ</h1>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : users.length === 0 ? (
          <p>ยังไม่มีผู้ใช้ในระบบ</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ชื่อผู้ใช้</th>
                <th className="p-2 text-left">อีเมล</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">วันที่สร้าง</th>
                <th className="p-2 text-left">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{u.display_name || '-'}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    {editRoleUser === u.id ? (
                      <div className="flex gap-2 items-center">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="border px-2 py-1 rounded-md"
                        >
                          <option value="">เลือก Role</option>
                          <option value="user">User</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleChangeRole(u.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          บันทึก
                        </button>
                      </div>
                    ) : (
                      <span>{u.role ?? '-'}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {new Date(u.created_at).toLocaleString('th-TH')}
                  </td>
                  <td className="p-2">
                    {editRoleUser === u.id ? (
                      <button
                        onClick={() => setEditRoleUser(null)}
                        className="text-gray-500 hover:underline"
                      >
                        ยกเลิก
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditRoleUser(u.id)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          แก้ไข Role
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:underline"
                          >
                            ลบ
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
