import { useState } from 'react'
import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useInternships } from '../../context/InternshipsContext'

const userGrowthData = [
  { month: 'Jan', students: 800,  employers: 20,  instructors: 10 },
  { month: 'Feb', students: 1200, employers: 35,  instructors: 18 },
  { month: 'Mar', students: 2100, employers: 60,  instructors: 30 },
  { month: 'Apr', students: 3200, employers: 90,  instructors: 45 },
  { month: 'May', students: 4289, employers: 120, instructors: 60 },
]

const facultyData = [
  { faculty: 'Computer Science', projects: 620 },
  { faculty: 'Engineering',      projects: 480 },
  { faculty: 'Business',         projects: 180 },
  { faculty: 'Design',           projects: 60  },
]

// Dummy internship timeline data for better visualization
const dummyInternshipData = [
  { month: 'Jan', offered: 8, placed: 5 },
  { month: 'Feb', offered: 12, placed: 8 },
  { month: 'Mar', offered: 15, placed: 11 },
  { month: 'Apr', offered: 18, placed: 14 },
  { month: 'May', offered: 22, placed: 17 },
  { month: 'Jun', offered: 25, placed: 19 },
  { month: 'Jul', offered: 28, placed: 22 },
  { month: 'Aug', offered: 32, placed: 26 },
  { month: 'Sep', offered: 28, placed: 23 },
  { month: 'Oct', offered: 24, placed: 20 },
]

const AdminStatistics = () => {
  const { internships } = useInternships()

  // Calculate internship timeline
  const internshipTimeline = React.useMemo(() => {
    const months = {}
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    internships.forEach(internship => {
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
    return result.length === 0 ? dummyInternshipData : result
  }, [internships])

  // Use dummy data totals for internship analytics display
  const dummyTotalInternships = dummyInternshipData.reduce((sum, d) => sum + d.offered, 0)
  const dummyTotalPlacements = dummyInternshipData.reduce((sum, d) => sum + d.placed, 0)
  const dummyTotalApplicants = Math.round(dummyTotalPlacements * 1.3)
  const dummyHiringPositions = dummyInternshipData[dummyInternshipData.length - 1].offered - dummyInternshipData[dummyInternshipData.length - 1].placed
  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">System Global Analytics</h1>
        <p className="text-gray-500 text-sm mb-6">Monitor overall platform growth, adoption rates, and faculty utilization.</p>

        {/* User Registration Growth Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">User Registration Growth</p>
          <div className="flex gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"/> students</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block"/> employers</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-teal-400 inline-block"/> instructors</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="students"    stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Area type="monotone" dataKey="employers"   stroke="#fb923c" fill="#fb923c" fillOpacity={0.3} />
              <Area type="monotone" dataKey="instructors" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Quick stats */}
<div className="grid grid-cols-4 gap-4 mb-6">
  {[
    { label: 'Total Users',     value: '4,289', sub: '+24 today',      color: 'text-gray-900' },
    { label: 'Active Projects', value: '842',   sub: 'Stable',         color: 'text-gray-900' },
    { label: 'Total Courses',   value: '24',    sub: 'This semester',  color: 'text-gray-900' },
    { label: 'Flagged Items',   value: '2',     sub: 'Needs review',   color: 'text-red-500'  },
  ].map(s => (
    <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
    </div>
  ))}
</div>

        <div className="grid grid-cols-2 gap-4">
          {/* Projects by Faculty */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Projects by Faculty</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={facultyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="faculty" type="category" tick={{ fontSize: 12 }} width={120} />
                <Tooltip />
                <Bar dataKey="projects" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clean Submission Rate */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border-8 border-green-200 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-green-600">99%</span>
            </div>
            <p className="text-base font-semibold text-gray-800 mb-2">Clean Submission Rate</p>
            <p className="text-sm text-gray-500 text-center">Less than 1% of all project submissions this semester have triggered moderation or plagiarism flags.</p>
          </div>
        </div>

        {/* Internship Statistics Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Internship Program Analytics</h2>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Internships', value: dummyTotalInternships, color: 'text-blue-600' },
              { label: 'Active Positions', value: dummyHiringPositions, color: 'text-orange-600' },
              { label: 'Total Applicants', value: dummyTotalApplicants, color: 'text-purple-600' },
              { label: 'Students Placed', value: dummyTotalPlacements, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Internship Timeline Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Internship Offerings & Placements Over Time</p>
            {internshipTimeline.length === 0 ? (
              <p className="text-sm text-gray-500">No internship data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dummyInternshipData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="offered" fill="#3b82f6" name="Offered" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placed" fill="#10b981" name="Placed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminStatistics