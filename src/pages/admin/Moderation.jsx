import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, Users, BookOpen, Bell, ShieldAlert, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'

const initialProjects = [
  { id: 1, name: 'Smart Campus Navigator', student: 'Sara Ahmed',  status: 'active',   flagReason: null },
  { id: 2, name: 'AI Thesis Summarizer',   student: 'Omar Khalil', status: 'flagged',  flagReason: 'Suspected plagiarism from published paper' },
  { id: 3, name: 'NLP Chatbot',            student: 'Mona Tarek',  status: 'inactive', flagReason: null },
  { id: 4, name: 'Course Recommender',     student: 'Hany Samir',  status: 'flagged',  flagReason: 'Inappropriate content in description' },
  { id: 5, name: 'Campus Map App',         student: 'Layla Hassan',status: 'active',   flagReason: null },
]

const initialAppeals = [
  { id: 1, project: 'AI Thesis Summarizer', student: 'Omar Khalil', message: 'This is entirely our own work. We have references to prove it.', status: 'pending' },
  { id: 2, project: 'Course Recommender',   student: 'Hany Samir',  message: 'The description was misunderstood. We have revised it.',          status: 'resolved' },
]

const statusColors = {
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  flagged:  'bg-red-100 text-red-700',
}

const Moderation = () => {
  const [projects, setProjects]   = useState(initialProjects)
  const [appeals, setAppeals]     = useState(initialAppeals)
  const [activeTab, setActiveTab] = useState('projects')
  const [flagging, setFlagging]   = useState(null)
  const [flagReason, setFlagReason] = useState('')

  // ── TOGGLE activate / deactivate ────────────────────
  const toggleProject = (id) => {
    setProjects(projects.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'active' ? 'inactive' : 'active'
        toast.success(`Project ${newStatus}`)
        return { ...p, status: newStatus }
      }
      return p
    }))
  }

  // ── OPEN flag dialog ─────────────────────────────────
  const openFlag = (project) => {
    setFlagging(project)
    setFlagReason('')
  }

  // ── CONFIRM flag ─────────────────────────────────────
  const confirmFlag = () => {
    if (!flagReason.trim()) {
      toast.error('Please enter a reason')
      return
    }
    setProjects(projects.map(p =>
      p.id === flagging.id ? { ...p, status: 'flagged', flagReason } : p
    ))
    toast.success('Project flagged')
    setFlagging(null)
    setFlagReason('')
  }

  // ── RESOLVE appeal ───────────────────────────────────
  const resolveAppeal = (id) => {
    setAppeals(appeals.map(a =>
      a.id === id ? { ...a, status: 'resolved' } : a
    ))
    toast.success('Appeal marked as resolved')
  }

  const flaggedProjects = projects.filter(p => p.status === 'flagged')

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Moderation</h1>
        <p className="text-gray-500 mb-6">Flag, activate, and manage project visibility</p>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6">
          {['projects', 'flagged', 'appeals'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm capitalize border ${activeTab === tab ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {tab === 'flagged' ? `Flagged (${flaggedProjects.length})` : tab}
            </button>
          ))}
        </div>

        {/* ── ALL PROJECTS TAB ── */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Project</th>
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{project.name}</td>
                    <td className="px-5 py-3 text-gray-500">{project.student}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {/* Activate / Deactivate — only for active or inactive projects */}
                        {project.status !== 'flagged' && (
                          <button
                            onClick={() => toggleProject(project.id)}
                            className={`px-3 py-1 rounded-lg text-xs border ${project.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                          >
                            {project.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        {/* Flag — only for active projects */}
                        {project.status === 'active' && (
                          <button
                            onClick={() => openFlag(project)}
                            className="px-3 py-1 rounded-lg text-xs border border-orange-200 text-orange-600 hover:bg-orange-50"
                          >
                            Flag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── FLAGGED PROJECTS TAB ── */}
        {activeTab === 'flagged' && (
          <div className="flex flex-col gap-3">
            {flaggedProjects.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No flagged projects</div>
            ) : (
              flaggedProjects.map(project => (
                <div key={project.id} className="bg-white border border-red-100 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">{project.name}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Flagged</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Student: {project.student}</p>
                  <p className="text-sm text-red-600">Reason: {project.flagReason}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── APPEALS TAB ── */}
        {activeTab === 'appeals' && (
          <div className="flex flex-col gap-3">
            {appeals.map(appeal => (
              <div key={appeal.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{appeal.project}</p>
                    <p className="text-sm text-gray-500">{appeal.student}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${appeal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {appeal.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">"{appeal.message}"</p>
                {appeal.status === 'pending' && (
                  <button
                    onClick={() => resolveAppeal(appeal.id)}
                    className="px-4 py-1.5 rounded-lg text-xs border border-green-200 text-green-600 hover:bg-green-50"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── FLAG MODAL ── */}
      {flagging && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Flag Project</h2>
            <p className="text-sm text-gray-500 mb-4">Flagging: <span className="font-medium text-gray-700">{flagging.name}</span></p>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 resize-none"
              rows={3}
              placeholder="Enter reason for flagging..."
              value={flagReason}
              onChange={e => setFlagReason(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={confirmFlag}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
              >
                Confirm Flag
              </button>
              <button
                onClick={() => setFlagging(null)}
                className="border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}

export default Moderation