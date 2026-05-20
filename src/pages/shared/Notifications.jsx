import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { notifications as initialNotifs } from '../../data/notifications'
import {
  STUDENT_TABS, STUDENT_TABS_SECONDARY,
  EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY,
  INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY,
  ADMIN_TABS, ADMIN_TABS_SECONDARY,
} from '../../data/tabs'
import { AlertTriangle, BellOff, Briefcase, CheckCircle2, Flag, Mail, MessageSquare, Send, UserPlus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000)
  if (diff < 3600) { const m = Math.max(1, Math.floor(diff / 60)); return `${m} min${m !== 1 ? 's' : ''} ago` }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return `${h} hour${h !== 1 ? 's' : ''} ago` }
  const d = Math.floor(diff / 86400)
  return d === 1 ? '1 day ago' : `${d} days ago`
}

const getNotifIcon = (type) => {
  const icons = {
    invitation: '👥',
    feedback: '💬',
    internship: '💼',
    system: '✓',
    deadline: '⏰',
    flag: '🚩',
    message: '✉️',
  }
  return icons[type] || '📢'
}

const roleTabs = {
  student: { tabs: STUDENT_TABS, secondaryTabs: STUDENT_TABS_SECONDARY },
  instructor: { tabs: INSTRUCTOR_TABS, secondaryTabs: INSTRUCTOR_TABS_SECONDARY },
  employer: { tabs: EMPLOYER_TABS, secondaryTabs: EMPLOYER_TABS_SECONDARY },
  admin: { tabs: ADMIN_TABS, secondaryTabs: ADMIN_TABS_SECONDARY },
}

const canDisableNotifications = (role) => ['student', 'employer', 'instructor'].includes(role)

const getNotificationRoute = (notif, role) => {
  if (notif.type === 'message') return '/messages'
  if (notif.type === 'internship') return role === 'employer' ? '/employer/applicants' : '/student/applications'
  if (notif.type === 'invitation') {
    if (role === 'student') return '/student/invitations'
    if (role === 'instructor') return '/instructor/invitations'
    return `/dashboard`
  }
  if (notif.type === 'system' && role === 'admin') return '/admin/courses'
  if (notif.type === 'flag' || notif.type === 'feedback' || notif.type === 'deadline') {
    if (role === 'student') return '/student/projects'
    if (role === 'admin') return '/admin/moderation'
    return `/dashboard`
  }
  return `/dashboard`
}

const getNotificationRouteLabel = (route) => {
  const labelMap = {
    '/messages': 'View messages →',
    '/student/applications': 'View applications →',
    '/employer/applicants': 'View applicants →',
    '/student/invitations': 'View invitations →',
    '/instructor/invitations': 'View invitations →',
    '/student/projects': 'View my projects →',
    '/admin/moderation': 'View moderation →',
    '/admin/courses': 'View course requests →',
  }
  return labelMap[route] || 'View related page →'
}

