import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipsContext'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { Briefcase, Clock, ExternalLink, MapPin, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { employers } from '../../data/users'

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const STATUS_CONFIG = {
  pending:   { label: 'UNDER REVIEW',  dot: 'bg-amber-400',  style: 'text-amber-600 bg-amber-50 border border-amber-200' },
  nominated: { label: 'INTERVIEWING',  dot: 'bg-blue-400',   style: 'text-blue-600 bg-blue-50 border border-blue-200' },
  accepted:  { label: 'ACCEPTED',      dot: 'bg-green-400',  style: 'text-green-600 bg-green-50 border border-green-200' },
  rejected:  { label: 'NOT SELECTED',  dot: 'bg-red-400',    style: 'text-red-600 bg-red-50 border border-red-200' },
}

const StudentApplicationsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { internships, withdrawApplication } = useInternships()

  const [withdrawTarget, setWithdrawTarget] = useState(null)

  const myApplications = internships
    .map(int => ({ internship: int, application: int.applicants.find(a => a.studentId === user.id) }))
    .filter(({ application }) => Boolean(application))
    .sort((a, b) => new Date(b.application.appliedAt) - new Date(a.application.appliedAt))

  const handleWithdraw = () => {
    withdrawApplication(withdrawTarget.id, user.id)
    setWithdrawTarget(null)
    toast('Application withdrawn.', { icon: '↩️' })
  }

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6 space-y-5">

        <div>
          <h1 className="text-2xl font-bold text-[#0F172B]">My Applications</h1>
          <p className="text-sm text-gray-400 mt-1">Track the status of your internship applications.</p>
        </div>

        {myApplications.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Briefcase size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1">Browse internships and apply to get started.</p>
            <button onClick={() => navigate('/student/internships')}
              className="mt-4 px-4 py-2 bg-[#432DD7] text-white text-sm rounded-lg hover:bg-[#3826b8] transition-colors">
              Browse Internships
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden divide-y divide-[#E2E8F0]">
            {myApplications.map(({ internship, application }) => {
              const cfg = STATUS_CONFIG[application.status] || STATUS_CONFIG.pending
              return (
                <div key={internship.id} className="flex items-center gap-4 px-6 py-4">

                  {/* Company avatar */}
                  <img src={employers.find(e => e.id === internship.employerId)?.avatar} alt={`${internship.companyName} logo`} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172B] truncate">{internship.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-sm text-[#45556C]">
                      <span>{internship.companyName}</span>
                      {internship.location && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={11} /> {internship.location}
                        </span>
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock size={11} /> Applied on {formatDate(application.appliedAt)}
                    </p>
                  </div>

                  {/* Status + actions */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.style}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/student/internships/${internship.id}`)}
                        className="cursor-pointer flex items-center gap-1 text-xs text-[#432DD7] hover:underline"
                      >
                        View Listing <ExternalLink size={11} />
                      </button>
                      {application.status === 'pending' && (
                        <button onClick={() => setWithdrawTarget(internship)}
                          className="cursor-pointer text-xs text-gray-400 hover:text-red-500 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Withdraw confirmation */}
      {withdrawTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="font-semibold text-[#0F172B] mb-1">Withdraw Application?</h3>
            <p className="text-sm text-[#45556C] mb-6">
              Are you sure you want to withdraw your application for <span className="font-medium text-[#0F172B]">{withdrawTarget.title}</span> at {withdrawTarget.companyName}?
            </p>
            <div className="flex flex-col gap-2">
              <button onClick={handleWithdraw} className="w-full py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                Yes, withdraw my application
              </button>
              <button onClick={() => setWithdrawTarget(null)} className="w-full py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentApplicationsPage
