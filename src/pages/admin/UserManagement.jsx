import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { X, MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'

const initialUsers = [
  { id: 1, name: 'Sarah Ahmed',   email: 'sarah@student.guc.edu',  role: 'Student',    status: 'Active',   phone: '+20 100 000 0001', major: 'Computer Science', year: '3rd Year' },
  { id: 2, name: 'Dr. Youssef',   email: 'youssef@guc.edu',        role: 'Instructor', status: 'Active',   phone: '+20 100 000 0002', major: 'Computer Science', year: 'N/A' },
  { id: 3, name: 'Microsoft HR',  email: 'careers@microsoft.com',  role: 'Employer',   status: 'Pending',  phone: '+20 100 000 0003', major: 'N/A',              year: 'N/A' },
  { id: 4, name: 'Admin Setup',   email: 'admin@guc.edu',          role: 'Admin',      status: 'Active',   phone: '+20 100 000 0004', major: 'N/A',              year: 'N/A' },
  { id: 5, name: 'Omar Ali',      email: 'omar@student.guc.edu',   role: 'Student',    status: 'Active',   phone: '+20 100 000 0005', major: 'Engineering',      year: '2nd Year' },
  { id: 6, name: 'Dr. Mona',      email: 'mona@guc.edu',           role: 'Instructor', status: 'Active',   phone: '+20 100 000 0006', major: 'Pharmacy',         year: 'N/A' },
]

const roleColors = {
  Student:    'bg-blue-100 text-blue-700',
  Instructor: 'bg-green-100 text-green-700',
  Employer:   'bg-purple-100 text-purple-700',
  Admin:      'bg-red-100 text-red-700',
}

const statusColors = {
  Active:   'bg-green-100 text-green-700',
  Pending:  'bg-yellow-100 text-yellow-700',
  Inactive: 'bg-gray-100 text-gray-500',
}

const UserManagement = () => {
  const [users, setUsers]           = useState(initialUsers)
  const [search, setSearch]         = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [showModal, setShowModal]   = useState(false)
  const [showMenu, setShowMenu]     = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showConfirm, setShowConfirm] = useState(null)
  const [newAdmin, setNewAdmin]     = useState({ name: '', email: '', password: '' })

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = filterRole === 'All' || u.role === filterRole
    return matchSearch && matchRole
  })

  const toggleStatus = (id) => {
    const prev = users.find(u => u.id === id)
    const next = prev.status === 'Active' ? 'Inactive' : 'Active'
    setUsers(users.map(u => u.id === id ? { ...u, status: next } : u))
    setShowConfirm(null)
    setShowMenu(null)
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Account <strong>{next.toLowerCase()}</strong></span>
        <button onClick={() => {
          setUsers(prev => prev.map(u => u.id === id ? { ...u, status: prev.status } : u))
          toast.dismiss(t.id)
          toast.success('Action undone')
        }} className="text-indigo-600 font-semibold text-sm underline">Undo</button>
      </div>
    ), { duration: 5000 })
  }

  const saveEdit = () => {
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u))
    setEditingUser(null)
    toast.success('User updated!')
  }

  const sendInvitation = () => {
    if (!newAdmin.name.trim() || !newAdmin.email.trim() || !newAdmin.password.trim()) { toast.error('Please fill all fields'); return }
    if (!newAdmin.email.includes('@guc.edu.eg')) { toast.error('Email must be a GUC email (@guc.edu.eg)'); return }
    const emailRegex = /^[^\s@]+@guc\.edu\.eg$/
    if (!emailRegex.test(newAdmin.email)) { toast.error('Please enter a valid email address'); return }
    setUsers([...users, { id: Date.now(), name: newAdmin.name, email: newAdmin.email, role: 'Admin', status: 'Pending', phone: 'N/A', major: 'N/A', year: 'N/A' }])
    toast.success('Invitation sent!')
    setShowModal(false)
    setNewAdmin({ name: '', email: '', password: '' })
  }

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          <button onClick={() => setShowModal(true)} className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            + Create Admin
          </button>
        </div>

        <div className="flex gap-3 mb-5">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="cursor-pointer border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            {['All', 'Student', 'Instructor', 'Employer', 'Admin'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u, index) => {
                const isLastRow = index === filtered.length - 1
                return (
                <tr key={u.id} className="hover:bg-gray-50 relative">
                  <td className="px-6 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-3 text-gray-500">{u.email}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-6 py-3 relative">
                    <button
                      onClick={() => setShowMenu(showMenu === u.id ? null : u.id)}
                      className="cursor-pointer text-gray-400 hover:text-gray-700 p-1 rounded"
                    >
                      <MoreHorizontal size={16}/>
                    </button>
                    {showMenu === u.id && (
                    <div className={`absolute right-6 z-10 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-44 ${isLastRow ? 'bottom-8' : 'top-8'}`}>
                        <button
                          onClick={() => { setEditingUser({ ...u }); setShowMenu(null) }}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          ✏️ Edit User
                        </button>
                        <button
                          onClick={() => { setShowConfirm(u.id); setShowMenu(null) }}
                          className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${u.status === 'Active' ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {u.status === 'Active' ? '🚫 Deactivate' : '✅ Activate'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Status Change */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-800 mb-2">Confirm Action</h2>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to <strong>{users.find(u => u.id === showConfirm)?.status === 'Active' ? 'deactivate' : 'activate'}</strong> this account?
              You can undo this action immediately after.
            </p>
            <div className="flex gap-2">
              <button onClick={() => toggleStatus(showConfirm)} className="cursor-pointer flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Confirm</button>
              <button onClick={() => setShowConfirm(null)} className="cursor-pointer flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">Edit User</h2>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Full Name</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Phone</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editingUser.phone} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Role</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                  {['Student', 'Instructor', 'Employer', 'Admin'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Major</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editingUser.major} onChange={e => setEditingUser({ ...editingUser, major: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Status</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={editingUser.status} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}>
                  {['Active', 'Inactive', 'Pending'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={saveEdit} className="cursor-pointer flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">Save Changes</button>
              <button onClick={() => setEditingUser(null)} className="cursor-pointer flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800">Create Admin Account</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Invite a new faculty member or staff to access the administrative dashboard.</p>
            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Full Name</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Dr. Ahmed Hassan" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">University Email</label>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="name@guc.edu.eg" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Password</label>
                <input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}/>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowModal(false)} className="cursor-pointer px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={sendInvitation} className="cursor-pointer px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Account</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default UserManagement