import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'

import { courses } from '../../data/courses'
import { notifications } from '../../data/notifications'
import { projects } from '../../data/projects'
import toast from 'react-hot-toast'
import { Search, MoreVertical, Lock } from 'lucide-react'

const BACHELOR_ID = 'c5'

const getEnrolledCount = (courseId) => {
  const ids = new Set()
  projects.filter(p => p.courseId === courseId).forEach(p => {
    ids.add(p.creatorId)
    p.collaborators.forEach(c => ids.add(c))
  })
  return ids.size
}

// ─── Kebab menu ───────────────────────────────────────────────────────────────
const CourseMenu = ({ course, isLinked, isBachelor, isPending, onLink, onUnlink }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className='relative flex justify-end'>
      <button
        onClick={() => setOpen(o => !o)}
        className='flex items-center justify-center cursor-pointer hover:bg-[#F1F5F9] rounded transition-colors'
        style={{ width: 28, height: 28 }}
      >
        <MoreVertical className='w-4 h-4 text-[#99A1AF]' />
      </button>
      {open && (
        <>
          {/* Backdrop */}
          <div className='fixed inset-0 z-10' onClick={() => setOpen(false)} />
          <div
            className='absolute right-0 bottom-8 z-20 bg-white rounded-lg overflow-hidden'
            style={{ border: '0.667px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: 140 }}
          >
            {isBachelor ? (
              <div
                className='flex items-center gap-2 px-3 py-2'
                style={{ fontSize: 13, color: '#99A1AF', cursor: 'not-allowed' }}
              >
                <Lock className='w-3.5 h-3.5' />
                Auto-linked
              </div>
            ) : isPending ? (
              <div className='px-3 py-2' style={{ fontSize: 13, color: '#F59E0B' }}>
                Pending approval…
              </div>
            ) : isLinked ? (
              <button
                onClick={() => { onUnlink(course); setOpen(false) }}
                className='w-full text-left px-3 py-2 hover:bg-red-50 transition-colors cursor-pointer'
                style={{ fontSize: 13, color: '#EF4444' }}
              >
                Request Unlink
              </button>
            ) : (
              <button
                onClick={() => { onLink(course); setOpen(false) }}
                className='w-full text-left px-3 py-2 hover:bg-[#EEF2FF] transition-colors cursor-pointer'
                style={{ fontSize: 13, color: '#432DD7' }}
              >
                Request Link
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const InstructorCoursesPage = () => {
  const { user } = useAuth()
  const [search,          setSearch]          = useState('')
  const [pendingRequests, setPendingRequests] = useState([])

  const isBachelor  = (id) => id === BACHELOR_ID
  const isLinked    = (id) => (user.linkedCourses ?? []).includes(id)
  const isPending   = (id) => pendingRequests.some(r => r.courseId === id)

  const requestLink = (course) => {
    if (isLinked(course.id)) return
    setPendingRequests(prev => [...prev, { courseId: course.id, action: 'link' }])
    notifications.push({
      id: `n_link_${course.id}_${Date.now()}`, userId: 'a1', type: 'system',
      message: `${user.firstName} ${user.lastName} requested to link to ${course.name}.`,
      read: false, createdAt: new Date().toISOString().split('T')[0],
    })
    toast.success(`Link request sent for ${course.name}. Awaiting admin approval.`)
  }

  const requestUnlink = (course) => {
    if (!isLinked(course.id) || isBachelor(course.id)) return
    setPendingRequests(prev => [...prev, { courseId: course.id, action: 'unlink' }])
    notifications.push({
      id: `n_unlink_${course.id}_${Date.now()}`, userId: 'a1', type: 'system',
      message: `${user.firstName} ${user.lastName} requested to unlink from ${course.name}.`,
      read: false, createdAt: new Date().toISOString().split('T')[0],
    })
    toast.success(`Unlink request sent for ${course.name}. Awaiting admin approval.`)
  }

  // Only show courses instructor is linked to (design shows "My Courses" = linked courses)
  const visibleCourses = courses.filter(c =>
    isLinked(c.id) &&
    (c.code.toLowerCase().includes(search.toLowerCase()) ||
     c.name.toLowerCase().includes(search.toLowerCase()))
  )

  const COLS = '180px 1fr 200px 1fr 84px'
  const COL_HEADERS = ['Course ID', 'Course Name', 'Semester', 'Enrolled Students', '']

  return (
    <DashboardLayout tabs={INSTRUCTOR_TABS} secondaryTabs={INSTRUCTOR_TABS_SECONDARY}>
      <div className='p-8'>

        {/* Heading row with "Add Course" button */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
              My Courses
            </h1>
          </div>
        </div>

        {/* Search bar */}
        <div className='flex items-center gap-2 mb-6'>
          <div className='relative w-full'>
            <Search
              className='absolute text-[#99A1AF]'
              style={{ width: 16, height: 16, left: 12, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search courses...'
              className='w-full bg-white text-navy placeholder-[rgba(27,42,74,0.5)] outline-none'
              style={{
                border: '0.667px solid #E2E8F0', borderRadius: 6,
                padding: '8px 16px 8px 40px', fontSize: 14, height: 37.33,
              }}
            />
          </div>
        </div>

        {/* Single table — design shows all the instructor's linked courses together */}
        <div
          className='bg-white overflow-hidden'
          style={{ border: '0.667px solid #E2E8F0', borderRadius: 8 }}
        >
          {/* Column headers */}
          <div
            style={{
              display: 'grid', gridTemplateColumns: COLS,
              background: '#F9FAFB', borderBottom: '0.667px solid #E2E8F0',
              padding: '12.67px 16px',
            }}
          >
            {COL_HEADERS.map((col, i) => (
              <p
                key={i}
                style={{
                  fontSize: 12, fontWeight: 700, color: '#6A7282',
                  letterSpacing: '0.6px', textTransform: 'uppercase',
                }}
              >
                {col}
              </p>
            ))}
          </div>

          {/* Rows */}
          {visibleCourses.length === 0 ? (
            <div className='flex items-center justify-center py-10'>
              <p style={{ fontSize: 14, color: '#6A7282' }}>
                {search ? 'No courses match your search.' : 'You are not linked to any courses yet.'}
              </p>
            </div>
          ) : (
            visibleCourses.map((course, idx) => {
              const enrolled  = getEnrolledCount(course.id)
              const isLast    = idx === visibleCourses.length - 1
              const semester  = course.id === 'c1' || course.id === 'c4' ? 'Fall 2025' : 'Spring 2026'
              return (
                <div
                  key={course.id}
                  style={{
                    display: 'grid', gridTemplateColumns: COLS,
                    padding: '16.67px 16px', alignItems: 'center',
                    borderBottom: isLast ? 'none' : '0.667px solid #E2E8F0',
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1B2A4A' }}>{course.code}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#364153' }}>{course.name}</p>
                  <p style={{ fontSize: 14, color: '#6A7282' }}>{semester}</p>
                  {/* Enrolled students — icon + count matching design */}
                  <div className='flex items-center gap-2'>
                    <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                      <path d='M2 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4' stroke='#99A1AF' strokeWidth='1.33' strokeLinecap='round'/>
                      <circle cx='6' cy='5.5' r='2.5' stroke='#99A1AF' strokeWidth='1.33'/>
                      <path d='M12 9.5c1.4.4 2.5 1.7 2.5 3' stroke='#99A1AF' strokeWidth='1.33' strokeLinecap='round'/>
                      <path d='M10.5 5a2 2 0 1 1 0 .01' stroke='#99A1AF' strokeWidth='1.33' strokeLinecap='round'/>
                    </svg>
                    <p style={{ fontSize: 14, color: '#6A7282' }}>{enrolled}</p>
                  </div>
                  {/* Kebab menu */}
                  <CourseMenu
                    course={course}
                    isLinked={isLinked(course.id)}
                    isBachelor={isBachelor(course.id)}
                    isPending={isPending(course.id)}
                    onLink={requestLink}
                    onUnlink={requestUnlink}
                  />
                </div>
              )
            })
          )}
        </div>

        {/* Also show available (unlinked) courses below — for discoverability */}
        {(() => {
          const available = courses.filter(c =>
            !isLinked(c.id) &&
            (c.code.toLowerCase().includes(search.toLowerCase()) ||
             c.name.toLowerCase().includes(search.toLowerCase()))
          )
          if (available.length === 0) return null
          return (
            <div className='mt-8'>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>
                Available Courses
              </h2>
              <div
                className='bg-white overflow-hidden'
                style={{ border: '0.667px solid #E2E8F0', borderRadius: 8 }}
              >
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: COLS,
                    background: '#F9FAFB', borderBottom: '0.667px solid #E2E8F0',
                    padding: '12.67px 16px',
                  }}
                >
                  {COL_HEADERS.map((col, i) => (
                    <p key={i} style={{ fontSize: 12, fontWeight: 700, color: '#6A7282', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
                      {col}
                    </p>
                  ))}
                </div>
                {available.map((course, idx) => {
                  const enrolled = getEnrolledCount(course.id)
                  const isLast   = idx === available.length - 1
                  const semester = course.id === 'c1' || course.id === 'c4' ? 'Fall 2025' : 'Spring 2026'
                  return (
                    <div
                      key={course.id}
                      style={{
                        display: 'grid', gridTemplateColumns: COLS,
                        padding: '16.67px 16px', alignItems: 'center',
                        borderBottom: isLast ? 'none' : '0.667px solid #E2E8F0',
                      }}
                    >
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1B2A4A' }}>{course.code}</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#364153' }}>{course.name}</p>
                      <p style={{ fontSize: 14, color: '#6A7282' }}>{semester}</p>
                      <div className='flex items-center gap-2'>
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
                          <path d='M2 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4' stroke='#99A1AF' strokeWidth='1.33' strokeLinecap='round'/>
                          <circle cx='6' cy='5.5' r='2.5' stroke='#99A1AF' strokeWidth='1.33'/>
                          <path d='M12 9.5c1.4.4 2.5 1.7 2.5 3' stroke='#99A1AF' strokeWidth='1.33' strokeLinecap='round'/>
                          <path d='M10.5 5a2 2 0 1 1 0 .01' stroke='#99A1AF' strokeWidth='1.33' strokeLinecap='round'/>
                        </svg>
                        <p style={{ fontSize: 14, color: '#6A7282' }}>{enrolled}</p>
                      </div>
                      <CourseMenu
                        course={course}
                        isLinked={false}
                        isBachelor={isBachelor(course.id)}
                        isPending={isPending(course.id)}
                        onLink={requestLink}
                        onUnlink={requestUnlink}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}

      </div>
    </DashboardLayout>
  )
}

export default InstructorCoursesPage