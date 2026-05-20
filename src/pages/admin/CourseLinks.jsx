import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { BookOpen, X } from 'lucide-react'
import toast from 'react-hot-toast'

const initialRequests = [
  { id: 1, instructor: 'Dr. Ahmed Hassan', course: 'CSEN901: Bachelor Thesis', date: 'May 3, 2026', status: 'pending' },
  { id: 2, instructor: 'Dr. Mona Nabil',   course: 'CSEN703: Security',        date: 'May 2, 2026', status: 'pending' },
  { id: 3, instructor: 'Dr. Layla Hassan', course: 'CSEN601: Networks',        date: 'Apr 30, 2026', status: 'approved' },
]

const CourseLinks = () => {
  const [requests, setRequests]     = useState(initialRequests)
  const [confirm, setConfirm]       = useState(null) // { id, decision }
  const [lastAction, setLastAction] = useState(null) // for undo

  const handleDecision = (id, decision) => {
    const prev = requests.find(r => r.id === id)
    setRequests(requests.map(r => r.id === id ? { ...r, status: decision } : r))
    setLastAction({ id, prevStatus: prev.status, decision })
    setConfirm(null)

    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Request <strong>{decision}</strong></span>
        <button
          onClick={() => {
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: prev.status } : r))
            toast.dismiss(t.id)
            toast.success('Action undone')
          }}
          className="text-indigo-600 font-semibold text-sm underline"
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 })
  }

  const requestingItem = confirm ? requests.find(r => r.id === confirm.id) : null

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Course Link Requests</h1>
        <p className="text-gray-500 text-sm mb-6">Review requests from instructors to be linked as mentors for specific courses.</p>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-4 mb-6 flex gap-3">
          <span className="text-indigo-500 mt-0.5">ℹ</span>
          <div>
            <p className="text-sm font-semibold text-indigo-700">Why do instructors need approval?</p>
            <p className="text-sm text-indigo-500">To maintain data integrity, instructors must be verified before they can create mentored projects under official university course codes.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Instructor</th>
                <th className="px-6 py-3 font-medium text-center">Requested Course</th>
                <th className="px-6 py-3 font-medium text-center">Date</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
                <th className="px-6 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{r.instructor}</td>
                  <td className="px-6 py-3 text-gray-500 text-center flex items-center justify-center gap-2">
                    <BookOpen size={14} className="text-gray-400"/>{r.course}
                  </td>
                  <td className="px-6 py-3 text-gray-400 text-center">{r.date}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {r.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setConfirm({ id: r.id, decision: 'approved' })} className="text-xs px-3 py-1 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 cursor-pointer">Approve</button>
                        <button onClick={() => setConfirm({ id: r.id, decision: 'rejected' })} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer">Reject</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirm({ id: r.id, decision: 'pending' })}
                        className="cursor-pointer text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        Revert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirm && requestingItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Confirm Action</h2>
              <button onClick={() => setConfirm(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to <strong>{confirm.decision === 'pending' ? 'revert' : confirm.decision}</strong> the request from <strong>{requestingItem.instructor}</strong> for <strong>{requestingItem.course}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDecision(confirm.id, confirm.decision)}
                className={`cursor-pointer flex-1 py-2 rounded-lg text-sm font-medium text-white ${confirm.decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : confirm.decision === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                Yes, {confirm.decision === 'pending' ? 'Revert' : confirm.decision.charAt(0).toUpperCase() + confirm.decision.slice(1)}
              </button>
              <button onClick={() => setConfirm(null)} className="cursor-pointer flex-1 py-2 rounded-lg text-sm border border-gray-200 hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CourseLinks