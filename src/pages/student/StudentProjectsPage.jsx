import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { courses } from '../../data/courses'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { Star, ExternalLink, FolderKanban, ImageIcon, Link2, Plus, Search, Trash2, Video, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '',
  courseId: '',
  shortDescription: '',
  description: '',
  github: '',
  demoVideo: '',
  languages: [],
  visibility: 'private',
  showOnPortfolio: false,
}

const StudentProjectsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, addProject, updateProject, deleteProject } = useProjects()

  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [langInput, setLangInput] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [errors, setErrors] = useState({})

  const myProjects = projects.filter(
    p => p.creatorId === user.id || p.collaborators.includes(user.id)
  )

  const filteredProjects = searchQuery.trim()
    ? myProjects.filter(p => {
        const q = searchQuery.toLowerCase()
        const course = courses.find(c => c.id === p.courseId)
        return (
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.languages?.some(l => l.toLowerCase().includes(q)) ||
          course?.name.toLowerCase().includes(q) ||
          course?.code.toLowerCase().includes(q)
        )
      })
    : myProjects

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setLangInput('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setLangInput('')
    setErrors({})
  }

  const handleLangKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const lang = langInput.trim()
      if (lang && !form.languages.includes(lang)) {
        setForm(prev => ({ ...prev, languages: [...prev.languages, lang] }))
      }
      setLangInput('')
    }
  }

  const removeLang = (lang) =>
    setForm(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!form.title.trim()) newErrors.title = 'Project title is required.'
    if (!form.courseId) newErrors.courseId = 'Course is required.'
    if (!form.shortDescription.trim()) newErrors.shortDescription = 'Short description is required.'
    if (!form.description.trim()) newErrors.description = 'Project report is required.'
    if (!form.github.trim()) newErrors.github = 'GitHub link is required.'
    if (!form.demoVideo.trim()) newErrors.demoVideo = 'Demo video link is required.'
    if (form.languages.length === 0) newErrors.languages = 'At least one programming language is required.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields.')
      return
    }

    if (editingId) {
      updateProject(editingId, form)
      toast.success('Project updated!')
    } else {
      addProject({
        id: `p_${Date.now()}`,
        creatorId: user.id,
        collaborators: [],
        instructorIds: [],
        tasks: [],
        generalFeedback: [],
        thesisDrafts: null,
        isFlagged: false,
        flagReason: null,
        isActive: true,
        rating: null,
        createdAt: new Date().toISOString().split('T')[0],
        ...form,
      })
      toast.success('Project created!')
    }
    closeModal()
  }

  const handleDelete = (id) => {
    deleteProject(id)
    setDeleteConfirmId(null)
    toast.success('Project deleted.')
  }

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6 space-y-5 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0F172B]">My Projects</h1>
          <button
            onClick={openCreate}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8] transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, course, or language..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm text-[#0F172B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FolderKanban size={48} className="text-gray-200 mb-4" />
            {searchQuery ? (
              <>
                <p className="text-gray-500 font-medium mb-1">No results for "{searchQuery}"</p>
                <p className="text-sm text-gray-400">Try a different title, course, or language.</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 font-medium mb-1">No projects yet</p>
                <p className="text-sm text-gray-400">Click "New Project" to get started.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map(project => {
              const course = courses.find(c => c.id === project.courseId)
              return (
                <div
                  key={project.id}
                  onClick={() => navigate(`/student/projects/${project.id}`)}
                  className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4 p-4 cursor-pointer hover:shadow-md transition-all group"
                >


                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0F172B] group-hover:text-[#432DD7] transition-colors truncate">{project.title}</p>
                    <p className="text-xs text-[#45556C] mt-0.5 truncate">
                      {course ? `${course.code} — ${course.name}` : 'No course set'} · {project.createdAt}
                    </p>
                    {project.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{project.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {[...new Set(project.languages || [])].slice(0, 4).map(lang => (
                        <span key={lang} className="text-xs bg-[#EEF2FF] text-[#432DD7] px-2 py-0.5 rounded-md font-medium">{lang}</span>
                      ))}
                      {(project.languages?.length || 0) > 4 && (
                        <span className="text-xs text-gray-400">+{project.languages.length - 4}</span>
                      )}
                    </div>
                    {(project.github || project.demoVideo || project.reportUrl) && (
                      <div className="flex items-center gap-3 mt-2" onClick={e => e.stopPropagation()}>
                        {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="cursor-default flex items-center gap-1 text-xs text-[#45556C] hover:text-[#432DD7]"><Link2 size={11} /> GitHub</a>}
                        {project.demoVideo && <a href={project.demoVideo} target="_blank" rel="noreferrer" className="cursor-default flex items-center gap-1 text-xs text-[#45556C] hover:text-[#432DD7]"><Video size={11} /> Demo</a>}
                      </div>
                    )}
                  </div>

                  {/* Right: badge top, actions bottom */}
                  <div className="flex flex-col items-end justify-between shrink-0 self-stretch py-0.5" onClick={e => e.stopPropagation()}>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      project.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {project.visibility === 'public' ? 'Public' : 'Private'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setDeleteConfirmId(project.id)} className="p-1.5 text-[#45556C] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <ExternalLink size={15} className="text-gray-300 group-hover:text-[#432DD7] transition-colors shrink-0" />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-[#0F172B]">
                {editingId ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Title */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Smart Campus Navigator"
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-[#0F172B] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent ${
                    errors.title ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  Course <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.courseId}
                  onChange={e => setForm(prev => ({ ...prev, courseId: e.target.value }))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-[#0F172B] focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent bg-white ${
                    errors.courseId ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                >
                  <option value="">Select a course...</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                  ))}
                </select>
                {errors.courseId && <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={e => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief summary of the project"
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-[#0F172B] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent ${
                    errors.shortDescription ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
              </div>

              {/* Project Report */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  Project Report <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed project description"
                  rows={4}
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-[#0F172B] placeholder-gray-300 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent ${
                    errors.description ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  GitHub Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={form.github}
                  onChange={e => setForm(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/..."
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-[#0F172B] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent ${
                    errors.github ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.github && <p className="text-xs text-red-500 mt-1">{errors.github}</p>}
              </div>

              {/* Demo Video */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  Demo Video Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={form.demoVideo}
                  onChange={e => setForm(prev => ({ ...prev, demoVideo: e.target.value }))}
                  placeholder="https://youtube.com/..."
                  className={`w-full border rounded-lg px-3 py-2 text-sm text-[#0F172B] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7] focus:border-transparent ${
                    errors.demoVideo ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.demoVideo && <p className="text-xs text-red-500 mt-1">{errors.demoVideo}</p>}
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">
                  Programming Languages <span className="text-red-400">*</span>
                </label>
                <div className={`border rounded-lg p-3 min-h-18 ${
                  errors.languages ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'
                }`}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.languages.map(lang => (
                      <span key={lang} className="inline-flex items-center gap-1 bg-gray-100 text-[#45556C] text-xs px-2.5 py-1 rounded-md">
                        {lang}
                        <button type="button" onClick={() => removeLang(lang)} className="text-gray-400 hover:text-gray-600">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={langInput}
                    onChange={e => setLangInput(e.target.value)}
                    onKeyDown={handleLangKeyDown}
                    placeholder="Type a language and press Enter"
                    className="w-full text-sm text-gray-500 placeholder-gray-300 focus:outline-none"
                  />
                </div>
                {errors.languages && <p className="text-xs text-red-500 mt-1">{errors.languages}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 py-2 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8] transition-colors"
                >
                  {editingId ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="font-semibold text-[#0F172B] mb-2">Delete Project?</h3>
            <p className="text-sm text-[#45556C] mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentProjectsPage
