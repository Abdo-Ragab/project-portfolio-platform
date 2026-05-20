import React, { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

const initialAppeals = [
  {
    id: 1, type: 'FLAG', date: 'May 1, 2026',
    student: 'Sara Mostafa',
    message: 'My Smart Campus Navigator project description contains content that may violate academic integrity guidelines. I have reviewed the description and believe it accurately represents my original work and properly cites all external resources used.',
    project: 'Smart Campus Navigator',
    projectId: 'p1',
    status: 'pending',
  },
  {
    id: 2, type: 'FLAG', date: 'April 29, 2026',
    student: 'Ahmed Hassan',
    message: 'My AI Thesis Summarizer project was flagged for potential plagiarism, but the NLP algorithms in question were directly derived from published transformer model documentation as cited in my references and README. All code contributions are original implementations based on standard ML practices.',
    project: 'AI Thesis Summarizer',
    projectId: 'p2',
    status: 'pending',
  },
]

const typeColors = {
  'FLAG': 'bg-red-100 text-red-700',
}

const StudentAppeals = () => {
  const [appeals, setAppeals] = useState(initialAppeals)

  const resolve = (id) => {
    setAppeals(appeals.map(a => a.id === id ? { ...a, status: 'resolved' } : a))
    toast.success('Appeal marked as resolved')
  }

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Student Appeals</h1>
        <p className="text-gray-500 text-sm mb-6">Review and resolve academic disputes and moderation appeals from students.</p>

        <div className="flex flex-col gap-4">
          {appeals.map(a => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${typeColors[a.type]}`}>{a.type}</span>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                  <p className="font-semibold text-gray-800">Appeal by {a.student}</p>
                </div>
                {a.status === 'pending' ? (
                  <button
                    onClick={() => resolve(a.id)}
                    className="cursor-pointer text-sm px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">Resolved</span>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MessageSquare size={14} />
                  <span className="font-medium">Appeal Statement:</span>
                </div>
                <p className="text-sm text-gray-600">{a.message}</p>
              </div>

              <p className="text-xs text-gray-400">
                Related Project: <a href={`/projects/${a.projectId}`} className="text-indigo-500 cursor-pointer hover:underline">{a.project} ↗</a>
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentAppeals