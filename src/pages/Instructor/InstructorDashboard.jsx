import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { LayoutDashboard, BarChart2, UserCircle, BookOpen, FolderKanban, Mail, ChevronRight, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { projects } from '../../data/projects'
import { courses } from '../../data/courses'
import { students, instructors } from '../../data/users'
import { NavLink, useNavigate } from 'react-router'
import { INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'

const getRandomProjects = (allProjects, userId, count = 3) => {
  const publicProjects = allProjects.filter(p => p.visibility === 'public' && !p.instructorIds.includes(userId))
  const shuffled = [...publicProjects].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const StatCard = ({ label, value, sublabel, icon: Icon }) => (
  <div
    className='bg-white flex items-center justify-between'
    style={{ border: '0.667px solid #E2E8F0', borderRadius: 8, padding: 16 }}
  >
    <div className='flex flex-col gap-1'>
      <p style={{ fontSize: 12, fontWeight: 500, color: '#6A7282', lineHeight: '16px' }}>
        {label}
      </p>
      <div className='flex items-end gap-2 mt-1'>
        <span style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
          {value}
        </span>
        <span
          className='mb-1'
          style={{
            fontSize: 10, fontWeight: 500, color: '#00B4A6',
            background: 'rgba(0,180,166,0.1)', borderRadius: 4,
            padding: '1.67px 6px', whiteSpace: 'nowrap',
          }}
        >
          {sublabel}
        </span>
      </div>
    </div>
    <div
      className='flex items-center justify-center flex-shrink-0'
      style={{ width: 40, height: 40, background: '#F9FAFB', borderRadius: '50%' }}
    >
      <Icon className='w-5 h-5 text-[#99A1AF]' />
    </div>
  </div>
)

const InstructorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const myProjects    = projects.filter(p => p.instructorIds.includes(user.id) && p.isActive)
  const pending       = myProjects.filter(p => (p.generalFeedback ?? []).filter(f => f.instructorId === user.id).length === 0)
  const studentIds    = new Set(myProjects.flatMap(p => [p.creatorId, ...p.collaborators]))
  const totalStudents = studentIds.size
  const rated         = myProjects.filter(p => p.rating > 0)
  const avgRating     = rated.length
    ? (rated.reduce((a, p) => a + p.rating, 0) / rated.length).toFixed(1)
    : '—'

  const recommendedProjects = getRandomProjects(projects, user.id, 3)

  const stats = [
    { label: 'Active Supervised Projects', value: myProjects.length, sublabel: 'This semester',                                         icon: FolderKanban },
    { label: 'Pending Reviews',          value: pending.length,    sublabel: 'Requires action',                                        icon: BarChart2    },
    { label: 'Total Students',           value: totalStudents,     sublabel: `Across ${(user.linkedCourses ?? []).length} courses`,    icon: UserCircle   },
    { label: 'Avg Project Rating',       value: avgRating,         sublabel: 'Top 10%',                                               icon: BarChart2    },
  ]

  return (
    <DashboardLayout tabs={INSTRUCTOR_TABS} secondaryTabs={INSTRUCTOR_TABS_SECONDARY}>
      <div className='p-8'>

        {/* Page heading */}
        <div className='mb-8'>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
            Instructor Overview
          </h1>
          <p style={{ fontSize: 14, color: '#6A7282', marginTop: 4 }}>
            Welcome Dr. {user.lastName}. Here are your course and project updates.
          </p>
        </div>

        {/* Stats row */}
        <div className='grid grid-cols-4 gap-4 mb-8'>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* Pending Project Reviews table */}
        <div>
          {/* Table header row */}
          <div className='flex items-center justify-between mb-4'>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A', lineHeight: '24px' }}>
              Pending Project Reviews
            </h2>
            <div className='flex items-center gap-4'>
              {/* "View Course Statistics" link matches design — icon + text */}
              <NavLink
                to='/instructor/statistics'
                className='flex items-center gap-1 text-[#6A7282] hover:text-[#432DD7] transition-colors cursor-pointer'
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                <BarChart2 className='w-3.5 h-3.5' />
                View Course Statistics
              </NavLink>
              <NavLink
                to='/instructor/projects'
                className='hover:underline'
                style={{ fontSize: 12, fontWeight: 500, color: '#432DD7' }}
              >
                View All
              </NavLink>
            </div>
          </div>

          <div
            className='bg-white overflow-hidden'
            style={{ border: '0.667px solid #E2E8F0', borderRadius: 8 }}
          >
            {/* Table column headers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 100px',
                background: '#F9FAFB',
                borderBottom: '0.667px solid #E2E8F0',
                padding: '10.67px 16px',
              }}
            >
              {['Project Title', 'Course', 'Submitted By', ''].map((col, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 12, fontWeight: 700, color: '#6A7282',
                    textAlign: i === 3 ? 'right' : 'left',
                  }}
                >
                  {i === 3 ? 'Action' : col}
                </p>
              ))}
            </div>

            {/* Rows */}
            {pending.length === 0 ? (
              <div className='flex items-center justify-center py-8'>
                <p style={{ fontSize: 14, color: '#6A7282' }}>No pending reviews — all caught up!</p>
              </div>
            ) : (
              pending.slice(0, 5).map((project, idx) => {
                const course  = courses.find(c => c.id === project.courseId)
                const creator = students.find(s => s.id === project.creatorId)
                const isLast  = idx === Math.min(pending.length, 5) - 1
                return (
                  <div
                    key={project.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 100px',
                      padding: '15.33px 16px',
                      borderBottom: isLast ? 'none' : '0.667px solid #E2E8F0',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#1B2A4A' }}>{project.title}</p>
                    <p style={{ fontSize: 14, color: '#6A7282' }}>{course?.code ?? '—'}</p>
                    <p style={{ fontSize: 14, color: '#6A7282' }}>
                      {creator ? `${creator.firstName} ${creator.lastName}` : '—'}
                    </p>
                    {/* Action cell — right-aligned */}
                    <div className='flex justify-end'>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className='bg-white hover:bg-[#F9FAFB] transition-colors cursor-pointer'
                        style={{
                          border: '0.667px solid #E2E8F0', borderRadius: 4,
                          padding: '5.33px 12.67px', fontSize: 12, color: '#364153', fontWeight: 400,
                        }}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Recommended Projects */}
        <div className='mt-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A', lineHeight: '24px' }}>
              Recommended Projects
            </h2>
            <button 
              onClick={() => navigate('/projects')}
              className='cursor-pointer text-xs font-medium text-[#6A7282] hover:text-[#432DD7] transition-colors flex items-center gap-0.5'
            >
              View more <ChevronRight size={12} />
            </button>
          </div>
          <div className='grid grid-cols-3 gap-6'>
            {recommendedProjects.length === 0 ? (
              <div className='col-span-3 flex flex-col items-center py-12 text-center'>
                <FolderKanban size={32} className='text-gray-200 mb-2' />
                <p style={{ fontSize: 14, color: '#6A7282' }}>No projects available yet</p>
              </div>
            ) : (
              recommendedProjects.map((project) => {
                const course = courses.find(c => c.id === project.courseId)
                const projectCreator = students.find(s => s.id === project.creatorId)
                const instructor = instructors.find(i => i.id === project.instructorIds?.[0])
                
                return (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className='bg-white rounded-lg border border-[#E2E8F0] hover:shadow-md transition-shadow cursor-pointer overflow-hidden group'
                    style={{ border: '0.667px solid #E2E8F0', borderRadius: 8 }}
                  >
                    {/* Content */}
                    <div style={{ padding: 16 }}>
                      {/* Title */}
                      <div className='mb-2'>
                        <p 
                          className='line-clamp-2 group-hover:text-[#432DD7] transition-colors'
                          style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A', lineHeight: '20px' }}
                        >
                          {project.title}
                        </p>
                      </div>

                      {/* Short Description */}
                      <p 
                        className='line-clamp-2 mb-3'
                        style={{ fontSize: 12, color: '#6A7282', lineHeight: '16px' }}
                      >
                        {project.shortDescription}
                      </p>

                      {/* Meta Info */}
                      <div className='mb-3 pb-3' style={{ borderBottom: '0.667px solid #E2E8F0' }}>
                        <div className='flex items-center gap-2'>
                          <span 
                            className='rounded'
                            style={{ fontSize: 11, fontWeight: 500, color: '#6A7282', background: '#F9FAFB', padding: '4px 8px' }}
                          >
                            {course?.code}
                          </span>
                          <span style={{ fontSize: 12, color: '#6A7282' }}>
                            {project.languages?.[0]}
                          </span>
                        </div>
                      </div>

                      {/* Footer with Rating & Creator */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-1'>
                          <Star size={14} className='text-amber-400 fill-amber-400' />
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#1B2A4A' }}>{project.rating}</span>
                        </div>
                        <div className='flex items-center gap-1.5'>
                          {instructor?.avatar && (
                            <img 
                              src={instructor.avatar} 
                              alt='instructor' 
                              className='rounded-full'
                              style={{ width: 20, height: 20, border: '2px solid white' }}
                            />
                          )}
                          {projectCreator?.avatar && (
                            <img 
                              src={projectCreator.avatar} 
                              alt='creator' 
                              className='rounded-full'
                              style={{ width: 20, height: 20, border: '2px solid white' }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default InstructorDashboard