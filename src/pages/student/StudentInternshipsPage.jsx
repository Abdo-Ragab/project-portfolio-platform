import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipsContext'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { ArrowUpDown, Briefcase, Calendar, Clock, MapPin, Search, SlidersHorizontal, X } from 'lucide-react'
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

const ApplyModal = ({ internship, onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!coverLetter.trim()) { toast.error('Please write a cover letter.'); return }
    onSubmit(coverLetter)
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
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
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8]">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const InternshipRow = ({ internship, hasApplied, onApply, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all group"
  >
    <img src={employers.find((e) => e.id === internship.employerId)?.avatar} alt={internship.companyName} className="w-12 h-12 rounded-xl flex items-center justify-center"/>

    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-0.5">
        <p className="font-semibold text-[#432DD7] group-hover:underline truncate">{internship.title}</p>
        {internship.status === 'hiring' && (
          <span className="shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Actively Hiring</span>
        )}
      </div>
      <p className="text-sm text-[#0F172B] mb-2">{internship.companyName}</p>
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
        {internship.location && <span className="flex items-center gap-1"><MapPin size={11} /> {internship.location}</span>}
        {(internship.duration || internship.type) && (
          <span className="flex items-center gap-1"><Clock size={11} /> {[internship.duration, internship.type].filter(Boolean).join(' • ')}</span>
        )}
        {internship.postedAt && <span className="flex items-center gap-1"><Calendar size={11} /> Posted {timeAgo(internship.postedAt)}</span>}
      </div>
    </div>

    <div className="flex flex-col items-end ml-auto">
      {internship.skills?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-5">
          {internship.skills.slice(0, 3).map(s => (
            <span key={s} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">{s}</span>
          ))}
        </div>
      )}
      {hasApplied ? (
        <span className="text-sm font-medium bg-gray-200 text-gray-500 px-4 py-1.5 rounded-lg cursor-default">Applied</span>
      ) : (
        <button onClick={e => { e.stopPropagation(); onApply(internship) }}
          className="text-sm font-medium bg-[#432DD7] text-white px-4 py-1.5 rounded-lg hover:bg-[#3826b8] transition-colors">
          Apply Now
        </button>
      )}
    </div>
  </div>
)

const StudentInternshipsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { internships, applyToInternship } = useInternships()

  const [search,         setSearch]         = useState('')
  const [filterDuration, setFilterDuration] = useState('')
  const [filterCompany,  setFilterCompany]  = useState('')
  const [sortOrder,      setSortOrder]      = useState('newest')
  const [showFilters,    setShowFilters]    = useState(false)
  const [applyTarget,    setApplyTarget]    = useState(null)

  const durations = [...new Set(internships.map(i => i.duration).filter(Boolean))]
  const companies = [...new Set(internships.map(i => i.companyName).filter(Boolean))]

  const browseList = useMemo(() => {
    let list = internships.filter(i => !i.isArchived && i.status === 'hiring')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.companyName?.toLowerCase().includes(q))
    }
    if (filterDuration) list = list.filter(i => i.duration === filterDuration)
    if (filterCompany)  list = list.filter(i => i.companyName === filterCompany)
    list = [...list].sort((a, b) =>
      sortOrder === 'newest' ? new Date(b.postedAt) - new Date(a.postedAt) : new Date(a.postedAt) - new Date(b.postedAt)
    )
    return list
  }, [internships, search, filterDuration, filterCompany, sortOrder])

  const hasFilters = search || filterDuration || filterCompany || sortOrder !== 'newest'

  const handleSubmitApplication = (coverLetter) => {
    applyToInternship(applyTarget.id, user.id, coverLetter)
    setApplyTarget(null)
    toast.success(`Application submitted to ${applyTarget.companyName}!`)
  }

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0F172B]">Internships</h1>
          <p className="text-sm text-gray-400">Showing {browseList.length} open position{browseList.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search internships by title or company..."
              className="w-full pl-9 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
          </div>
          <button onClick={() => setShowFilters(f => !f)}
            className={`p-2.5 border rounded-lg transition-colors ${showFilters || hasFilters ? 'border-[#432DD7] text-[#432DD7] bg-[#EEF2FF]' : 'border-[#E2E8F0] text-gray-400 hover:text-[#432DD7] hover:border-[#432DD7]'}`}>
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 flex-wrap">
            <select value={filterDuration} onChange={e => setFilterDuration(e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#45556C] bg-white focus:outline-none focus:ring-2 focus:ring-[#432DD7]">
              <option value="">All Durations</option>
              {durations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#45556C] bg-white focus:outline-none focus:ring-2 focus:ring-[#432DD7]">
              <option value="">All Companies</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-2 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#45556C] bg-white hover:bg-gray-50">
              <ArrowUpDown size={14} /> {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
            {hasFilters && (
              <button onClick={() => { setSearch(''); setFilterDuration(''); setFilterCompany(''); setSortOrder('newest') }}
                className="text-sm text-[#432DD7] hover:underline flex items-center gap-1">
                <X size={13} /> Clear
              </button>
            )}
          </div>
        )}

        {browseList.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <Briefcase size={40} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No internships match your search</p>
          </div>
        ) : (
          <div className="space-y-3">
            {browseList.map(int => (
              <InternshipRow key={int.id} internship={int}
                hasApplied={int.applicants.some(a => a.studentId === user.id)}
                onApply={setApplyTarget}
                onClick={() => navigate(`/student/internships/${int.id}`)} />
            ))}
          </div>
        )}
      </div>

      {applyTarget && (
        <ApplyModal internship={applyTarget} onClose={() => setApplyTarget(null)} onSubmit={handleSubmitApplication} />
      )}
    </DashboardLayout>
  )
}

export default StudentInternshipsPage
