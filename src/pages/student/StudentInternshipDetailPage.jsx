import React, { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipsContext'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { ArrowLeft, Building2, Calendar, Clock, ExternalLink, MapPin, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { employers } from '../../data/users'

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return '1 day ago'
  if (diff < 7) return `${diff} days ago`
  const weeks = Math.floor(diff / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  nominated:'bg-blue-100 text-blue-700',
}

const ApplyModal = ({ internship, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!coverLetter.trim()) { toast.error('Please write a cover letter.'); return }
    onSubmit(coverLetter)
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <p className="font-semibold text-[#0F172B]">Apply for {internship.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">at {internship.companyName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">Cover Letter <span className="text-red-400">*</span></label>
            <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5}
              placeholder="Tell the employer why you're a great fit for this role..."
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
            <p className="text-xs text-gray-400 mt-1">{coverLetter.length} characters</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="cursor-pointer flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50">Cancel</button>
            <button type="submit" className="cursor-pointer flex-1 py-2.5 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8]">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const StudentInternshipDetailPage = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { internships, applyToInternship } = useInternships()

  const [showApplyModal, setShowApplyModal] = useState(false)

  const internship = internships.find(i => i.id === id)
  if (!internship) return <Navigate to="/student/internships" />

  const myApplication  = internship.applicants.find(a => a.studentId === user.id)
  const hasApplied     = Boolean(myApplication)
  const applicantCount = internship.applicants.length

  const handleSubmitApplication = (coverLetter) => {
    applyToInternship(internship.id, user.id, coverLetter)
    setShowApplyModal(false)
    toast.success(`Application submitted to ${internship.companyName}!`)
  }

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6 space-y-5">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="cursor-pointer flex items-center gap-1.5 text-sm text-[#45556C] hover:text-[#432DD7] transition-colors">
          <ArrowLeft size={15} /> Back
        </button>

        {/* ── Header card ── */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6 flex items-center gap-4">
          {/* Company avatar */}
          <img src={employers.find(e => e.id === internship.employerId)?.avatar} alt={`${internship.companyName} logo`} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h1 className="text-xl font-bold text-[#0F172B]">{internship.title}</h1>
              {internship.status === 'hiring' && (
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide shrink-0">Currently Hiring</span>
              )}
            </div>
            <p className="text-sm font-semibold mb-2" style={{ color: internship.companyColor || '#432DD7' }}>
              {internship.companyName}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#45556C]">
              {internship.location && <span className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" /> {internship.location}</span>}
              {internship.duration && <span className="flex items-center gap-1"><Clock size={11} className="text-gray-400" /> {internship.duration} Duration</span>}
              {internship.deadline && <span className="flex items-center gap-1 text-red-500 font-medium"><Calendar size={11} /> Deadline: {internship.deadline}</span>}
              <span className="flex items-center gap-1 text-gray-400"><Calendar size={11} /> Posted {timeAgo(internship.postedAt)}</span>
              {applicantCount > 0 && <span className="flex items-center gap-1 text-gray-400"><Users size={11} /> {applicantCount} applicant{applicantCount !== 1 ? 's' : ''}</span>}
              {myApplication && <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[myApplication.status] || ''}`}>{myApplication.status}</span>}
            </div>
          </div>

          {/* Apply */}
          <div className="shrink-0">
            {hasApplied ? (
              <span className="text-sm font-medium bg-gray-200 text-gray-500 px-5 py-2 rounded-lg cursor-default">Applied</span>
            ) : (
              <button onClick={() => setShowApplyModal(true)}
                className="cursor-pointer text-sm font-semibold bg-[#432DD7] text-white px-6 py-2.5 rounded-lg hover:bg-[#3826b8] transition-colors">
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-[1fr_320px] gap-8 items-start">

          {/* Left: plain text sections, no cards */}
          <div className="space-y-6">

            {/* Overview */}
            <div>
              <h2 className="text-base font-bold text-[#0F172B] mb-2">Overview</h2>
              <p className="text-sm text-[#45556C] leading-relaxed">
                {internship.overview || internship.responsibilities}
              </p>
            </div>

            {/* Responsibilities */}
            {internship.responsibilitiesList?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-[#0F172B] mb-2">Responsibilities</p>
                <ul className="space-y-1.5">
                  {internship.responsibilitiesList.map((item, i) => (
                    <li key={i} className="text-sm text-[#45556C] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {(internship.skills?.length > 0 || internship.languages?.length > 0 || internship.requirementsList?.length > 0) && (
              <div>
                <h2 className="text-base font-bold text-[#0F172B] mb-3">Requirements</h2>
                {(internship.skills?.length > 0 || internship.languages?.length > 0) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[...(internship.skills || []), ...(internship.languages || [])].map((s, index) => (
                      <span key={index} className="text-xs border border-[#E2E8F0] text-[#45556C] px-3 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                )}
                {internship.requirementsList?.length > 0 && (
                  <ul className="space-y-1.5">
                    {internship.requirementsList.map((item, i) => (
                      <li key={i} className="text-sm text-[#45556C] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gray-300">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Right: About the Company card */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <Building2 size={11} className="text-gray-400" />
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">About the Company</p>
            </div>

            <div className="flex items-center gap-3 mb-2.5">
              <img src={employers.find(e => e.id === internship.employerId)?.avatar} alt={`${internship.companyName} logo`} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#0F172B]">{internship.companyName}</p>
                {internship.companyIndustry && (
                  <p className="text-xs text-gray-400">{internship.companyIndustry}</p>
                )}
              </div>
            </div>

            {internship.companyDescription && (
              <p className="text-xs text-gray-500 leading-relaxed mb-2.5">{internship.companyDescription}</p>
            )}
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal internship={internship} onClose={() => setShowApplyModal(false)} onSubmit={handleSubmitApplication} />
      )}
    </DashboardLayout>
  )
}

export default StudentInternshipDetailPage
