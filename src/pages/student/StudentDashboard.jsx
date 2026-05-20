import React from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { courses } from '../../data/courses'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { BarChart2, BookOpen, CheckCircle2, ChevronRight, Clock, Eye, FolderKanban, Plus, Star, User } from 'lucide-react'
import { students, instructors } from '../../data/users'

// ─── helpers ────────────────────────────────────────────────────────────────

const projectVisibilityStatus = (project) => {
  if (project.visibility === 'public') return { label: 'Published', color: 'bg-green-100 text-green-700' }
  return { label: 'Draft', color: 'bg-gray-100 text-gray-500' }
}

const getRandomProjects = (allProjects, userId, count = 3) => {
  const publicProjects = allProjects.filter(p => p.visibility === 'public' && p.creatorId !== userId)
  const shuffled = [...publicProjects].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const DEADLINE_COLORS = ['bg-[#432DD7]', 'bg-blue-500', 'bg-purple-500', 'bg-indigo-500']

// ─── stat card ───────────────────────────────────────────────────────────────

const StatCard = ({ label, value, badge, badgeColor, icon: Icon }) => (
  <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
    <div className="flex items-start justify-between mb-4">
      <p className="text-sm text-gray-400">{label}</p>
      <Icon size={17} className="text-gray-300" />
    </div>
    <div className="flex items-end gap-2">
      <p className="text-3xl font-bold text-[#0F172B]">{value}</p>
      {badge && (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full mb-0.5 ${badgeColor}`}>{badge}</span>
      )}
    </div>
  </div>
)

// ─── main component ──────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { projects } = useProjects()

  const myProjects   = projects.filter(p => p.creatorId === user.id || p.collaborators.includes(user.id))
  const publicCount  = myProjects.filter(p => p.visibility === 'public').length
  const portfolioCount = myProjects.filter(p => p.showOnPortfolio).length
  const courseCount  = [...new Set(myProjects.map(p => p.courseId).filter(Boolean))].length

  const pendingTasks = myProjects
    .flatMap(p => (p.tasks || []).map(t => ({ ...t, projectId: p.id })))
    .filter(t => t.assignedTo === user.id && t.status !== 'completed')

  const recentProjects = [...myProjects].reverse().slice(0, 5)

  const upcomingTasks = myProjects
    .flatMap(p => (p.tasks || []).map(t => ({ ...t, projectTitle: p.title, projectId: p.id })))
    .filter(t => t.deadline && t.status !== 'completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4)

  const recommendedProjects = getRandomProjects(projects, user.id, 3)

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6 space-y-6">

        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172B]">Welcome back, {user.firstName}</h1>
            <p className="text-sm text-gray-400 mt-1">Here's what's happening with your portfolio today.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {user.major && (
              <span className="text-sm font-medium text-[#8200DB] bg-[#F3E8FF] px-3 py-1.5 rounded-lg">{user.major}</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Views"       value="1,248"              badge="+12%"      badgeColor="bg-green-100 text-green-600"  icon={Eye} />
          <StatCard label="Courses Taking"   value={courseCount}        badge="Active"    badgeColor="bg-indigo-100 text-indigo-600" icon={BookOpen} />
          <StatCard label="Total Projects"   value={myProjects.length} badge={publicCount > 0 ? `${publicCount} public` : null} badgeColor="bg-blue-100 text-blue-600" icon={FolderKanban} />
          <StatCard label="Pending Tasks"    value={pendingTasks.length} badge={pendingTasks.length > 0 ? 'Needs attention' : 'All done!'} badgeColor={pendingTasks.length > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'} icon={Clock} />
        </div>

        {/* Recent Projects (table) + Upcoming Deadlines */}
        <div className="grid grid-cols-[1fr_340px] gap-8 items-start">

          {/* Recent Projects — table style */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-[#0F172B]">Recent Projects</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/student/projects')}
                  className="flex items-center gap-1 text-xs font-medium text-[#432DD7] bg-[#EEF2FF] px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <Plus size={12} /> New Project
                </button>
                <button onClick={() => navigate('/student/projects')} className="text-xs text-gray-400 hover:text-[#432DD7] flex items-center gap-0.5">
                  View all <ChevronRight size={12} />
                </button>
              </div>
            </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {recentProjects.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <FolderKanban size={32} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No projects yet. Create your first one!</p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="grid grid-cols-[1fr_130px_100px_90px] px-5 py-2 border-b border-[#E2E8F0] bg-gray-50">
                  <p className="text-xs font-semibold text-[#0F172B]">Project Title</p>
                  <p className="text-xs font-semibold text-[#0F172B]">Course</p>
                  <p className="text-xs font-semibold text-[#0F172B]">Date</p>
                  <p className="text-xs font-semibold text-[#0F172B]">Status</p>
                </div>
                {recentProjects.map((project, i) => {
                  const course = courses.find(c => c.id === project.courseId)
                  const { label, color } = projectVisibilityStatus(project)
                  return (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/student/projects/${project.id}`)}
                      className={`grid grid-cols-[1fr_130px_100px_90px] items-center px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors group ${i < recentProjects.length - 1 ? 'border-b border-[#E2E8F0]' : ''}`}
                    >
                      <p className="text-sm font-medium text-[#0F172B] group-hover:text-[#432DD7] transition-colors truncate pr-4">{project.title}</p>
                      <p className="text-xs text-gray-400 truncate">{course?.code}</p>
                      <p className="text-xs text-gray-400">{project.createdAt?.slice(0, 7)}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${color}`}>{label}</span>
                    </div>
                  )
                })}
              </>
            )}
          </div>
          </div>

          {/* Upcoming Deadlines — calendar style */}
          <div>
            <p className="font-semibold text-[#0F172B] mb-3">Upcoming Deadlines</p>
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {upcomingTasks.length === 0 ? (
              <div className="flex items-center gap-2.5 p-5">
                <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                <p className="text-sm text-gray-400">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E2E8F0]">
                {upcomingTasks.map((task, i) => {
                  const daysLeft = Math.ceil((new Date(task.deadline) - new Date()) / 86400000)
                  const date = new Date(task.deadline)
                  const day = date.getDate()
                  const mon = date.toLocaleString('en', { month: 'short' }).toUpperCase()
                  const urgent = daysLeft <= 7
                  const bgColor = urgent ? 'bg-red-500' : DEADLINE_COLORS[i % DEADLINE_COLORS.length]
                  const course = courses.find(c => {
                    const proj = myProjects.find(p => p.id === task.projectId)
                    return proj && c.id === proj.courseId
                  })
                  return (
                    <div
                      key={task.id}
                      onClick={() => navigate(`/student/projects/${task.projectId}`)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className={`${bgColor} text-white rounded-lg w-9 h-9 flex flex-col items-center justify-center shrink-0`}>
                        <span className="text-sm font-bold leading-none">{day}</span>
                        <span className="text-[8px] font-medium leading-none mt-0.5 opacity-80">{mon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0F172B] truncate">{task.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {course?.code} · {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Recommended Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-[#0F172B]">Recommended Projects</p>
            <button onClick={() => navigate('/projects')} className="cursor-pointer text-xs font-medium text-[#6A7282] hover:text-[#432DD7] transition-colors flex items-center gap-0.5">
              View more <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {recommendedProjects.length === 0 ? (
              <div className="col-span-3 flex flex-col items-center py-12 text-center">
                <FolderKanban size={32} className="text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No projects available yet</p>
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
                    className="bg-white rounded-lg border border-[#E2E8F0] hover:shadow-md transition-shadow cursor-pointer overflow-hidden group"
                  >
                    {/* Content */}
                    <div className="p-4">
                      {/* Title & Visibility */}
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-[#0F172B] line-clamp-2 group-hover:text-[#432DD7] transition-colors">
                          {project.title}
                        </p>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {project.shortDescription}
                      </p>

                      {/* Meta Info */}
                      <div className="space-y-2 mb-3 pb-3 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {course?.code}
                          </span>
                          <span className="text-xs text-gray-400">
                            {project.languages?.[0]}
                          </span>
                        </div>
                      </div>

                      {/* Footer with Rating & Creator */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-medium text-[#0F172B]">{project.rating}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {instructor?.avatar && (
                            <img 
                              src={instructor.avatar} 
                              alt="instructor" 
                              className="w-5 h-5 rounded-full border border-white" 
                            />
                          )}
                          {projectCreator?.avatar && (
                            <img 
                              src={projectCreator.avatar} 
                              alt="creator" 
                              className="w-5 h-5 rounded-full border border-white" 
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

export default StudentDashboard