const AppealModal = ({ project, onSubmit, onClose }) => {
  const [text, setText] = useState('')
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <p className="font-semibold text-[#0F172B]">Submit Appeal</p>
            <p className="text-xs text-gray-400 mt-0.5">For: {project?.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          {project?.flagReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1.5"><Flag size={12} /> Flag Reason</p>
              <p className="text-sm text-[#45556C]">{project.flagReason}</p>
            </div>
          )}
          <div>
            <label className="block text-sm text-[#45556C] mb-1.5">Your Appeal <span className="text-red-400">*</span></label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={5}
              placeholder="Explain your point of view and why this project should be unflagged..."
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#432DD7]"
            />
            <p className="text-xs text-gray-400 mt-1">{text.length} characters</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50 cursor-pointer">Cancel</button>
            <button
              onClick={() => { if (!text.trim()) { toast.error('Please write your appeal.'); return } onSubmit(text) }}
              className="flex-1 py-2.5 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={14} /> Submit Appeal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Notifications = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { projects, updateProject } = useProjects()

  const [notifs, setNotifs] = useState([])
  const [filter, setFilter] = useState('all')
  const [appealNotif, setAppealNotif] = useState(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled ?? true)

  useEffect(() => {
    if (!user?.id) {
      setNotifs([])
      return
    }
    setNotifs(initialNotifs.filter(n => n.userId === user.id))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) {
      setNotificationsEnabled(true)
      return
    }

    const storageKey = `notifications_enabled_${user.id}`
    const persisted = localStorage.getItem(storageKey)
    if (persisted == null) {
      setNotificationsEnabled(true)
      return
    }
    setNotificationsEnabled(persisted === 'true')
    updateUser({ notificationsEnabled: persisted === 'true' })
  }, [user?.id])

  const setNotificationsEnabledPersisted = (enabled) => {
    if (!user?.id) return
    setNotificationsEnabled(enabled)
    localStorage.setItem(`notifications_enabled_${user.id}`, String(enabled))
    updateUser({ notificationsEnabled: enabled })
    toast.success(enabled ? 'Notifications turned on.' : 'All notifications turned off.')
  }

  const setReadState = (id, read) => setNotifs(p => p.map(n => n.id === id ? { ...n, read } : n))
  const markAllRead = () => { setNotifs(p => p.map(n => ({ ...n, read: true }))); toast.success('All notifications marked as read.') }

  const handleAppealSubmit = (text) => {
    const project = projects.find(p => p.id === appealNotif.projectId)
    if (project) {
      updateProject(project.id, {
        appeal: { message: text, submittedAt: new Date().toISOString().split('T')[0], status: 'pending' },
      })
    }
    setReadState(appealNotif.id, true)
    setAppealNotif(null)
    toast.success('Appeal submitted successfully.')
  }

  if (!user) return <div className="p-6">Please sign in to view notifications.</div>

  const cfgTabs = roleTabs[user.role] || roleTabs.student
  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs
  const unreadCount = notifs.filter(n => !n.read).length
  const notificationsAllowed = notificationsEnabled || !canDisableNotifications(user.role)

  return (
    <DashboardLayout tabs={cfgTabs.tabs} secondaryTabs={cfgTabs.secondaryTabs}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {notificationsAllowed && <p className="text-sm text-gray-500 mt-1">{unreadCount} unread</p>}
          </div>
          <div className="flex items-center gap-4">
            {notifs.length > 0 && notificationsAllowed && (
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className={`cursor-pointer text-sm font-medium ${
                  unreadCount === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-indigo-600 hover:underline'
                }`}
              >
                Mark all as read
              </button>
            )}
            {canDisableNotifications(user.role) && (
              <button
                onClick={() => setNotificationsEnabledPersisted(!notificationsEnabled)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${notificationsEnabled ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-700 border-green-200 hover:bg-green-50'}`}
              >
                <BellOff size={14} />
                {notificationsEnabled ? 'Turn off' : 'Turn on'}
              </button>
            )}
          </div>
        </div>

        {!notificationsAllowed && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800 font-medium">Notifications are currently turned off.</p>
          </div>
        )}

        {notificationsAllowed && (
          <>
            <div className="flex gap-2 mb-5">
              {['all', 'unread'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`cursor-pointer px-4 py-1.5 rounded-full text-sm capitalize border ${filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {f === 'unread' ? `Unread (${unreadCount})` : 'All'}
                </button>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No notifications</div>
              ) : (
                filtered.map(n => {
                  const proj = n.projectId ? projects.find(p => p.id === n.projectId) : null
                  const appealAlreadySubmitted = proj?.appeal?.message
                  const targetRoute = getNotificationRoute(n, user.role)

                  return (
                    <div key={n.id} className={`px-6 py-4 ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                      <div className="flex items-start gap-4">
                        <span className="text-2xl mt-0.5">{getNotifIcon(n.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                            <div className="flex items-center gap-1">
                              {!n.read && (
                                <button
                                  onClick={() => setReadState(n.id, true)}
                                  className="cursor-pointer text-[11px] text-indigo-500 hover:underline"
                                >
                                  Mark read
                                </button>
                              )}
                              {n.read && (
                                <button
                                  onClick={() => setReadState(n.id, false)}
                                  className="cursor-pointer text-[11px] text-gray-400 hover:text-indigo-500 hover:underline"
                                >
                                  Mark unread
                                </button>
                              )}
                            </div>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{n.message}</p>

                          {n.type === 'flag' && proj && (
                            <div className="mb-2">
                              <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">
                                <p className="text-xs font-semibold text-red-600 mb-0.5">Flag Reason</p>
                                <p className="text-xs text-[#45556C]">{proj.flagReason}</p>
                              </div>
                              {appealAlreadySubmitted ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                  <CheckCircle2 size={12} /> Appeal submitted — Pending review
                                </span>
                              ) : (
                                <button
                                  onClick={() => setAppealNotif(n)}
                                  className="cursor-pointer text-xs text-indigo-600 font-medium hover:underline"
                                >
                                  Submit appeal →
                                </button>
                              )}
                            </div>
                          )}

                          {!(n.type === 'flag' && proj && !appealAlreadySubmitted) && (
                            <button
                              onClick={() => navigate(targetRoute)}
                              className="cursor-pointer text-xs text-indigo-600 font-medium hover:underline"
                            >
                              {getNotificationRouteLabel(targetRoute)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}
      </div>

      {appealNotif && (
        <AppealModal
          project={projects.find(p => p.id === appealNotif.projectId)}
          onSubmit={handleAppealSubmit}
          onClose={() => setAppealNotif(null)}
        />
      )}
    </DashboardLayout>
  )
}

export default Notifications