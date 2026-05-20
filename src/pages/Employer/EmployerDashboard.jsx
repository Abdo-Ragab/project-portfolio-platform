import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Briefcase, CheckCircle, FileText, Users, ChevronRight, Star, FolderKanban } from 'lucide-react'
import { EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipsContext'
import { useNavigate } from 'react-router'
import { projects } from '../../data/projects'
import { courses } from '../../data/courses'
import { students, instructors } from '../../data/users'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const getRandomProjects = (allProjects, count = 3) => {
  const publicProjects = allProjects.filter(p => p.visibility === 'public')
  const shuffled = [...publicProjects].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const EmployerDashboard = () => {
  const { user } = useAuth()
  const { internships } = useInternships()
  const navigate = useNavigate()

  const myInternships = internships.filter(
    internship =>
      internship.employerId === user?.id ||
      internship.companyName === user?.companyName
  )

  const totalApplicants = myInternships.reduce(
    (sum, internship) => sum + (internship.applicants?.length || 0),
    0
  )

  const currentlyHiring = myInternships.filter(
    internship => internship.status === 'hiring'
  ).length

  const acceptedApplicants = myInternships.reduce(
    (sum, internship) =>
      sum + (internship.applicants || []).filter(app => app.status === 'accepted').length,
    0
  )

  const archivedInternships = myInternships.filter(internship => internship.isArchived).length
  const recommendedProjects = getRandomProjects(projects, 3)

  // Dummy internship timeline data for better visualization
  const dummyInternshipTimeline = [
    { month: 'Jan', offered: 2, placed: 1 },
    { month: 'Feb', offered: 3, placed: 2 },
    { month: 'Mar', offered: 4, placed: 3 },
    { month: 'Apr', offered: 5, placed: 4 },
    { month: 'May', offered: 6, placed: 5 },
  ]

  // Calculate internship statistics over time (use real data if available, fallback to dummy)
  const internshipTimeline = React.useMemo(() => {
    const months = {}
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    myInternships.forEach(internship => {
      if (internship.postedAt) {
        const date = new Date(internship.postedAt)
        const monthKey = monthOrder[date.getMonth()]
        if (!months[monthKey]) {
          months[monthKey] = { month: monthKey, offered: 0, placed: 0 }
        }
        months[monthKey].offered += 1
        const acceptedCount = (internship.applicants || []).filter(a => a.status === 'accepted').length
        months[monthKey].placed += acceptedCount
      }
    })
    
    const result = monthOrder.filter(m => months[m]).map(m => months[m])
    // If no data, use dummy data for visualization
    return result.length === 0 ? dummyInternshipTimeline : result
  }, [myInternships])

  const stats = [
    { label: 'My Internships', value: myInternships.length, icon: Briefcase },
    { label: 'Currently Hiring', value: currentlyHiring, icon: FileText },
    { label: 'Total Applicants', value: totalApplicants, icon: Users },
    { label: 'Accepted Applicants', value: acceptedApplicants, icon: CheckCircle },
  ]

  return (
    <DashboardLayout tabs={EMPLOYER_TABS} secondaryTabs={EMPLOYER_TABS_SECONDARY}>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-[#0F172B] mb-2'>
          Employer Dashboard
        </h1>

        <p className='text-sm text-[#62748E] mb-6'>
          Welcome back, {user?.companyName || 'Employer'}. Here is your internship overview.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            const colors = [
              { bg: '#EEF2FF', text: '#432DD7', icon: '#432DD7' },
              { bg: '#FEF3C7', text: '#D97706', icon: '#D97706' },
              { bg: '#DBEAFE', text: '#2563EB', icon: '#2563EB' },
              { bg: '#D1FAE5', text: '#059669', icon: '#059669' },
            ]
            const color = colors[idx % colors.length]

            return (
              <div key={stat.label} className='bg-white rounded-xl border border-gray-200 p-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-500'>{stat.label}</p>
                    <p className='text-3xl font-semibold mt-1' style={{ color: color.text }}>
                      {stat.value}
                    </p>
                  </div>

                  <div className='w-11 h-11 rounded-xl flex items-center justify-center' style={{ backgroundColor: color.bg }}>
                    <Icon className='w-5 h-5' style={{ color: color.icon }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h2 className='text-lg font-semibold text-[#0F172B] mb-4'>
              Internship Offerings & Placements
            </h2>
            <p className='text-xs text-gray-500 mb-4'>Number of internships offered and students placed over time</p>

            {internshipTimeline.length === 0 ? (
              <p className='text-sm text-[#62748E]'>No internship data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dummyInternshipTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="offered" fill="#432DD7" name="Offered" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placed" fill="#059669" name="Placed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h2 className='text-lg font-semibold text-[#0F172B] mb-4'>
              Company Summary
            </h2>

            <div className='space-y-4'>
              <div className='pb-4 border-b border-gray-200'>
                <p className='text-xs text-gray-400 uppercase tracking-wider'>Company Name</p>
                <p className='text-sm font-semibold text-[#0F172B] mt-1'>{user?.companyName || 'N/A'}</p>
              </div>
              
              <div className='pb-4 border-b border-gray-200'>
                <p className='text-xs text-gray-400 uppercase tracking-wider'>Email Address</p>
                <p className='text-sm font-semibold text-[#0F172B] mt-1'>{user?.email || 'N/A'}</p>
              </div>
              
              <div className='pb-4 border-b border-gray-200'>
                <p className='text-xs text-gray-400 uppercase tracking-wider'>Account Status</p>
                <p className='text-sm font-semibold text-[#0F172B] mt-1'>Active</p>
              </div>
              
              <div>
                <p className='text-xs text-gray-400 uppercase tracking-wider'>Statistics</p>
                <div className='mt-2 grid grid-cols-2 gap-3'>
                  <div className='bg-gray-50 rounded-lg p-3'>
                    <p className='text-xs text-gray-500'>Active Internships</p>
                    <p className='text-lg font-bold text-[#432DD7] mt-1'>{currentlyHiring}</p>
                  </div>
                  <div className='bg-gray-50 rounded-lg p-3'>
                    <p className='text-xs text-gray-500'>Archived</p>
                    <p className='text-lg font-bold text-[#6A7282] mt-1'>{archivedInternships}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Projects */}
        <div className='mt-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-[#0F172B]'>
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
                    className='bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden group'
                  >
                    {/* Content */}
                    <div className='p-4'>
                      {/* Title */}
                      <div className='mb-2'>
                        <p 
                          className='line-clamp-2 group-hover:text-[#432DD7] transition-colors'
                          style={{ fontSize: 14, fontWeight: 600, color: '#0F172B', lineHeight: '20px' }}
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
                      <div className='mb-3 pb-3' style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <div className='flex items-center gap-2'>
                          <span 
                            className='rounded'
                            style={{ fontSize: 11, fontWeight: 500, color: '#6A7282', background: '#F3F4F6', padding: '4px 8px' }}
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
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172B' }}>{project.rating}</span>
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

export default EmployerDashboard