import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { internships } from '../../data/internships'
import { courses } from '../../data/courses'
import { majors } from '../../data/majors'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { BookOpen, ChevronRight, Code2, Edit2, Eye, EyeOff, FolderKanban, ImageIcon, Link2, Mail, MapPin, Save, Settings2, Star, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { employers } from '../../data/users'

// ─── Edit Profile Modal ──────────────────────────────────────────────────────

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [majorId,    setMajorId]    = useState(user.majorId   || '')
  const [classYear,  setClassYear]  = useState(user.classYear || '')
  const [linkedin,   setLinkedin]   = useState(user.linkedin  || '')
  const [github,     setGithub]     = useState(user.github    || '')
  const [shortBio,   setShortBio]   = useState(user.shortBio  || '')
  const [bio,        setBio]        = useState(user.bio       || '')
  const [skills,     setSkills]     = useState([...(user.skills || [])])
  const [skillInput, setSkillInput] = useState('')

  const isDirty =
    majorId   !== (user.majorId   || '') ||
    classYear !== (user.classYear || '') ||
    linkedin  !== (user.linkedin  || '') ||
    github    !== (user.github    || '') ||
    shortBio  !== (user.shortBio  || '') ||
    bio       !== (user.bio       || '') ||
    JSON.stringify(skills) !== JSON.stringify(user.skills || [])

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      const s = skillInput.trim()
      if (s && !skills.includes(s)) setSkills(p => [...p, s])
      setSkillInput('')
    }
  }

  const handleSave = () => {
    const selectedMajor = majors.find(m => m.id === majorId)
    onSave({ majorId, major: selectedMajor?.name, classYear, linkedin, github, shortBio, bio, skills })
    onClose()
    toast.success('Portfolio saved!')
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white z-10">
          <p className="font-semibold text-[#0F172B]">Edit Profile</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#45556C] mb-1.5">Major</label>
              <select value={majorId} onChange={e => setMajorId(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]">
                <option value="">Select Major</option>
                {majors.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#45556C] mb-1.5">Class of</label>
              <input type="text" value={classYear} onChange={e => setClassYear(e.target.value)}
                placeholder="e.g. 2026"
                className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">LinkedIn URL</label>
            <input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
          </div>
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">GitHub URL</label>
            <input type="url" value={github} onChange={e => setGithub(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
          </div>
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">Short Bio</label>
            <input type="text" value={shortBio} onChange={e => setShortBio(e.target.value)}
              placeholder="A brief description of yourself..."
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
          </div>
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">About / Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
              placeholder="Tell people about yourself..."
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
          </div>
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">Skills</label>
            <div className="border border-[#E2E8F0] rounded-lg p-3 min-h-[72px]">
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map(s => (
                  <span key={s} className="inline-flex items-center gap-1 bg-gray-100 text-[#45556C] text-xs px-2.5 py-1 rounded-md">
                    {s}
                    <button onClick={() => setSkills(p => p.filter(x => x !== s))} className="text-gray-400 hover:text-gray-600"><X size={11} /></button>
                  </span>
                ))}
              </div>
              <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown} placeholder="Type a skill and press Enter"
                className="w-full text-sm text-gray-500 placeholder-gray-300 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} disabled={!isDirty}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                isDirty ? 'bg-[#432DD7] text-white hover:bg-[#3826b8]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}>
              <Save size={14} /> Save Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

const StudentPortfolioPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { projects, updateProject } = useProjects()

  const [activeTab,     setActiveTab]     = useState('projects')
  const [showEditModal, setShowEditModal] = useState(false)

  const myProjects = projects.filter(
    p => (p.creatorId === user.id || p.collaborators.includes(user.id))
  )

  const completedInternships = internships.filter(i =>
    user.completedInternships?.includes(i.id)
  )

  const togglePortfolioVisibility = (e, project) => {
    e.stopPropagation()
    // Only allow toggling if project is public
    if (project.visibility === 'public') {
      updateProject(project.id, { showOnPortfolio: !project.showOnPortfolio })
    }
  }

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div>
        {/* ── Cover banner ── */}
        <div className="h-36 bg-linear-to-br from-[#0F172A] via-[#1e1b5e] to-[#432DD7]" />
        {/* ── Profile section ── */}
        <div className="px-8 pb-4">
          {/* Avatar + action row */}
          <div className="-mt-12 mb-3 flex items-end justify-between">
            <div className="relative">
              <img src={user.avatar} alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      updateUser({ avatar: reader.result })
                      toast.success('Profile photo updated!')
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
                id="avatar-upload"
              />
              <button
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="cursor-pointer absolute bottom-0 right-0 bg-[#432DD7] text-white rounded-full p-1.5 border-2 border-white hover:bg-[#3826b8] transition-colors"
                title="Change profile photo">
                <Edit2 size={12} />
              </button>
            </div>

            {/* Action buttons — aligned to bottom of banner area */}
            <div className="flex items-center gap-2 pb-1">
              <button onClick={() => setShowEditModal(true)}
                className="cursor-pointer flex items-center gap-1.5 border border-[#E2E8F0] bg-white text-[#45556C] text-xs font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit2 size={13} /> Edit Profile
              </button>
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" title="LinkedIn"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#0A66C2' }}>
                  in
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" title="GitHub"
                  className="w-8 h-8 rounded-lg bg-[#0F172B] flex items-center justify-center text-white hover:opacity-80 transition-opacity">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Name + info */}
          <h1 className="text-2xl font-bold text-[#0F172B]">{user.firstName} {user.lastName}</h1>
          <p className="text-sm text-[#45556C] mt-0.5">
            {user.major}{user.shortBio ? ` • ${user.shortBio}` : ''}
          </p>
          <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FolderKanban size={12} className="text-gray-400" /> {projects.filter(p => p.creatorId === user.id || p.collaborators.includes(user.id)).length} Project(s)
            </span>
            <span className="flex items-center gap-1"><Mail size={12} /> {user.email}</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex px-8 border-b border-[#E2E8F0]">
          {['projects', 'internships', 'about'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? 'border-[#432DD7] text-[#432DD7]'
                  : 'border-transparent text-[#45556C] hover:text-[#0F172B]'
              }`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Tab content + persistent sidebar ── */}
        <div className="px-8 py-5 grid grid-cols-[1fr_260px] gap-6 items-start">

          {/* Left: tab content */}
          <div>
            {/* Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                {myProjects.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8">No projects on portfolio yet. Star a project from My Projects to add it here.</p>
                ) : myProjects.map(project => {
                  const course = courses.find(c => c.id === project.courseId)
                  return (
                    <div key={project.id}
                      onClick={() => navigate(`/student/projects/${project.id}`)}
                      className="flex items-stretch gap-4 p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm cursor-pointer hover:shadow-md transition-all group">
                      <div className="flex-1 self-center min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-[#0F172B] group-hover:text-[#432DD7] transition-colors truncate">{project.title}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                            project.visibility === 'public' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {project.visibility === 'public' ? 'Public' : 'Private'}
                          </span>
                        </div>
                        <p className="text-xs text-[#45556C] mt-0.5">{course ? `${course.code} — ${course.name}` : ''}</p>
                        {project.languages?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {[...new Set(project.languages)].slice(0, 4).map(l => (
                              <span key={l} className="text-xs bg-[#EEF2FF] text-[#432DD7] px-2 py-0.5 rounded-md font-medium">{l}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-stretch gap-3 shrink-0">
                        <div className="flex flex-col items-end justify-between py-0.5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            project.showOnPortfolio ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {project.showOnPortfolio ? 'Visible' : 'Hidden'}
                          </span>
                          <button
                            onClick={(e) => togglePortfolioVisibility(e, project)}
                            disabled={project.visibility !== 'public'}
                            className={`p-1 rounded-md transition-colors ${
                              project.visibility === 'public'
                                ? 'text-[#432DD7] hover:bg-[#EEF2FF] cursor-pointer'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                            title={project.visibility !== 'public' ? 'Cannot toggle visibility for private projects' : 'Toggle portfolio visibility'}>
                            {project.showOnPortfolio ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#432DD7] transition-colors self-center" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Internships */}
            {activeTab === 'internships' && (
              <div className="space-y-3">
                {completedInternships.length === 0 ? (
                  <p className="text-sm text-gray-400 py-8">No completed internships yet.</p>
                ) : completedInternships.map(internship => {
                  const exp = user.internshipExperiences?.find(e => e.internshipId === internship.id)
                  return (
                    <div key={internship.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                      <img src={employers.find(e => e.id === internship.employerId)?.avatar} alt={internship.companyName} className="w-12 h-12 rounded-md object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-semibold text-[#0F172B]">{internship.title}</p>
                          {exp && <p className="text-xs text-gray-400 shrink-0">{exp.startDate} – {exp.endDate}</p>}
                        </div>
                        <p className="text-sm font-medium mt-0.5" style={{ color: internship.companyColor || '#432DD7' }}>{internship.companyName}</p>
                        {exp?.description && <p className="text-sm text-[#45556C] mt-1.5 leading-relaxed">{exp.description}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* About */}
            {activeTab === 'about' && (
              <div>
                {user.bio
                  ? <p className="text-sm text-[#45556C] leading-relaxed whitespace-pre-line">{user.bio}</p>
                  : <p className="text-sm text-gray-400">No bio yet. Click "Edit Profile" to add one.</p>
                }
              </div>
            )}
          </div>

          {/* Right: persistent sidebar */}
          <div className="space-y-4">

            {/* Academic Info */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <BookOpen size={11} className="text-gray-400" />
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Academic Info</p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Major</p>
                  <p className="text-sm font-semibold text-[#0F172B]">{user.major}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Expected Graduation</p>
                  <p className="text-sm font-semibold text-[#0F172B]">
                    {user.classYear ? `Class of ${user.classYear}` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            {user.skills?.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Code2 size={11} className="text-gray-400" />
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Skills</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map(s => (
                    <span key={s} className="text-xs border border-[#E2E8F0] text-[#45556C] px-2 py-0.5 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onSave={(updates) => updateUser(updates)}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </DashboardLayout>
  )
}

export default StudentPortfolioPage
