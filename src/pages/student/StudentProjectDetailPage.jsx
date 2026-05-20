import React, { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { students, instructors } from '../../data/users'
import { courses } from '../../data/courses'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, BookOpen, Calendar,
  Clock, Code2, Edit2, ExternalLink, Eye, FilePlus,
  Link2, MoreHorizontal, Plus, Search, Send, Share2, Star,
  Trash2, Upload, UserMinus, UserPlus, X,
} from 'lucide-react'
import toast from 'react-hot-toast'

// ─── helpers ─────────────────────────────────────────────────────────────────

const timeAgo = (d) => {
  if (!d) return ''
  const diff = Math.floor((new Date() - new Date(d)) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return '1 day ago'
  if (diff < 7) return `${diff} days ago`
  const w = Math.floor(diff / 7)
  return w === 1 ? '1 week ago' : `${w} weeks ago`
}

const initials = (p) => {
  if (!p) return '?'
  return `${p.firstName || ''} ${p.lastName || ''}`.trim().split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 3)
}

const COLORS = ['#432DD7','#22C55E','#F59E0B','#EF4444','#06B6D4','#8B5CF6','#EC4899']
const ac = (id) => COLORS[(id?.charCodeAt(1) || 0) % COLORS.length]

const allUsers = [...students, ...instructors]

