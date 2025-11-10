// pages/ProjectsPage.tsx
import React, { useEffect, useState } from 'react'
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from '../services/projectService'
import ProjectFormModal from '../components/ProjectFormModal'
import { Project } from '../types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddProject(data: Omit<Project, 'id'>) {
    await addProject(data)
    await loadProjects()
  }

  async function handleUpdateProject(data: Omit<Project, 'id'>) {
    if (!selectedProject) return
    await updateProject(selectedProject.id, data)
    setSelectedProject(null)
    await loadProjects()
  }

  async function handleDeleteProject(id: number) {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโครงการนี้?')) {
      await deleteProject(id)
      await loadProjects()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลโครงการ</h1>
          <button
            onClick={() => {
              setSelectedProject(null)
              setIsModalOpen(true)
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + เพิ่มโครงการ
          </button>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : projects.length === 0 ? (
          <p>ยังไม่มีข้อมูลโครงการ</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ชื่อโครงการ</th>
                <th className="p-2 text-left">ลูกค้า</th>
                <th className="p-2 text-left">Sale</th>
                <th className="p-2 text-left">PM</th>
                <th className="p-2 text-left">เฟสทั้งหมด</th>
                <th className="p-2 text-left">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{p.project_name}</td>
                  <td className="p-2">{p.customers?.customer_name || '-'}</td>
                  <td className="p-2">{p.sale_name || '-'}</td>
                  <td className="p-2">{p.pm_name || '-'}</td>
                  <td className="p-2">{p.phase_total}</td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setSelectedProject(p)
                        setIsModalOpen(true)
                      }}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Modal ฟอร์ม */}
      {isModalOpen && (
        <ProjectFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={selectedProject ? handleUpdateProject : handleAddProject}
          initialData={selectedProject}
        />
      )}
    </div>
  )
}
