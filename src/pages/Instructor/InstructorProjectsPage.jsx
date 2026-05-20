import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { projects } from '../../data/projects'
import { courses } from '../../data/courses'
import { students } from '../../data/users'
import { useNavigate } from 'react-router'
import { Search, Check, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const formatDate = (dateStr) => {
  const d    = new Date(dateStr)
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0)  return 'Today'
  if (diff === 1)  return '1 day ago'
  if (diff < 7)    return `${diff} days ago`
  if (diff < 14)   return '1 week ago'
  return `${Math.floor(diff / 7)} weeks ago`
}

const InstructorProjectsPage = () => {
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState('all') // 'all' | 'pending' | 'reviewed'
  const [, forceUpdate] = useState(0)

  const supervised = projects
    .filter(p => p.instructorIds.includes(user.id))
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => {
      const hasFeedback = (p.generalFeedback ?? []).some(f => f.instructorId === user.id)
      if (filter === 'pending')  return !hasFeedback
      if (filter === 'reviewed') return hasFeedback
      return true
    })

  const pendingCount = projects
    .filter(p => p.instructorIds.includes(user.id))
    .filter(p => !(p.generalFeedback ?? []).some(f => f.instructorId === user.id))
    .length

  const handleApprove = (e, project) => {
    e.stopPropagation()
    if (!(project.generalFeedback ?? []).some(f => f.instructorId === user.id)) {
      project.generalFeedback = [
        ...(project.generalFeedback ?? []),
        { instructorId: user.id, comment: 'Approved.', createdAt: new Date().toISOString().split('T')[0] },
      ]
      forceUpdate(n => n + 1)
      toast.success(`Approved: ${project.title}`)
    }
  }

  const handleReject = (e, project) => {
    e.stopPropagation()
    project.isFlagged = true
    project.isActive  = false
    forceUpdate(n => n + 1)
    toast.error(`Flagged: ${project.title}`)
  }

  const COLS = '1fr 134px 180px 147px 250px'

  return (
    <DashboardLayout tabs={INSTRUCTOR_TABS} secondaryTabs={INSTRUCTOR_TABS_SECONDARY}>
      <div className='p-8'>

        {/* Heading — title + pending count side-by-side (matches design) */}
        <div className='flex items-baseline gap-4 mb-6'>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
            Review Projects
          </h1>
          <p style={{ fontSize: 14, color: '#6A7282' }}>
            {pendingCount} Pending Reviews
          </p>
        </div>

        {/* Search + dropdown filter */}
        <div className='flex items-center gap-2 mb-6'>
          <div className='relative' style={{ flex: 1 }}>
            <Search
              className='absolute text-[#99A1AF]'
              style={{ width: 16, height: 16, left: 12, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search projects...'
              className='w-full bg-white text-[#1B2A4A] placeholder-[rgba(27,42,74,0.5)] outline-none'
              style={{
                border: '0.667px solid #E2E8F0', borderRadius: 6,
                padding: '8px 16px 8px 40px', fontSize: 14, height: 37.33,
              }}
            />
          </div>
          {/* Dropdown — styled to match design's border/height */}
          <div className='relative'>
              <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className='h-full cursor-pointer w-36.5 px-3 py-2 pr-10 border border-[#E2E8F0] rounded-lg text-sm text-[#4A5565] outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 bg-white appearance-none'
              >
                  <option value='all'>All</option>
                  <option value='pending'>Pending</option>
                  <option value='reviewed'>Reviewed</option>
              </select>
              <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
          </div>
        </div>

        {/* Table */}
        <div
          className='bg-white overflow-hidden'
          style={{ border: '0.667px solid #E2E8F0', borderRadius: 8 }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid', gridTemplateColumns: COLS,
              background: '#F9FAFB', borderBottom: '0.667px solid #E2E8F0',
              padding: '12.67px 16px',
            }}
          >
            {['Project', 'Course', 'Submitted By', 'Date', 'Actions'].map((col, i) => (
              <p
                key={col}
                style={{
                  fontSize: 12, fontWeight: 700, color: '#6A7282',
                  letterSpacing: '0.6px', textTransform: 'uppercase',
                  textAlign: i === 4 ? 'right' : 'left',
                }}
              >
                {col}
              </p>
            ))}
          </div>

          {/* Rows */}
          {supervised.length === 0 ? (
            <div className='flex items-center justify-center py-12'>
              <p style={{ fontSize: 14, color: '#6A7282' }}>No projects match your filters.</p>
            </div>
          ) : (
            supervised.map((project, idx) => {
              const course      = courses.find(c => c.id === project.courseId)
              const creator     = students.find(s => s.id === project.creatorId)
              const hasFeedback = (project.generalFeedback ?? []).some(f => f.instructorId === user.id)
              const isLast      = idx === supervised.length - 1

              return (
                <div
                  key={project.id}
                  className='hover:bg-[#F9FAFB] transition-colors'
                  style={{
                    display: 'grid', gridTemplateColumns: COLS,
                    padding: '21.33px 16px', alignItems: 'center',
                    borderBottom: isLast ? 'none' : '0.667px solid #E2E8F0',
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#1B2A4A' }}>{project.title}</p>
                  <p style={{ fontSize: 14, color: '#364153' }}>{course?.code ?? '—'}</p>
                  <p style={{ fontSize: 14, color: '#6A7282' }}>
                    {creator ? `${creator.firstName} ${creator.lastName}` : '—'}
                  </p>
                  <p style={{ fontSize: 14, color: '#6A7282' }}>{formatDate(project.createdAt)}</p>

                  {/* Actions — right aligned, three buttons */}
                  <div
                    className='flex items-center gap-2 justify-end'
                    onClick={e => e.stopPropagation()}
                  >
                    {/* View Details */}
                    <button
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className='bg-white hover:bg-[#F9FAFB] text-center transition-colors cursor-pointer'
                      style={{
                        border: '0.667px solid #E2E8F0', borderRadius: 4,
                        padding: '8px 12px', fontSize: 12, fontWeight: 500,
                        color: '#364153'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default InstructorProjectsPage