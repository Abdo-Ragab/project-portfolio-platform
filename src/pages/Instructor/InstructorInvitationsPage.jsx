import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { invitations } from '../../data/invitations'
import { projects } from '../../data/projects'
import { students } from '../../data/users'
import { notifications } from '../../data/notifications'
import toast from 'react-hot-toast'
import { Check, X, FolderOpen } from 'lucide-react'
import { courses } from '../../data/courses'

// ─── Relative time helper ─────────────────────────────────────────────────────
const relativeTime = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60))
  if (diff < 1)  return 'Just now'
  if (diff < 24) return `${diff} hour${diff > 1 ? 's' : ''} ago`
  const days = Math.floor(diff / 24)
  if (days < 7)  return `${days} day${days > 1 ? 's' : ''} ago`
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`
}

// ─── Single invitation card ───────────────────────────────────────────────────
const InvitationCard = ({ inv, onAccept, onDecline }) => {
  const project = projects.find(p => p.id === inv.projectId)
  const sender  = students.find(s => s.id === inv.fromUserId)
  const course  = project
    ? (() => {
        return courses.find(c => c.id === project.courseId)
      })()
    : null

  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px', borderBottom: '0.667px solid #E2E8F0',
      }}
    >
      {/* Left — icon + info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        {/* Folder icon with purple bg */}
        <div
          style={{
            width: 40, height: 40, borderRadius: 6,
            background: 'rgba(67,45,215,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <FolderOpen className='w-5 h-5 text-[#432DD7]' />
        </div>

        {/* Project name, role badge, course, sender */}
        <div>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1B2A4A' }}>
              {project?.title ?? 'Unknown Project'}
            </p>
            {/* Mentor badge — blue */}
            <span
              style={{
                background: '#DBEAFE', color: '#1447E6',
                borderRadius: 4, padding: '2px 8px',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.25px', textTransform: 'uppercase',
              }}
            >
              Mentor
            </span>
          </div>

          {/* Course line */}
          <p style={{ fontSize: 12, color: '#6A7282', marginBottom: 8 }}>
            {course ? `${course.code}: ${course.name}` : '—'}
          </p>

          {/* Sender row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={sender?.avatar ?? 'https://ui-avatars.com/api/?name=Student&background=random'}
              alt={sender?.firstName}
              style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
            />
            <p style={{ fontSize: 12, color: '#4A5565' }}>
              Invited by {sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown'} •{' '}
              {relativeTime(inv.sentAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Right — Decline + Accept buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {/* Decline */}
        <button
          onClick={() => onDecline(inv)}
          className='flex items-center gap-1.5 cursor-pointer hover:bg-[#F9FAFB] transition-colors'
          style={{
            border: '0.667px solid #E2E8F0', borderRadius: 6,
            padding: '6.67px 12.67px', fontSize: 12, fontWeight: 500, color: '#4A5565',
            background: '#FFFFFF',
          }}
        >
          <X className='w-3.5 h-3.5' /> Decline
        </button>
        {/* Accept */}
        <button
          onClick={() => onAccept(inv)}
          className='flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity'
          style={{
            background: '#432DD7', borderRadius: 6,
            padding: '6px 12px', fontSize: 12, fontWeight: 500, color: '#FFFFFF',
            border: 'none',
          }}
        >
          <Check className='w-3.5 h-3.5' /> Accept
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const InstructorInvitationsPage = () => {
  const { user } = useAuth()
  const [, forceUpdate] = useState(0)
  const refresh = () => forceUpdate(n => n + 1)

  // All invitations addressed to this instructor
  const myInvitations = invitations.filter(inv => inv.toUserId === user.id)
  const pending  = myInvitations.filter(inv => inv.status === 'pending')
  const resolved = myInvitations.filter(inv => inv.status !== 'pending')

  const handleAccept = (inv) => {
    inv.status = 'accepted'
    const proj = projects.find(p => p.id === inv.projectId)
    if (proj && !proj.instructorIds.includes(user.id)) {
      proj.instructorIds.push(user.id)
    }
    notifications.push({
      id: `n_reply_${inv.id}_${Date.now()}`,
      userId: inv.fromUserId, type: 'invitation',
      message: `${user.firstName} ${user.lastName} accepted your project invitation.`,
      read: false, createdAt: new Date().toISOString().split('T')[0],
    })
    toast.success('Invitation accepted!')
    refresh()
  }

  const handleDecline = (inv) => {
    inv.status = 'rejected'
    notifications.push({
      id: `n_reply_${inv.id}_${Date.now()}`,
      userId: inv.fromUserId, type: 'invitation',
      message: `${user.firstName} ${user.lastName} declined your project invitation.`,
      read: false, createdAt: new Date().toISOString().split('T')[0],
    })
    toast('Invitation declined.', { icon: '👋' })
    refresh()
  }

  return (
    <DashboardLayout tabs={INSTRUCTOR_TABS} secondaryTabs={INSTRUCTOR_TABS_SECONDARY}>
      {/* Design uses narrower content area: padding 32px 105px */}
      <div style={{ padding: '32px 105px 0' }}>

        {/* Heading */}
        <div className='mb-6'>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
            Project Invitations
          </h1>
          <p style={{ fontSize: 14, color: '#6A7282', marginTop: 4 }}>
            Manage your pending invitations to collaborate on student projects.
          </p>
        </div>

        {/* Pending invitations card */}
        <div
          style={{
            background: '#FFFFFF', border: '0.667px solid #E2E8F0',
            borderRadius: 8, overflow: 'hidden', marginBottom: 24,
          }}
        >
          {pending.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <div
                style={{
                  width: 48, height: 48, borderRadius: 8,
                  background: 'rgba(67,45,215,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <FolderOpen className='w-6 h-6 text-[#432DD7]' />
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: '#1B2A4A' }}>
                No pending invitations
              </p>
              <p style={{ fontSize: 13, color: '#6A7282', marginTop: 4 }}>
                You're all caught up!
              </p>
            </div>
          ) : (
            pending.map(inv => (
              <InvitationCard
                key={inv.id}
                inv={inv}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))
          )}
        </div>

        {/* Resolved invitations (past) */}
        {resolved.length > 0 && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1B2A4A', marginBottom: 16 }}>
              Past Invitations
            </h2>
            <div
              style={{
                background: '#FFFFFF', border: '0.667px solid #E2E8F0',
                borderRadius: 8, overflow: 'hidden', marginBottom: 24,
              }}
            >
              {resolved.map(inv => {
                const project = projects.find(p => p.id === inv.projectId)
                const sender  = students.find(s => s.id === inv.fromUserId)
                return (
                  <div
                    key={inv.id}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 20px', borderBottom: '0.667px solid #E2E8F0',
                      opacity: 0.7,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <FolderOpen className='w-5 h-5 text-[#99A1AF]' />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#1B2A4A' }}>
                          {project?.title ?? 'Unknown Project'}
                        </p>
                        <p style={{ fontSize: 12, color: '#6A7282' }}>
                          From {sender ? `${sender.firstName} ${sender.lastName}` : '—'} • {relativeTime(inv.sentAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        background: inv.status === 'accepted' ? '#DCFCE7' : '#FEE2E2',
                        color: inv.status === 'accepted' ? '#008236' : '#B91C1C',
                        borderRadius: 4, padding: '2px 8px',
                        fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      }}
                    >
                      {inv.status === 'accepted' ? 'Accepted' : 'Declined'}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  )
}

export default InstructorInvitationsPage