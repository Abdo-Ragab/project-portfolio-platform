import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { useInternships } from '../../context/InternshipsContext'
import { courses } from '../../data/courses'
import { notifications } from '../../data/notifications'
import { students } from '../../data/users'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

// ─── colours ────────────────────────────────────────────────────────────────

const COLORS = ['#432DD7', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6', '#F97316']

// ─── helpers ────────────────────────────────────────────────────────────────

const SectionCard = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 ${className}`}>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{title}</p>
    {children}
  </div>
)

const StatRow = ({ label, value, max, color = '#432DD7' }) => (
  <div className="mb-3 last:mb-0">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-[#45556C]">{label}</span>
      <span className="text-xs font-semibold text-[#0F172B]">{value}</span>
    </div>
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }} />
    </div>
  </div>
)

// ─── main component ──────────────────────────────────────────────────────────

const StudentStatisticsPage = () => {
  const { user } = useAuth()
  const { projects } = useProjects()
  const { internships } = useInternships()

  const myProjects    = projects.filter(p => p.creatorId === user.id || p.collaborators.includes(user.id))
  const myOwnProjects = projects.filter(p => p.creatorId === user.id)

  // top collaborators: count how many of my projects each person collaborates on
  const collabCount = {}
  myOwnProjects.forEach(p => (p.collaborators || []).forEach(cId => { collabCount[cId] = (collabCount[cId] || 0) + 1 }))
  const topCollaborators = Object.entries(collabCount)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ student: students.find(s => s.id === id), count }))
    .filter(({ student }) => student)
  const maxCollabCount = topCollaborators[0]?.count || 1
  const myNotifications = notifications.filter(n => n.userId === user.id)

  // ── Language breakdown ──────────────────────────────────────────────────
  const langCount = {}
  myProjects.forEach(p => (p.languages || []).forEach(l => { langCount[l] = (langCount[l] || 0) + 1 }))
  const languageData = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  // ── Commit activity (simulated — 5 months) ──────────────────────────────
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
  const commitData = [
    { month: 'Jan', commits: 38 },
    { month: 'Feb', commits: 45 },
    { month: 'Mar', commits: 118 },
    { month: 'Apr', commits: 95 },
    { month: 'May', commits: 152 },
  ]

  // ── Projects by course ──────────────────────────────────────────────────
  const courseData = courses.map(c => ({
    name: c.code,
    full: c.name,
    count: myProjects.filter(p => p.courseId === c.id).length,
  })).filter(c => c.count > 0)

  // ── Task status distribution ────────────────────────────────────────────
  const taskStatusCount = { pending: 0, 'in progress': 0, postponed: 0, completed: 0 }
  myProjects.forEach(p => (p.tasks || []).forEach(t => {
    const s = t.status || 'pending'
    taskStatusCount[s] = (taskStatusCount[s] || 0) + 1
  }))
  const taskData = Object.entries(taskStatusCount)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  const TASK_COLORS = { pending: '#F59E0B', 'in progress': '#432DD7', postponed: '#EF4444', completed: '#22C55E' }

  // ── Internship applications ──────────────────────────────────────────────
  const appStatusCount = {}
  internships.forEach(int => {
    int.applicants.filter(a => a.studentId === user.id).forEach(a => {
      appStatusCount[a.status] = (appStatusCount[a.status] || 0) + 1
    })
  })
  const appData = Object.entries(appStatusCount).map(([name, value]) => ({ name, value }))
  const APP_COLORS = { pending: '#F59E0B', accepted: '#22C55E', rejected: '#EF4444', nominated: '#432DD7' }

  // ── Project visibility ──────────────────────────────────────────────────
  const publicCount   = myProjects.filter(p => p.visibility === 'public').length
  const privateCount  = myProjects.filter(p => p.visibility === 'private').length
  const portfolioCount = myProjects.filter(p => p.showOnPortfolio).length
  const visibilityData = [
    { name: 'Public',    value: publicCount },
    { name: 'Private',   value: privateCount },
    { name: 'On Portfolio', value: portfolioCount },
  ]

  // ── Skills breakdown ────────────────────────────────────────────────────
  const skillCount = {}
  myProjects.forEach(p => (p.languages || []).forEach(l => { skillCount[l] = (skillCount[l] || 0) + 1 }))
  ;(user.skills || []).forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1 })
  const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxSkill = topSkills[0]?.[1] || 1

  // ── Notifications by type ───────────────────────────────────────────────
  const notifCount = {}
  myNotifications.forEach(n => { notifCount[n.type] = (notifCount[n.type] || 0) + 1 })
  const notifData = Object.entries(notifCount).map(([name, value]) => ({ name, value }))

  // ── Rating distribution ─────────────────────────────────────────────────
  const ratedProjects = myProjects.filter(p => p.rating)
  const avgRating = ratedProjects.length
    ? (ratedProjects.reduce((sum, p) => sum + p.rating, 0) / ratedProjects.length).toFixed(1)
    : 'N/A'

  const totalTasks = Object.values(taskStatusCount).reduce((a, b) => a + b, 0)
  const completedTasks = taskStatusCount.completed || 0
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172B]">My Insights & Analytics</h1>
          <p className="text-sm text-gray-400 mt-1">Track your academic project contributions and portfolio growth.</p>
        </div>

        {/* Row 1: Language Breakdown + Commit Activity */}
        <div className="grid grid-cols-2 gap-5">
          <SectionCard title="Language Breakdown">
            {languageData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No language data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={languageData} cx="50%" cy="50%" innerRadius={65} outerRadius={105}
                    dataKey="value" paddingAngle={3}>
                    {languageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                  <Legend iconType="square" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          <SectionCard title="Commit Activity (Last 5 Months)">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={commitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#432DD7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#432DD7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Area type="monotone" dataKey="commits" stroke="#432DD7" strokeWidth={2} fill="url(#commitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Row 2: Projects by Course + Task Status */}
        <div className="grid grid-cols-2 gap-5">
          <SectionCard title="Projects by Course">
            {courseData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No course data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={courseData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }}
                    formatter={(v, _, props) => [v + ' project(s)', props.payload.full]}
                  />
                  <Bar dataKey="count" fill="#432DD7" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>

          <SectionCard title="Task Status Distribution">
            {taskData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No tasks yet.</p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={200}>
                  <PieChart>
                    <Pie data={taskData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value" paddingAngle={3}>
                      {taskData.map((entry) => (
                        <Cell key={entry.name} fill={TASK_COLORS[entry.name] || '#94A3B8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {taskData.map(entry => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: TASK_COLORS[entry.name] || '#94A3B8' }} />
                        <span className="text-xs text-[#45556C] capitalize">{entry.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#0F172B]">{entry.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#E2E8F0] mt-2">
                    <p className="text-xs text-gray-400">Completion rate</p>
                    <p className="text-lg font-bold text-[#432DD7]">{completionRate}%</p>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Row 3: Top Skills + Project Visibility */}
        <div className="grid grid-cols-2 gap-5">
          <SectionCard title="Top Skills & Technologies">
            {topSkills.length === 0 ? (
              <p className="text-sm text-gray-400">No skills data yet.</p>
            ) : (
              <div className="space-y-2">
                {topSkills.map(([skill, count], i) => (
                  <StatRow key={skill} label={skill} value={count} max={maxSkill} color={COLORS[i % COLORS.length]} />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Project Visibility & Portfolio">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Total',       value: myProjects.length,  color: '#432DD7' },
                  { label: 'Public',      value: publicCount,        color: '#22C55E' },
                  { label: 'Portfolio',   value: portfolioCount,     color: '#F59E0B' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="text-center bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              {visibilityData.filter(d => d.value > 0).map((d, i) => (
                <StatRow key={d.name} label={d.name} value={d.value} max={myProjects.length || 1} color={COLORS[i]} />
              ))}
              <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-[#432DD7]">{avgRating}</p>
                  <p className="text-xs text-gray-400">Avg. Rating</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-[#432DD7]">{ratedProjects.length}</p>
                  <p className="text-xs text-gray-400">Rated Projects</p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Row 4: Internship Applications + Notifications */}
        <div className="grid grid-cols-2 gap-5">
          <SectionCard title="Internship Applications by Status">
            {appData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No applications yet.</p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="55%" height={180}>
                  <PieChart>
                    <Pie data={appData} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                      dataKey="value" paddingAngle={3}>
                      {appData.map((entry) => (
                        <Cell key={entry.name} fill={APP_COLORS[entry.name] || '#94A3B8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5">
                  {appData.map(entry => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: APP_COLORS[entry.name] || '#94A3B8' }} />
                        <span className="text-xs text-[#45556C] capitalize">{entry.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#0F172B]">{entry.value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <p className="text-xs text-gray-400">Total applications</p>
                    <p className="text-lg font-bold text-[#432DD7]">{appData.reduce((s, d) => s + d.value, 0)}</p>
                  </div>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Notifications by Type">
            {notifData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No notifications.</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={notifData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={65} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
                    {notifData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </div>

        {/* Row 5: Top Collaborators per Project */}
        <div className="grid grid-cols-2 gap-5">

          {/* Collaborator frequency */}
          <SectionCard title="Top Collaborators">
            {topCollaborators.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No collaborators yet.</p>
            ) : (
              <div className="space-y-4">
                {topCollaborators.map(({ student, count }) => (
                  <div key={student.id} className="flex items-center gap-3">
                    <img src={student.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#0F172B] truncate">{student.firstName} {student.lastName}</p>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{count} project{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#432DD7] rounded-full" style={{ width: `${(count / maxCollabCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Collaborators per project */}
          <SectionCard title="Collaborators per Project">
            {myOwnProjects.filter(p => (p.collaborators || []).length > 0).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No collaborators on your projects yet.</p>
            ) : (
              <div className="space-y-4">
                {myOwnProjects.filter(p => (p.collaborators || []).length > 0).map(project => (
                  <div key={project.id}>
                    <p className="text-xs font-semibold text-[#0F172B] mb-2 truncate">{project.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(project.collaborators || []).map(cId => {
                        const s = students.find(st => st.id === cId)
                        if (!s) return null
                        return (
                          <div key={cId} className="flex items-center gap-1.5 bg-[#EEF2FF] rounded-full px-2.5 py-1">
                            <img src={s.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs text-[#432DD7] font-medium">{s.firstName}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

        </div>

      </div>
    </DashboardLayout>
  )
}

export default StudentStatisticsPage
