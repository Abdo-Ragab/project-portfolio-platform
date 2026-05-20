import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY } from '../../data/tabs'
import { FileText, Download, X } from 'lucide-react'
import toast from 'react-hot-toast'

const initialEmployers = [
  { id: 1, company: 'TechNova Solutions', email: 'hr@technova.com',          date: 'Today, 09:12 AM', status: 'pending',  description: 'A leading software company specializing in enterprise solutions.', industry: 'Software & Technology', size: '500-1000 employees', location: 'Cairo, Egypt', documents: ['TechNova_License.pdf', 'TechNova_TaxCard.pdf'] },
  { id: 2, company: 'Cairo Startups Co.', email: 'founder@cairostartups.eg', date: 'Yesterday',       status: 'pending',  description: 'An Egyptian startup accelerator connecting top engineering talent.', industry: 'Venture Capital',        size: '10-50 employees',   location: 'Cairo, Egypt', documents: ['CairoStartups_License.pdf'] },
  { id: 3, company: 'GlobalSoft',         email: 'jobs@globalsoft.com',      date: 'May 1, 2026',     status: 'approved', description: 'Multinational software outsourcing company.',                        industry: 'Software Outsourcing',   size: '1000+ employees',   location: 'Cairo, Egypt', documents: ['GlobalSoft_License.pdf', 'GlobalSoft_TaxCard.pdf'] },
]

const EmployerVerification = () => {
  const [employers, setEmployers] = useState(initialEmployers)
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)
  const [confirm, setConfirm]     = useState(null) // { id, decision }

  const handleDecision = (id, decision) => {
    const prev = employers.find(e => e.id === id)
    setEmployers(employers.map(e => e.id === id ? { ...e, status: decision } : e))
    if (selected?.id === id) setSelected(s => ({ ...s, status: decision }))
    setConfirm(null)

    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Company <strong>{decision}</strong></span>
        <button
          onClick={() => {
            setEmployers(curr => curr.map(e => e.id === id ? { ...e, status: prev.status } : e))
            if (selected?.id === id) setSelected(s => ({ ...s, status: prev.status }))
            toast.dismiss(t.id)
            toast.success('Action undone')
          }}
          className="text-indigo-600 font-semibold text-sm underline"
        >
          Undo
        </button>
      </div>
    ), { duration: 5000 })
  }

  const filtered = employers.filter(e =>
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  )

  const confirmingItem = confirm ? employers.find(e => e.id === confirm.id) : null

  return (
    <DashboardLayout tabs={ADMIN_TABS} secondaryTabs={ADMIN_TABS_SECONDARY}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Employer Approvals</h1>
          <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
            {employers.filter(e => e.status === 'pending').length} Pending
          </span>
        </div>

        <input
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-5 outline-none"
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Contact Email</th>
                <th className="px-6 py-3 font-medium">Date Applied</th>
                <th className="px-6 py-3 font-medium">Documents</th>
                <th className="px-6 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-800">{e.company}</td>
                  <td className="px-6 py-3 text-gray-500">{e.email}</td>
                  <td className="px-6 py-3 text-gray-500">{e.date}</td>
                  <td className="px-6 py-3">
                    <button onClick={() => setSelected(e)} className="flex items-center gap-1 text-indigo-600 hover:underline text-xs">
                      <FileText size={14}/>{e.documents.length} files
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {e.status === 'pending' ? (
                        <>
                          <button onClick={() => setConfirm({ id: e.id, decision: 'approved' })} className="cursor-pointer w-6 h-6 rounded-full border-2 border-green-500 text-green-500 flex items-center justify-center hover:bg-green-50 text-xs font-bold">✓</button>
                          <button onClick={() => setConfirm({ id: e.id, decision: 'rejected' })} className="cursor-pointer w-6 h-6 rounded-full border-2 border-red-400 text-red-400 flex items-center justify-center hover:bg-red-50 text-xs font-bold">✕</button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${e.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{e.status}</span>
                          <button onClick={() => setConfirm({ id: e.id, decision: 'pending' })} className="cursor-pointer text-xs text-gray-400 hover:text-indigo-600 underline">Revert</button>
                        </div>
                      )}
                      <button onClick={() => setSelected(e)} className="cursor-pointer ml-3 text-gray-400 text-xs hover:text-gray-700 underline">Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirm && confirmingItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Confirm Action</h2>
              <button onClick={() => setConfirm(null)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
            </div>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to <strong>{confirm.decision === 'pending' ? 'revert' : confirm.decision}</strong> the application from <strong>{confirmingItem.company}</strong>? You can undo this immediately after.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDecision(confirm.id, confirm.decision)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium text-white ${confirm.decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : confirm.decision === 'rejected' ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
              >
                Yes, {confirm.decision === 'pending' ? 'Revert' : confirm.decision.charAt(0).toUpperCase() + confirm.decision.slice(1)}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selected.company}</h2>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Industry</p><p className="text-sm font-medium text-gray-700">{selected.industry}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Company Size</p><p className="text-sm font-medium text-gray-700">{selected.size}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Location</p><p className="text-sm font-medium text-gray-700">{selected.location}</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-400 mb-1">Date Applied</p><p className="text-sm font-medium text-gray-700">{selected.date}</p></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selected.description}</p>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Uploaded Documents</h3>
            <div className="flex flex-col gap-2 mb-5">
              {selected.documents.map(doc => (
                <div key={doc} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700"><FileText size={14} className="text-indigo-500"/>{doc}</div>
                  <button onClick={() => toast.success(`Downloading ${doc}`)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"><Download size={13}/> Download</button>
                </div>
              ))}
            </div>
            {selected.status === 'pending' ? (
              <div className="flex gap-2">
                <button onClick={() => { setConfirm({ id: selected.id, decision: 'approved' }); setSelected(null) }} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700">Approve</button>
                <button onClick={() => { setConfirm({ id: selected.id, decision: 'rejected' }); setSelected(null) }} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600">Reject</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${selected.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  This company has been {selected.status}
                </div>
                <button onClick={() => { setConfirm({ id: selected.id, decision: 'pending' }); setSelected(null) }} className="ml-2 px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">Revert</button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default EmployerVerification