import React, { useState, useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { 
  Archive, ArchiveRestore, Edit, Plus, Save, Trash2, Users, X, 
  Calendar, Clock, AlertCircle, Zap, Briefcase
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipsContext'

const EmployerInternships = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    toggleArchiveInternship,
  } = useInternships()

  // State management
  const [viewMode, setViewMode] = useState('active') // 'active' | 'archived' | 'all'
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({
    title: '',
    responsibilities: '',
    skills: '',
    duration: '',
    deadline: '',
    languages: '',
    status: 'hiring',
  })

  // Get current user's internships
  const myInternships = useMemo(() => {
    let list = internships.filter(
      internship =>
        internship.employerId === user?.id ||
        internship.companyName === user?.companyName
    )

    if (viewMode === 'active') {
      list = list.filter(i => !i.isArchived)
    } else if (viewMode === 'archived') {
      list = list.filter(i => i.isArchived)
    }

    return list
  }, [internships, user, viewMode])

  // Calculate accurate tab counts
  const allUserInternships = useMemo(() => {
    return internships.filter(
      internship =>
        internship.employerId === user?.id ||
        internship.companyName === user?.companyName
    )
  }, [internships, user])

  const activeCount = useMemo(() => {
    return allUserInternships.filter(i => !i.isArchived).length
  }, [allUserInternships])

  const archivedCount = useMemo(() => {
    return allUserInternships.filter(i => i.isArchived).length
  }, [allUserInternships])

  const allCount = allUserInternships.length

  // Helper functions
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date()
  }

  const splitList = (text) =>
    text.split(',').map(item => item.trim()).filter(Boolean)

  // Form handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOpenModal = (internship = null) => {
    if (internship) {
      setEditingId(internship.id)
      setForm({
        title: internship.title,
        responsibilities: internship.responsibilities,
        skills: internship.skills.join(', '),
        duration: internship.duration,
        deadline: internship.deadline,
        languages: internship.languages.join(', '),
        status: internship.status,
      })
    } else {
      setEditingId(null)
      setForm({
        title: '',
        responsibilities: '',
        skills: '',
        duration: '',
        deadline: '',
        languages: '',
        status: 'hiring',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.title || !form.responsibilities || !form.skills || !form.duration || !form.deadline || !form.languages) {
      toast.error('Please fill all internship details')
      return
    }

    const internshipData = {
      title: form.title,
      responsibilities: form.responsibilities,
      skills: splitList(form.skills),
      languages: splitList(form.languages),
      duration: form.duration,
      deadline: form.deadline,
      status: form.status,
    }

    if (editingId) {
      updateInternship(editingId, internshipData)
      toast.success('Internship updated successfully')
    } else {
      addInternship({
        id: `int_${Date.now()}`,
        employerId: user.id,
        companyName: user.companyName,
        companyColor: '#432DD7',
        ...internshipData,
        location: user.address || 'Cairo, Egypt',
        type: 'Internship',
        isArchived: false,
        postedAt: new Date().toISOString().split('T')[0],
        applicants: [],
      })
      toast.success('Internship added successfully')
    }

    handleCloseModal()
  }

  const handleEdit = (internship) => {
    handleOpenModal(internship)
  }

  const handleDeleteClick = (internship) => {
    setDeleteTarget(internship)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    deleteInternship(deleteTarget.id)
    toast.success('Internship deleted')
    setDeleteTarget(null)
  }

  const handleCancelDelete = () => {
    setDeleteTarget(null)
  }

  const handleArchiveToggle = (internship) => {
    if (!internship.isArchived && !isDeadlinePassed(internship.deadline)) {
      toast.error('Internships can only be archived after the deadline has passed')
      return
    }
    toggleArchiveInternship(internship.id)
    toast.success(`Internship ${internship.isArchived ? 'unarchived' : 'archived'}`)
  }

  const handleStatusChange = (internship) => {
    updateInternship(internship.id, {
      status: internship.status === 'hiring' ? 'filled' : 'hiring',
    })
    toast.success('Internship status updated')
  }

  // Navigate to applicants page for the selected internship
  const handleViewApplicants = (internship) => {
    navigate(`/employer/applicants?internshipId=${internship.id}`)
  }

  // Render functions
  const renderAddEditModal = () => {
    if (!showModal) return null

    return (
      <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6'>
        <div className='bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto'>
          <div className='flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]'>
            <h2 className='text-xl font-semibold text-[#0F172B]'>
              {editingId ? 'Edit Internship' : 'Add New Internship'}
            </h2>
            <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600'>
              <X className='size-5' />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='p-6 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                  Internship Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  value={form.title}
                  onChange={handleChange}
                  placeholder='e.g. Frontend Engineering Intern'
                  className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                  Duration <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='duration'
                  value={form.duration}
                  onChange={handleChange}
                  placeholder='e.g. 3 months'
                  className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                  Application Deadline <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  name='deadline'
                  value={form.deadline}
                  onChange={handleChange}
                  className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                  Status <span className='text-red-500'>*</span>
                </label>
                <select
                  name='status'
                  value={form.status}
                  onChange={handleChange}
                  className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                >
                  <option value='hiring'>Currently Hiring</option>
                  <option value='filled'>Position Filled</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                  Required Skills <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='skills'
                  value={form.skills}
                  onChange={handleChange}
                  placeholder='React, JavaScript, CSS (comma separated)'
                  className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                  Programming Languages <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='languages'
                  value={form.languages}
                  onChange={handleChange}
                  placeholder='JavaScript, TypeScript (comma separated)'
                  className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-[#0F172B] mb-1.5'>
                Responsibilities & Details <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='responsibilities'
                value={form.responsibilities}
                onChange={handleChange}
                placeholder='Describe the responsibilities and key details of this internship...'
                rows={5}
                className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7] resize-none'
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={handleCloseModal}
                className='cursor-pointer flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='cursor-pointer flex-1 py-2.5 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8] flex items-center justify-center gap-2'
              >
                {editingId ? <Save className='size-4' /> : <Plus className='size-4' />}
                {editingId ? 'Save Changes' : 'Create Internship'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderInternshipCard = (internship) => {
    const deadlinePassed = isDeadlinePassed(internship.deadline)
    const daysUntilDeadline = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24))

    return (
      <div
        key={internship.id}
        className='bg-white border border-[#E2E8F0] rounded-xl p-5 hover:shadow-sm transition-all group'
      >
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <h3 className='font-semibold text-[#0F172B] group-hover:text-[#432DD7] transition-colors'>
              {internship.title}
            </h3>
            <p className='text-sm text-[#62748E] mt-1'>{internship.duration}</p>
          </div>

          <div className='flex flex-col items-end gap-2'>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              internship.status === 'hiring'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {internship.status === 'hiring' ? 'Currently Hiring' : 'Position Filled'}
            </span>
            {internship.isArchived && (
              <span className='text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium'>
                Archived
              </span>
            )}
          </div>
        </div>

        <p className='text-sm text-[#45556C] line-clamp-2 mb-3'>{internship.responsibilities}</p>

        <div className='mb-4 pb-4 border-b border-[#E2E8F0]'>
          <div className='flex items-center gap-2 mb-2'>
            <Calendar className='size-4 text-[#62748E]' />
            <span className={`text-sm font-medium ${
              deadlinePassed ? 'text-red-600' : daysUntilDeadline <= 7 ? 'text-orange-600' : 'text-[#62748E]'
            }`}>
              {deadlinePassed
                ? 'Deadline Passed'
                : `${daysUntilDeadline} days left`}
            </span>
          </div>
          <p className='text-xs text-[#62748E]'>Deadline: {internship.deadline}</p>
        </div>

        <div className='flex items-center justify-between mb-4 text-sm'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1 text-[#62748E]'>
              <Users className='size-4' />
              {internship.applicants?.length || 0} applicants
            </span>
            <span className='text-xs text-[#62748E]'>
              {internship.skills.slice(0, 2).join(', ')}
              {internship.skills.length > 2 && ` +${internship.skills.length - 2}`}
            </span>
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => handleEdit(internship)}
            className='cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors'
          >
            <Edit className='size-3.5' />
            Edit
          </button>

          <button
            onClick={() => handleDeleteClick(internship)}
            className='cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors'
          >
            <Trash2 className='size-3.5' />
            Delete
          </button>

          <button
            onClick={() => handleArchiveToggle(internship)}
            disabled={!internship.isArchived && !deadlinePassed}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !internship.isArchived && !deadlinePassed
                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer'
            }`}
            title={!internship.isArchived && !deadlinePassed ? 'Archive only after deadline' : ''}
          >
            {internship.isArchived ? (
              <>
                <ArchiveRestore className='size-3.5' />
                Restore
              </>
            ) : (
              <>
                <Archive className='size-3.5' />
                Archive
              </>
            )}
          </button>

          <button
            onClick={() => handleViewApplicants(internship)}
            className='cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors'
          >
            <Users className='size-3.5' />
            View Applicants
          </button>

          <button
            onClick={() => handleStatusChange(internship)}
            className='cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-[#432DD7] text-xs font-medium hover:bg-purple-100 transition-colors ml-auto'
          >
            <Zap className='size-3.5' />
            Set {internship.status === 'hiring' ? 'Filled' : 'Hiring'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout tabs={EMPLOYER_TABS} secondaryTabs={EMPLOYER_TABS_SECONDARY}>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-[#0F172B]'>Manage Internships</h1>
            <p className='text-sm text-[#62748E] mt-1'>
              Create, manage, and review internship opportunities for your company
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className='cursor-pointer flex items-center gap-2 px-3 py-2 bg-[#432DD7] text-white rounded-lg font-medium hover:bg-[#3826b8] transition-colors text-sm'
          >
            <Plus className='size-4' />
            Add Internship
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className='flex items-center gap-2'>
          {[
            { mode: 'active', label: 'Active', icon: Briefcase },
            { mode: 'archived', label: 'Archived', icon: Archive },
            { mode: 'all', label: 'All', icon: null },
          ].map(({ mode, label, icon: Icon }) => {
            const count = mode === 'active' ? activeCount : mode === 'archived' ? archivedCount : allCount
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`cursor-pointer px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  viewMode === mode
                    ? 'bg-[#432DD7] text-white'
                    : 'bg-gray-100 text-[#62748E] hover:bg-gray-200'
                }`}
              >
                {Icon && <Icon className='size-4' />}
                {label}
                <span className='text-xs opacity-75'>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>

        {/* Internships Grid */}
        <div className='space-y-4'>
          {myInternships.length === 0 ? (
            <div className='bg-white border border-[#E2E8F0] rounded-xl p-12 text-center'>
              <AlertCircle className='size-12 text-gray-300 mx-auto mb-3' />
              <p className='text-[#62748E] mb-2'>No internships in this category yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {myInternships.map(internship => renderInternshipCard(internship))}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {renderAddEditModal()}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6'>
            <div className='bg-white rounded-2xl w-full max-w-md shadow-2xl'>
              <div className='flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]'>
                <h2 className='text-xl font-semibold text-[#0F172B]'>Delete Internship</h2>
                <button onClick={handleCancelDelete} className='text-gray-400 hover:text-gray-600'>
                  <X className='size-5' />
                </button>
              </div>

              <div className='px-6 py-5'>
                <p className='text-sm text-[#45556C]'>
                  Are you sure you want to delete <span className='font-semibold text-[#0F172B]'>{deleteTarget.title}</span>?
                  This action cannot be undone.
                </p>
              </div>

              <div className='px-6 pb-6 flex gap-3'>
                <button
                  onClick={handleConfirmDelete}
                  className='cursor-pointer flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700'
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className='cursor-pointer flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default EmployerInternships