const toEmbed = (url) => {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([A-Za-z0-9_-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

const EMPTY_TASK = { title:'', description:'', assignedTo:'', status:'pending', deadline:'' }
const INV_COLOR  = { accepted:'bg-green-100 text-green-700', pending:'bg-yellow-100 text-yellow-700', rejected:'bg-red-100 text-red-600' }
const VIS_STYLES = {
  public:  { on:'bg-green-500 text-white border-green-500', off:'bg-white text-[#45556C] border-[#E2E8F0] hover:bg-gray-50' },
  private: { on:'bg-gray-600 text-white border-gray-600',   off:'bg-white text-[#45556C] border-[#E2E8F0] hover:bg-gray-50' },
}
const VIS_LABELS = { public:'Public', private:'Private' }

// ─── Invite modal ────────────────────────────────────────────────────────────

const InviteModal = ({ project, isBachelor, onClose }) => {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [sent,    setSent]    = useState([])
  const { updateProject } = useProjects()
  const invitations = project.collaboratorInvitations || []

  const search = (q) => {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }
    const taken = invitations.map(i => i.userId)
    const pool  = [
      ...(isBachelor ? [] : students.filter(s => !taken.includes(s.id) && s.id !== project.creatorId)),
      ...instructors.filter(i => i.linkedCourses?.includes(project.courseId) && !taken.includes(i.id)),
    ]
    const ql = q.toLowerCase()
    setResults(pool.filter(p => p.email?.toLowerCase().includes(ql) || p.firstName?.toLowerCase().includes(ql) || p.lastName?.toLowerCase().includes(ql)).slice(0, 6))
  }

  const invite = (person) => {
    updateProject(project.id, { collaboratorInvitations: [...invitations, { userId: person.id, type: person.role === 'instructor' ? 'instructor' : 'student', status: 'pending', invitedAt: new Date().toISOString().split('T')[0] }] })
    setSent(p => [...p, person.id])
    toast.success(`Invitation sent to ${person.firstName} ${person.lastName}.`)
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <p className="font-semibold text-[#0F172B]">Invite Collaborators</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-4">
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
            <input type="text" value={query} onChange={e => search(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"/>
          </div>
          <div className="space-y-1 min-h-[60px]">
            {results.length === 0 && query.trim() && <p className="text-sm text-gray-400 text-center py-4">No results found.</p>}
            {results.map(person => {
              const alreadySent = sent.includes(person.id)
              return (
                <div key={person.id} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: ac(person.id) }}>
                    {initials(person).slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F172B]">{person.firstName} {person.lastName}</p>
                    <p className="text-xs text-gray-400">{person.role === 'instructor' ? person.researchInterests?.[0] || 'Instructor' : person.major || 'Student'}</p>
                  </div>
                  <button onClick={() => !alreadySent && invite(person)} disabled={alreadySent}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${alreadySent ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default' : 'bg-[#432DD7] text-white border-[#432DD7] hover:bg-[#3826b8]'}`}>
                    {alreadySent ? 'Invited' : 'Invite'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-[#E2E8F0]">
          <button onClick={onClose} className="px-5 py-2 bg-[#432DD7] text-white text-sm font-medium rounded-lg hover:bg-[#3826b8] transition-colors">Done</button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit project modal ───────────────────────────────────────────────────────

const EditModal = ({ project, onSave, onClose }) => {
  const [f, setF] = useState({ title:project.title, courseId:project.courseId, shortDescription:project.shortDescription||'', description:project.description||'', github:project.github||'', demoVideo:project.demoVideo||'', languages:[...(project.languages||[])], visibility:project.visibility })
  const [li, setLi] = useState('')
  const [errors, setErrors] = useState({})
  const onLang = (e) => { if(e.key==='Enter'){e.preventDefault(); const l=li.trim(); if(l&&!f.languages.includes(l)) setF(p=>({...p,languages:[...p.languages,l]})); setLi('')} }
  
  const validateAndSave = () => {
    const newErrors = {}
    if (!f.title.trim()) newErrors.title = 'Project title is required.'
    if (!f.courseId) newErrors.courseId = 'Course is required.'
    if (!f.shortDescription.trim()) newErrors.shortDescription = 'Short description is required.'
    if (!f.description.trim()) newErrors.description = 'Project report is required.'
    if (!f.github.trim()) newErrors.github = 'GitHub link is required.'
    if (!f.demoVideo.trim()) newErrors.demoVideo = 'Demo video link is required.'
    if (f.languages.length === 0) newErrors.languages = 'At least one programming language is required.'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields.')
      return
    }
    
    onSave(f)
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white z-10">
          <p className="font-semibold text-[#0F172B]">Edit Project</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-sm text-[#45556C] mb-1.5">Title <span className="text-red-400">*</span></label>
            <input type="text" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))} className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7] ${errors.title ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}/>
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div><label className="block text-sm text-[#45556C] mb-1.5">Course <span className="text-red-400">*</span></label>
            <select value={f.courseId} onChange={e=>setF(p=>({...p,courseId:e.target.value}))} className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#432DD7] ${errors.courseId ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}>
              <option value="">Select...</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.code} — {c.name}</option>)}
            </select>
            {errors.courseId && <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
          </div>
          <div><label className="block text-sm text-[#45556C] mb-1.5">Short Description <span className="text-red-400">*</span></label>
            <input type="text" value={f.shortDescription} onChange={e=>setF(p=>({...p,shortDescription:e.target.value}))} placeholder="Brief summary of the project" className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7] ${errors.shortDescription ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}/>
            {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
          </div>
          <div><label className="block text-sm text-[#45556C] mb-1.5">Project Report <span className="text-red-400">*</span></label>
            <textarea value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} rows={4} className={`w-full border rounded-lg px-3 py-2 text-sm resize-vertical focus:outline-none focus:ring-2 focus:ring-[#432DD7] ${errors.description ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}/>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          {[['GitHub Link','github','https://github.com/...'],['Demo Video','demoVideo','https://youtube.com/...']].map(([lbl,k,ph])=>(
            <div key={k}><label className="block text-sm text-[#45556C] mb-1.5">{lbl} <span className="text-red-400">*</span></label>
              <input type="url" value={f[k]} onChange={e=>setF(p=>({...p,[k]:e.target.value}))} placeholder={ph} className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#432DD7] ${errors[k] ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}/>
              {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
            </div>
          ))}
          <div><label className="block text-sm text-[#45556C] mb-1.5">Languages <span className="text-red-400">*</span></label>
            <div className={`border rounded-lg p-3 min-h-[60px] ${errors.languages ? 'border-red-400 bg-red-50' : 'border-[#E2E8F0]'}`}>
              <div className="flex flex-wrap gap-2 mb-2">
                {f.languages.map(l=><span key={l} className="inline-flex items-center gap-1 bg-gray-100 text-[#45556C] text-xs px-2.5 py-1 rounded-md">{l}<button type="button" onClick={()=>setF(p=>({...p,languages:p.languages.filter(x=>x!==l)}))  } className="text-gray-400 hover:text-gray-600"><X size={11}/></button></span>)}
              </div>
              <input type="text" value={li} onChange={e=>setLi(e.target.value)} onKeyDown={onLang} placeholder="Type and press Enter" className="w-full text-sm text-gray-500 placeholder-gray-300 focus:outline-none"/>
            </div>
            {errors.languages && <p className="text-xs text-red-500 mt-1">{errors.languages}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="cursor-pointer flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50">Cancel</button>
            <button onClick={validateAndSave} className="cursor-pointer flex-1 py-2 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8]">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Task modal ───────────────────────────────────────────────────────────────

const TaskModal = ({ task, isBachelor, collaborators, creatorId, onSave, onClose }) => {
  const [f, setF] = useState(task || EMPTY_TASK)
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <p className="font-semibold text-[#0F172B]">{task?'Edit Task':'New Task'}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div><label className="block text-sm text-[#45556C] mb-1.5">Title <span className="text-red-400">*</span></label>
            <input type="text" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"/></div>
          <div><label className="block text-sm text-[#45556C] mb-1.5">Description</label>
            <input type="text" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} placeholder="One-line description" className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"/></div>
          {!isBachelor && <div><label className="block text-sm text-[#45556C] mb-1.5">Assign to</label>
            <select value={f.assignedTo} onChange={e=>setF(p=>({...p,assignedTo:e.target.value}))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#432DD7]">
              <option value="">Unassigned</option>
              {[...collaborators, students.find(s=>s.id===creatorId)].filter(Boolean).map(s=><option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
            </select></div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-[#45556C] mb-1.5">Status</label>
              <select value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#432DD7]">
                {['pending','in progress','postponed','completed'].map(s=><option key={s} value={s}>{s}</option>)}
              </select></div>
            <div><label className="block text-sm text-[#45556C] mb-1.5">Deadline</label>
              <input type="date" value={f.deadline} onChange={e=>setF(p=>({...p,deadline:e.target.value}))} className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"/></div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#45556C] hover:bg-gray-50">Cancel</button>
            <button onClick={()=>{if(f.title.trim()){onSave(f);onClose()}else toast.error('Title required')}} className="flex-1 py-2 bg-[#432DD7] text-white rounded-lg text-sm hover:bg-[#3826b8]">{task?'Save':'Create'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const StudentProjectDetailPage = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { projects, updateProject, deleteProject } = useProjects()

  const [activeTab,    setActiveTab]    = useState('overview')
  const [showEdit,     setShowEdit]     = useState(false)
  const [showInvite,   setShowInvite]   = useState(false)
  const [showTaskMod,  setShowTaskMod]  = useState(false)
  const [editingTask,  setEditingTask]  = useState(null)
  const [delTaskId,    setDelTaskId]    = useState(null)
  const [newMsg,       setNewMsg]       = useState('')
  const [draftName,    setDraftName]    = useState('')
  const [draftUrl,     setDraftUrl]     = useState('')
  const [invQuery,     setInvQuery]     = useState('')
  const [invResults,   setInvResults]   = useState([])
  const [delProjectId, setDelProjectId] = useState(null)
  const [delCollabId,  setDelCollabId]  = useState(null)

  const project = projects.find(p => p.id === id)
  if (!project) return <Navigate to="/student/projects" />

  const course     = courses.find(c => c.id === project.courseId)
  const isCreator  = project.creatorId === user.id
  const isBachelor = project.courseId === 'c5'
  const isCollab   = project.collaborators.includes(user.id)
  if (!isCreator && !isCollab) return <Navigate to="/student/projects" />

  const collabUsers   = students.filter(s => project.collaborators.includes(s.id))
  const projInst      = instructors.filter(i => project.instructorIds?.includes(i.id))
  const invitations   = project.collaboratorInvitations || []
  const tasks         = project.tasks || []
  const discussion    = project.discussion || []

  const TABS = [
    {id:'overview', label:'Overview'},
    {id:'tasks',    label:'Tasks'},
    ...(isBachelor ? [{id:'drafts', label:'Drafts'}] : []),
    {id:'feedback', label:'Feedback & Comments'},
    {id:'settings', label:'Visibility & Settings'},
  ]
  // handlers
  const handleShare = () => { navigator.clipboard.writeText(`${window.location.origin}/student/projects/${project.id}`).then(()=>toast.success('Project link copied!')) }
  const setTaskStatus = (tid, s) => updateProject(project.id, { tasks: tasks.map(t => t.id===tid ? {...t,status:s} : t) })
  const moveTask = (idx, dir) => { const a=[...tasks]; const sw=idx+dir; if(sw<0||sw>=a.length) return; [a[idx],a[sw]]=[a[sw],a[idx]]; updateProject(project.id,{tasks:a}) }
  const deleteTask = (tid) => { updateProject(project.id,{tasks:tasks.filter(t=>t.id!==tid)}); setDelTaskId(null); toast.success('Task deleted.') }
  const addTask  = (f) => { updateProject(project.id,{tasks:[...tasks,{id:`t_${Date.now()}`,instructorComments:[],...f}]}); toast.success('Task created.') }
  const saveTask = (f) => { updateProject(project.id,{tasks:tasks.map(t=>t.id===editingTask.id?{...t,...f}:t)}); toast.success('Task updated.') }
  const sendMsg = () => {
    if(!newMsg.trim()) return
    updateProject(project.id,{discussion:[...discussion,{id:`m_${Date.now()}`,userId:user.id,message:newMsg.trim(),createdAt:new Date().toISOString().split('T')[0]}]})
    setNewMsg('')
  }
  const addDraft = () => {
    if(!draftName.trim()||!draftUrl.trim()){toast.error('Name and URL required');return}
    updateProject(project.id,{thesisDrafts:[...(project.thesisDrafts||[]),{id:`d_${Date.now()}`,name:draftName.trim(),url:draftUrl.trim(),uploadedAt:new Date().toISOString().split('T')[0],isFinal:false,isVisible:true}]})
    setDraftName('');setDraftUrl('');toast.success('Draft added.')
  }
  const markFinal = (did) => { updateProject(project.id,{thesisDrafts:(project.thesisDrafts||[]).map(d=>d.id===did?{...d,isFinal:true,isVisible:true}:{...d,isFinal:false,isVisible:false})}); toast.success('Final draft set.') }
  const searchInvite = (q) => {
    setInvQuery(q); if(!q.trim()){setInvResults([]);return}
    const taken = invitations.map(i=>i.userId)
    const pool = [...(isBachelor?[]:students.filter(s=>s.id!==user.id&&!taken.includes(s.id))), ...instructors.filter(i=>i.linkedCourses?.includes(project.courseId)&&!taken.includes(i.id))]
    const ql = q.toLowerCase()
    setInvResults(pool.filter(p=>p.email?.toLowerCase().includes(ql)||p.firstName?.toLowerCase().includes(ql)||p.lastName?.toLowerCase().includes(ql)).slice(0,5))
  }
  const sendInvite = (person) => {
    updateProject(project.id,{collaboratorInvitations:[...invitations,{userId:person.id,type:person.role==='instructor'?'instructor':'student',status:'pending',invitedAt:new Date().toISOString().split('T')[0]}]})
    setInvQuery('');setInvResults([]);toast.success(`Invitation sent to ${person.firstName} ${person.lastName}.`)
  }
  const cancelInvite = (uid) => updateProject(project.id,{collaboratorInvitations:invitations.filter(i=>i.userId!==uid)})
  const removeCollab = (uid) => updateProject(project.id,{collaborators:project.collaborators.filter(x=>x!==uid),collaboratorInvitations:invitations.filter(i=>i.userId!==uid)})
  const archive = () => { updateProject(project.id,{isActive:false}); toast.success('Archived.'); navigate('/student/projects') }

  let noThesisFeedback = true;

  // kanban columns
  const colDefs = [
    {label:'TO DO',       color:'text-gray-500',  tasks: tasks.filter(t=>['pending','postponed'].includes(t.status))},
    {label:'IN PROGRESS', color:'text-blue-600',   tasks: tasks.filter(t=>t.status==='in progress')},
    {label:'DONE',        color:'text-green-600',  tasks: tasks.filter(t=>t.status==='completed')},
  ]

  // ── task card ────────────────────────────────────────────────────────────────
  const TaskCard = ({ task }) => {
    const assignee = allUsers.find(u=>u.id===task.assignedTo)
    const [open, setOpen] = useState(false)
    const canEdit = isCreator
    const canStatus = isCreator || task.assignedTo === user.id
    return (
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-3 shadow-sm">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-medium text-[#0F172B] leading-snug flex-1">{task.title}</p>
          {(canEdit||canStatus) && (
            <div className="relative shrink-0">
              <button onClick={()=>setOpen(o=>!o)} className="cursor-pointer text-gray-400 hover:text-gray-600 p-0.5"><MoreHorizontal size={14}/></button>
              {open && (
                <div className="absolute right-0 top-6 bg-white rounded-lg border border-[#E2E8F0] shadow-lg z-20 py-1 w-44" onMouseLeave={()=>setOpen(false)}>
                  {canStatus && ['pending','in progress','postponed','completed'].filter(s=>s!==task.status).map(s=>(
                    <button key={s} onClick={()=>{setTaskStatus(task.id,s);setOpen(false)}} className="block w-full text-left px-3 py-1.5 text-xs text-[#45556C] hover:bg-gray-50 capitalize">{s}</button>
                  ))}
                  {canEdit && <>
                    <div className="border-t border-[#E2E8F0] my-1"/>
                    <button onClick={()=>{setEditingTask(task);setShowTaskMod(true);setOpen(false)}} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-[#45556C] hover:bg-gray-50"><Edit2 size={11}/> Edit</button>
                    <button onClick={()=>{setDelTaskId(task.id);setOpen(false)}} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"><Trash2 size={11}/> Delete</button>
                    <div className="border-t border-[#E2E8F0] my-1"/>
                    <button onClick={()=>{moveTask(tasks.indexOf(task),-1);setOpen(false)}} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-[#45556C] hover:bg-gray-50"><ArrowUp size={11}/> Move up</button>
                    <button onClick={()=>{moveTask(tasks.indexOf(task),1);setOpen(false)}} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-[#45556C] hover:bg-gray-50"><ArrowDown size={11}/> Move down</button>
                  </>}
                </div>
              )}
            </div>
          )}
        </div>
        {assignee && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{backgroundColor:ac(assignee.id)}}>
              {initials(assignee).slice(0,2)}
            </div>
            <p className="text-xs text-gray-400">{assignee.firstName} {assignee.lastName}</p>
          </div>
        )}
        {task.deadline && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Calendar size={10}/> {task.deadline}</p>}
      </div>
    )
  }

  // ── sidebar ─────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Project Details</p>
        <div className="space-y-3">
          {course && <div className="flex items-start gap-2"><BookOpen size={13} className="text-gray-400 mt-0.5 shrink-0"/><div><p className="text-xs text-gray-400">Course</p><p className="text-sm font-semibold text-[#432DD7]">{course.code}: {course.name}</p></div></div>}
          {project.semester && <div className="flex items-start gap-2"><Clock size={13} className="text-gray-400 mt-0.5 shrink-0"/><div><p className="text-xs text-gray-400">Semester</p><p className="text-sm font-semibold text-[#0F172B]">{project.semester}</p></div></div>}
          {project.rating && <div className="flex items-start gap-2"><Star size={13} className="text-yellow-400 mt-0.5 shrink-0 fill-yellow-400"/><div><p className="text-xs text-gray-400">Rating</p><p className="text-sm font-semibold text-[#0F172B]">{project.rating} / 5</p></div></div>}
        </div>
      </div>
      {project.languages?.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Technologies</p>
          <div className="flex flex-wrap gap-1.5">
            {[...new Set(project.languages)].map(l=><span key={l} className="text-xs border border-[#E2E8F0] text-[#45556C] px-2 py-0.5 rounded-md">{l}</span>)}
          </div>
        </div>
      )}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Team</p>
        <div className="space-y-2">
          {[project.creatorId,...project.collaborators].map(mid=>{
            const m=students.find(s=>s.id===mid); if(!m) return null
            return <div key={mid} className="flex items-center gap-2"><img src={m.avatar} alt="" className="w-8 h-8 rounded-full object-cover"/><div><p className="text-sm font-medium text-[#0F172B]">{m.firstName} {m.lastName}</p><p className="text-[10px] font-semibold text-gray-400 uppercase">{mid===project.creatorId?'Owner':'Member'}</p></div></div>
          })}
        </div>
      </div>
      {projInst.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Mentored By</p>
          <div className="space-y-2">
            {projInst.map(ins=><div key={ins.id} className="flex items-center gap-2"><img src={ins.avatar} alt="" className="w-8 h-8 rounded-full object-cover"/><div><p className="text-sm font-medium text-[#0F172B]">{ins.firstName} {ins.lastName}</p><p className="text-xs text-gray-400">{ins.title||'Instructor'}</p></div></div>)}
          </div>
        </div>
      )}
    </div>
  )

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-8 py-5">
        <button onClick={()=>navigate(-1)} className="cursor-pointer flex items-center gap-1.5 text-xs text-[#45556C] hover:text-[#432DD7] mb-4 transition-colors">
          <ArrowLeft size={13}/> Back
        </button>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#EEF2FF] text-[#432DD7] text-xs font-bold px-2.5 py-1 rounded-md">{course?.code}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase ${(project.visibilityMode||project.visibility)==='public'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
              {(project.visibilityMode||project.visibility)==='public'?'Public':'Private'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isCreator && <button onClick={()=>setShowEdit(true)} className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-[#45556C] border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"><Edit2 size={12}/> Edit</button>}
            {isCreator && <button onClick={()=>setShowInvite(true)} className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold bg-[#432DD7] text-white px-3 py-1.5 rounded-lg hover:bg-[#3826b8] transition-colors"><UserPlus size={12}/> Invite</button>}
            {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-[#45556C] border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"><img src="/githubLogo.svg" alt="GitHub" className="w-4 h-4"/></a>}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172B] mb-1">{project.title}</h1>
        {project.shortDescription && <p className="text-sm text-[#45556C] max-w-2xl leading-relaxed">{project.shortDescription}</p>}
      </div>

      {/* Tabs */}
      <div className="flex px-8 border-b border-[#E2E8F0] bg-white">
        {TABS.map(t=><button key={t.id} onClick={()=>setActiveTab(t.id)} className={`cursor-pointer px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab===t.id?'border-[#432DD7] text-[#432DD7]':'border-transparent text-[#45556C] hover:text-[#0F172B]'}`}>{t.label}</button>)}
      </div>

      {/* Content + sidebar */}
      <div className="px-8 py-6 grid grid-cols-[1fr_400px] gap-8 items-start">

        {/* Left */}
        <div>
          {/* OVERVIEW */}
          {activeTab==='overview' && (
            <div className="space-y-6">
              <div><h2 className="text-lg text-navy font-semibold mb-2">Project Report</h2><p className="text-sm text-[#364153] leading-relaxed">{project.description||'No description.'}</p></div>
              {project.demoVideo && (
                <>
                  <h2 className="text-lg text-navy font-semibold mb-3">Demo Video</h2>
                  <iframe src={toEmbed(project.demoVideo)} className="w-full aspect-video rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="demo"/>
                </>
              )}
              {!project.demoVideo && (
                <>
                  <h2 className="text-lg text-navy font-semibold mb-3">Demo Video</h2>
                  <div className='w-full aspect-video rounded-2xl bg-[#E2E8F0] flex items-center justify-center'>
                      <p className='text-sm text-[#62748E]'>No demo video available.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TASKS – Kanban */}
          {activeTab==='tasks' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-[#0F172B]">Task Management</h2>
                {isCreator && <button onClick={()=>{setEditingTask(null);setShowTaskMod(true)}} className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold bg-[#432DD7] text-white px-3 py-1.5 rounded-lg hover:bg-[#3826b8] transition-colors"><Plus size={13}/> Add Task</button>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {colDefs.map(col=>(
                  <div key={col.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <p className={`text-[10px] font-bold uppercase tracking-wider ${col.color}`}>{col.label}</p>
                      <span className="text-[10px] font-semibold bg-white border border-[#E2E8F0] text-gray-400 px-1.5 py-0.5 rounded-full">{col.tasks.length}</span>
                    </div>
                    <div className="space-y-2">
                      {col.tasks.map(t=><TaskCard key={t.id} task={t}/>)}
                      {col.tasks.length===0 && <p className="text-xs text-gray-300 text-center py-4">Empty</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DRAFTS */}
          {activeTab==='drafts' && isBachelor && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#0F172B]">Thesis Drafts</h2>
              {isCreator && (
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors" onClick={() => document.getElementById('draft-upload')?.click()}>
                  <Upload size={24} className="text-gray-300 mx-auto mb-2"/>
                  <p className="text-sm text-gray-500 font-medium">Click or drag PDF files here</p>
                  <p className="text-xs text-gray-400 mt-1">Max size 20MB. Uploading a final draft locks previous versions.</p>
                  <input id="draft-upload" type="file" accept=".pdf" multiple className="hidden" onChange={(e) => {
                    Array.from(e.target.files || []).forEach(file => {
                      if (file.type === 'application/pdf' && file.size <= 20 * 1024 * 1024) {
                        const reader = new FileReader()
                        reader.onload = (event) => {
                          updateProject(project.id, {thesisDrafts: [...(project.thesisDrafts||[]), {id: `d_${Date.now()}`, name: file.name, url: event.target?.result, uploadedAt: new Date().toISOString().split('T')[0], isFinal: false, isVisible: true}]})
                          toast.success('Draft uploaded.')
                        }
                        reader.readAsDataURL(file)
                      } else {
                        toast.error('File must be PDF and under 20MB')
                      }
                    })
                    e.target.value = ''
                  }} />
                </div>
              )}
              {(project.thesisDrafts||[]).length===0 ? <p className="text-sm text-gray-400">No drafts yet.</p>
                : (project.thesisDrafts||[]).map(d=>(
                  <div key={d.id} className={`flex items-center gap-4 p-4 rounded-xl border ${d.isFinal?'border-[#432DD7] bg-[#EEF2FF]/30':'border-[#E2E8F0] bg-white'}`}>
                    <FilePlus size={18} className={d.isFinal?'text-[#432DD7]':'text-gray-400'}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#0F172B] truncate">{d.name}</p>
                        {d.isFinal && <span className="text-[10px] font-bold bg-[#432DD7] text-white px-2 py-0.5 rounded-full shrink-0">Final Draft</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">Uploaded {d.uploadedAt}{!d.isVisible?' · private':''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a href={d.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-[#45556C] border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-gray-50">Download</a>
                      {isCreator && !d.isFinal && <button onClick={()=>markFinal(d.id)} className="text-xs font-medium text-[#432DD7] border border-[#432DD7] px-3 py-1.5 rounded-lg hover:bg-[#EEF2FF]">Set as Final</button>}
                      {isCreator && <button onClick={()=>updateProject(project.id,{thesisDrafts:(project.thesisDrafts||[]).filter(x=>x.id!==d.id)})} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>}
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* FEEDBACK & COMMENTS */}
          {activeTab==='feedback' && (
            <div className="space-y-6">

              {/* General Feedback */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">General Feedback</p>
              {(project.generalFeedback||[]).length > 0 && (
                <div>
                  <div className="space-y-3">
                    {project.generalFeedback.map((fb, i) => {
                      const ins = allUsers.find(u => u.id === fb.instructorId)
                      return (
                        <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={ins?.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0"/>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[#0F172B]">{ins?`${ins.firstName} ${ins.lastName}`:'Instructor'}</p>
                              <p className="text-xs text-gray-400">{fb.createdAt}</p>
                            </div>
                            {fb.rating && (
                              <div className="flex items-center gap-0.5 shrink-0">
                                {[1,2,3,4,5].map(s=><Star key={s} size={12} className={s<=fb.rating?'text-yellow-400 fill-yellow-400':'text-gray-200'}/>)}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-[#45556C]">{fb.comment}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {(project.generalFeedback||[]).length === 0 && <p className="text-sm text-gray-400">No general feedback yet.</p>}

              {/* Task Comments */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Task Comments</p>
              {(() => {
                const taskComments = tasks.flatMap(t =>
                  (t.instructorComments||[]).map(c => ({ ...c, taskTitle: t.title }))
                ).filter(c => c.comment)
                if (!taskComments.length) return (<p className="text-sm text-gray-400">No comments on tasks yet.</p>)
                return (
                  <div>
                    <div className="space-y-3">
                      {taskComments.map((c, i) => {
                        const ins = allUsers.find(u => u.id === c.instructorId)
                        return (
                          <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3">
                            <div className="flex items-center gap-3 mb-2">
                              <img src={ins?.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0"/>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#0F172B]">{ins?`${ins.firstName} ${ins.lastName}`:'Instructor'}</p>
                                <p className="text-xs text-gray-400">{c.createdAt}</p>
                              </div>
                              <span className="shrink-0 text-xs bg-[#EEF2FF] text-[#432DD7] px-2 py-0.5 rounded-full font-medium">{c.taskTitle}</span>
                            </div>
                            <p className="text-sm text-[#45556C]">{c.comment}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()
              }

              {/* Thesis Feedback */}
              {isBachelor && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Thesis Feedback</p>
                  <div className="space-y-3">
                    {(project.thesisDrafts).map((fb, i) => {
                      const ins = instructors.find(u => u.id === fb.instructorFeedback?.[0]?.instructorId)
                      if (!ins) {
                        return null
                      }
                      noThesisFeedback = false;
                      return (
                        <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={ins.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0"/>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#0F172B]">{ins?`${ins.firstName} ${ins.lastName}`:'Instructor'}</p>
                              <p className="text-xs text-gray-400">{fb.uploadedAt}</p>
                            </div>
                            {fb.name && <span className="shrink-0 text-xs bg-[#EEF2FF] text-[#432DD7] px-2 py-0.5 rounded-full font-medium truncate max-w-[140px]">{fb.name}</span>}
                          </div>
                          <p className="text-sm text-[#45556C]">{fb.instructorFeedback?.[0]?.comment}</p>
                        </div>
                      )
                    })}

                    {(noThesisFeedback) && <p className="text-sm text-gray-400">No feedback on thesis drafts yet.</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {activeTab==='settings' && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <p className="font-semibold text-[#0F172B] mb-4">Visibility & Collaboration Settings</p>
                <p className="text-sm font-medium text-[#45556C] mb-2">Project Visibility</p>
                <div className="flex gap-2 mb-5">
                  {[['public','Public'],['private','Private']].map(([v,lbl])=>{
                    const active = (project.visibilityMode||project.visibility)===v
                    const s = VIS_STYLES[v]
                    return (
                      <button key={v} onClick={()=>{
                        if(!isCreator||active) return
                        updateProject(project.id,{visibilityMode:v,visibility:v==='private'?'private':'public'})
                        toast.success(`Project visibility set to ${VIS_LABELS[v]}`)
                      }} className={`px-5 py-1.5 text-sm font-medium rounded-lg border transition-colors ${active?s.on:s.off} ${isCreator&&!active?'cursor-pointer':'cursor-default'}`}>{lbl}</button>
                    )
                  })}
                </div>
                {!isBachelor && isCreator && <>
                  <p className="text-sm font-medium text-[#45556C] mb-1">Manage Collaborators</p>
                  <p className="text-xs text-gray-400 mb-3">Invite team members or course instructors.</p>
                  <div className="relative mb-4">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" value={invQuery} onChange={e=>searchInvite(e.target.value)} placeholder="Search by name or email..."
                      className="w-full pl-8 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#432DD7]"/>
                    {invResults.length>0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-[#E2E8F0] rounded-lg shadow-lg overflow-hidden">
                        {invResults.map(p=>(
                          <button key={p.id} onClick={()=>sendInvite(p)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#EEF2FF] text-left">
                            <img src={p.avatar} className="w-7 h-7 rounded-full" alt=""/>
                            <div><p className="text-sm font-medium text-[#0F172B]">{p.firstName} {p.lastName}</p><p className="text-xs text-gray-400">{p.email} · {p.role.charAt(0).toUpperCase() + p.role.slice(1)}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>}
                <div className="space-y-2">
                  {invitations.length===0 && <p className="text-sm text-gray-400">No invitations yet.</p>}
                  {invitations.map(inv=>{
                    const p=allUsers.find(u=>u.id===inv.userId)
                    return (
                      <div key={inv.userId} className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0]">
                        <div className="flex items-center gap-3">
                          <img src={p?.avatar} className="w-8 h-8 rounded-full" alt=""/>
                          <div><p className="text-sm font-medium text-[#0F172B]">{p?`${p.firstName} ${p.lastName}`:inv.userId}</p><p className="text-xs text-gray-400">{inv.type.charAt(0).toUpperCase() + inv.type.slice(1)} · {inv.invitedAt}</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium uppercase ${INV_COLOR[inv.status]||''}`}>{inv.status}</span>
                          {isCreator&&inv.status==='pending'&&<button onClick={()=>cancelInvite(inv.userId)} className="cursor-pointer p-1 text-gray-400 hover:text-red-500"><X size={14}/></button>}
                          {isCreator&&inv.status==='accepted'&&inv.type==='student'&&<button onClick={()=>setDelCollabId(inv.userId)} className="cursor-pointer p-1 text-gray-400 hover:text-red-500"><UserMinus size={14}/></button>}
                          {isCreator&&inv.status==='accepted'&&inv.type==='instructor'&&<button onClick={()=>{}} className="cursor-not-allowed p-1 text-gray-300"><UserMinus size={14}/></button>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {isCreator && (
                <div className="flex items-center justify-between bg-white rounded-xl border border-red-200 p-4">
                  <div>
                    <p className="text-sm font-semibold text-red-600 flex items-center gap-1.5"><AlertTriangle size={14}/> Delete Project</p>
                    <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone. The project will be permanently deleted.</p>
                  </div>
                  <button onClick={() => setDelProjectId(project.id)} className="cursor-pointer px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors shrink-0 ml-4">Delete</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar/>
      </div>

      {/* Modals */}
      {showEdit && <EditModal project={project} onSave={f=>{updateProject(project.id,f);toast.success('Project updated!')}} onClose={()=>setShowEdit(false)}/>}
      {showInvite && <InviteModal project={project} isBachelor={isBachelor} onClose={()=>setShowInvite(false)}/>}
      {showTaskMod && <TaskModal task={editingTask} isBachelor={isBachelor} collaborators={collabUsers} creatorId={project.creatorId} onSave={editingTask?saveTask:addTask} onClose={()=>{setShowTaskMod(false);setEditingTask(null)}}/>}
      {delTaskId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <p className="font-semibold text-[#0F172B] mb-1">Delete Task?</p>
            <p className="text-sm text-[#45556C] mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelTaskId(null)} className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#45556C] hover:bg-gray-50">Cancel</button>
              <button onClick={()=>deleteTask(delTaskId)} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
      {delProjectId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <p className="font-semibold text-[#0F172B] mb-1">Delete Project?</p>
            <p className="text-sm text-[#45556C] mb-5">This action cannot be undone. The project will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelProjectId(null)} className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#45556C] hover:bg-gray-50">Cancel</button>
              <button onClick={()=>{deleteProject(delProjectId);toast.success('Project deleted.');navigate('/student/projects')}} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
      {delCollabId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <p className="font-semibold text-[#0F172B] mb-1">Remove Collaborator?</p>
            <p className="text-sm text-[#45556C] mb-5">This collaborator will be removed from the project.</p>
            <div className="flex gap-3">
              <button onClick={()=>setDelCollabId(null)} className="flex-1 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#45556C] hover:bg-gray-50">Cancel</button>
              <button onClick={()=>{removeCollab(delCollabId);setDelCollabId(null);toast.success('Collaborator removed.')}} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentProjectDetailPage
