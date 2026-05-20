import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { useProjects } from '../../context/ProjectsContext'
import { students, instructors } from '../../data/users'
import { courses } from '../../data/courses'
import { STUDENT_TABS, STUDENT_TABS_SECONDARY } from '../../data/tabs'
import { Check, FolderKanban, UserCheck, X } from 'lucide-react'
import toast from 'react-hot-toast'

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return '1 day ago'
  if (diff < 7) return `${diff} days ago`
  const weeks = Math.floor(diff / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

const allUsers = [...students, ...instructors]

const StudentInvitationsPage = () => {
  const { user } = useAuth()
  const { projects, updateProject } = useProjects()

  const pendingInvitations = projects
    .map(p => {
      const inv = p.collaboratorInvitations?.find(i => i.userId === user.id && i.status === 'pending')
      return inv ? { project: p, invitation: inv } : null
    })
    .filter(Boolean)

  const handleAccept = ({ project, invitation }) => {
    updateProject(project.id, {
      collaborators: [...(project.collaborators || []), user.id],
      collaboratorInvitations: project.collaboratorInvitations.map(i =>
        i.userId === user.id ? { ...i, status: 'accepted' } : i
      ),
    })
    toast.success(`You joined "${project.title}"!`)
  }

  const handleDecline = ({ project }) => {
    updateProject(project.id, {
      collaboratorInvitations: project.collaboratorInvitations.map(i =>
        i.userId === user.id ? { ...i, status: 'rejected' } : i
      ),
    })
    toast('Invitation declined.', { icon: '✕' })
  }

  return (
    <DashboardLayout tabs={STUDENT_TABS} secondaryTabs={STUDENT_TABS_SECONDARY}>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#0F172B]">Project Invitations</h1>
        <p className="text-sm text-gray-400 mt-1 mb-5">Manage your pending invitations to collaborate on or mentor projects.</p>

        {pendingInvitations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center py-16 text-center">
            <UserCheck size={36} className="text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-500">No pending invitations</p>
            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden divide-y divide-[#E2E8F0]">
            {pendingInvitations.map(({ project, invitation }) => {
              const course   = courses.find(c => c.id === project.courseId)
              const inviter  = allUsers.find(u => u.id === project.creatorId)
              const isBachelor = project.courseId === 'c5'

              return (
                <div key={project.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Project icon */}
                  <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center shrink-0">
                    <FolderKanban size={18} className="text-[#432DD7]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-[#0F172B] truncate">{project.title}</p>
                      <span className="shrink-0 text-[10px] font-semibold bg-[#EEF2FF] text-[#432DD7] px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {invitation.type === 'instructor' ? 'Supervisor' : 'Collaborator'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {course?.code} • {isBachelor ? 'Bachelor Thesis' : course?.name}
                    </p>
                    {inviter && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <img src={inviter.avatar} alt=""
                          className="w-4 h-4 rounded-full object-cover" />
                        <p className="text-xs text-gray-400">
                          Invited by {inviter.firstName} {inviter.lastName} • {timeAgo(invitation.invitedAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDecline({ project })}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors px-2 py-1.5"
                    >
                      <X size={14} /> Decline
                    </button>
                    <button
                      onClick={() => handleAccept({ project, invitation })}
                      className="flex items-center gap-1.5 text-sm font-medium bg-[#432DD7] text-white px-4 py-1.5 rounded-lg hover:bg-[#3826b8] transition-colors"
                    >
                      <Check size={14} /> Accept
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentInvitationsPage
