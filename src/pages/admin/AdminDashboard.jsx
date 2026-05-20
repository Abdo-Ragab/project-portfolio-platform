import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'

const recentSignups = [
  { name: 'Nour Ahmed',  email: 'nour.a@student.guc.edu', role: 'Student',    roleColor: 'bg-blue-100 text-blue-700',     joined: '10 mins ago' },
  { name: 'Google Tech', email: 'careers@google.com',      role: 'Employer',   roleColor: 'bg-purple-100 text-purple-700', joined: '1 hour ago' },
  { name: 'Dr. Salma',   email: 'salma@guc.edu',           role: 'Instructor', roleColor: 'bg-green-100 text-green-700',   joined: '3 hours ago' },
]

const AdminDashboard = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Platform Administration</h1>
        <p className="text-gray-500 text-sm mb-6">System overview and management dashboard.</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900">4,289</p>
              <span className="text-xs text-green-600 mb-1">+24 today</span>
            </div>
          </div>

          <div
            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 transition-colors"
            onClick={() => navigate('/admin/statistics')}
          >
            <p className="text-sm text-gray-500 mb-1">Active Projects</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900">842</p>
              <span className="text-xs text-green-600 mb-1">Stable</span>
            </div>
            <p className="text-xs text-indigo-500 mt-2">View Statistics →</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-1">System Health</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <span className="text-xs text-green-600 mb-1">All systems go</span>
            </div>
          </div>

          <div
            className="bg-white border border-red-100 rounded-xl p-5 cursor-pointer hover:border-red-300 transition-colors"
            onClick={() => navigate('/admin/flagged')}
          >
            <p className="text-sm text-gray-500 mb-1">Reports/Flags</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-red-500">2</p>
              <span className="text-xs text-red-500 mb-1">Needs review</span>
            </div>
            <p className="text-xs text-red-400 mt-2">Review now →</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Signups</h2>
            <a href="/admin/users" className="text-sm text-indigo-600 hover:underline">Manage Users</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentSignups.map(u => (
                <tr key={u.email} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.roleColor}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard