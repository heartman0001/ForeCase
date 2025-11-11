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

  // ✅ Search & Pagination state
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

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

  // ✅ Filter projects by search term
  const filteredProjects = projects.filter(
    (p) =>
      p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customers?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sale_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pm_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">จัดการข้อมูลโครงการ</h1>

          {/* Search Box */}
          <input
            type="text"
            placeholder="🔍 ค้นหาโครงการ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2b71ed]"
          />

          <button
            onClick={() => {
              setSelectedProject(null)
              setIsModalOpen(true)
            }}
            className="bg-[#2b71ed] text-white px-4 py-2 rounded-md hover:bg-[#2826a9] transition"
          >
            + เพิ่มโครงการ
          </button>
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : filteredProjects.length === 0 ? (
          <p>ไม่พบข้อมูลโครงการ</p>
        ) : (
          <>
            <table className="w-full border text-sm">
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
                {currentProjects.map((p) => (
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

            {/* ✅ Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                ◀ ก่อนหน้า
              </button>
              <span>
                หน้า {currentPage} จาก {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              >
                ถัดไป ▶
              </button>
            </div>
          </>
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
