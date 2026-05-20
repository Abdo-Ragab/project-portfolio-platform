import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

const initialProjects = [
  {
    id: 1,
    project: 'Smart Campus Navigator',
    projectId: 'p1',
    flaggedBy: 'Sara Kamel (Instructor)',
    reason: 'Academic integrity violation detected in project description.',
    date: 'Today',
    status: 'active',
    student: 'Ahmed Hassan',
    course: 'CSEN603: Software Engineering',
    description: 'The project description contains content that may violate academic integrity guidelines. AR-powered campus navigation overlays appear to reference unreleased academic research without proper attribution.',
    similarity: '78% similarity detected',
  },
  {
    id: 2,
    project: 'GUC Marketplace',
    projectId: 'p4',
    flaggedBy: 'System Admin',
    reason: 'Violates university community guidelines.',
    date: 'May 1, 2026',
    status: 'active',
    student: 'Mona Nabil',
    course: 'DMET501: Media Engineering Lab',
    description: 'A marketplace platform containing unmoderated messaging features that could potentially expose students to inappropriate interactions. Recommend implementing content filtering and moderation before public deployment.',
    similarity: 'N/A',
  },
  {
    id: 3,
    project: 'Course Management System',
    projectId: 'p3',
    flaggedBy: 'Sara Kamel (Instructor)',
    reason: 'Direct copy of open source project without attribution.',
    date: 'Apr 28, 2026',
    status: 'inactive',
    student: 'Sara Mostafa',
    course: 'CSEN603: Software Engineering',
    description: 'The project UI and database schema were found to be a direct copy of an open source course management template without any modifications or proper attribution in the README.',
    similarity: '91% similarity detected',
  },
]

const FlaggedProjects = () => {
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)

  const toggleStatus = (id) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        const next = p.status === 'active' ? 'inactive' : 'active'
        toast.success(`Project ${next === 'inactive' ? 'deactivated' : 'reactivated'}`)
        return { ...p, status: next }
      }
      return p
    }))
    if (selected?.id === id) {
      setSelected(prev => ({ ...prev, status: prev.status === 'active' ? 'inactive' : 'active' }))
    }
  }

  const filtered = projects.filter(p =>
    p.project.toLowerCase().includes(search.toLowerCase()) ||
    p.flaggedBy.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Flagged Projects</h1>
        <p className="text-gray-500 text-sm mb-6">Review and act on projects that have been flagged for violations.</p>

        <input
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-5 outline-none"
          placeholder="Search flagged items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Flagged By</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    <a href={`/projects/${p.projectId}`} className="text-indigo-600 hover:underline cursor-pointer">{p.project}</a>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{p.flaggedBy}</td>
                  <td className="px-6 py-3 text-gray-500 max-w-xs truncate">{p.reason}</td>
                  <td className="px-6 py-3 text-gray-400">{p.date}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => setSelected(p)}
                        className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`cursor-pointer text-xs px-3 py-1 rounded-lg border font-medium ${
                          p.status === 'active'
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {p.status === 'active' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{selected.project}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Student</p>
                <p className="text-sm font-medium text-gray-700">{selected.student}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Course</p>
                <p className="text-sm font-medium text-gray-700">{selected.course}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Flagged By</p>
                <p className="text-sm font-medium text-gray-700">{selected.flaggedBy}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Similarity</p>
                <p className="text-sm font-medium text-red-600">{selected.similarity}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
              <p className="text-xs font-semibold text-red-600 mb-1">Flag Reason</p>
              <p className="text-sm text-red-700">{selected.reason}</p>
            </div>

            <p className="text-sm text-gray-600 mb-5">{selected.description}</p>

            <div className="flex gap-2">
              <button
                onClick={() => toggleStatus(selected.id)}
                className={`cursor-pointer flex-1 py-2 rounded-lg text-sm font-medium ${
                  selected.status === 'active'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selected.status === 'active' ? 'Deactivate Project' : 'Reactivate Project'}
              </button>
              <button
                onClick={() => setSelected(null)}
                className="cursor-pointer flex-1 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default FlaggedProjects