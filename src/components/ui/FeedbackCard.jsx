import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { instructors } from '../../data/users'
import { notifications } from '../../data/notifications'
import toast from 'react-hot-toast'
import { MessageSquare, Pencil, Trash2, Plus, Check, X } from 'lucide-react'

/**
 * FeedbackCard
 *
 * Used for BOTH task-level (req 37) and project-level (req 38) feedback.
 *
 * Props:
 *   title         {string}    Section heading e.g. "Instructor Feedback" or "Project Feedback"
 *   comments      {Array}     Array of { instructorId, comment, createdAt }
 *   onAdd         {function}  (comment: string) => void
 *   onEdit        {function}  (index: number, newComment: string) => void
 *   onDelete      {function}  (index: number) => void
 *   projectCreatorId {string} used to send notification on add
 */
const FeedbackCard = ({ title = 'Instructor Feedback', comments = [], onAdd, onEdit, onDelete, projectCreatorId }) => {
  const { user } = useAuth()
  const isInstructor = user?.role === 'instructor'

  const [newComment,   setNewComment]   = useState('')
  const [editingIdx,   setEditingIdx]   = useState(null)
  const [editText,     setEditText]     = useState('')

  const instructorName = (id) => {
    const inst = instructors.find(i => i.id === id)
    return inst ? `${inst.firstName} ${inst.lastName}` : 'Instructor'
  }

  const handleAdd = () => {
    const trimmed = newComment.trim()
    if (!trimmed) return
    onAdd && onAdd(trimmed)

    // Notify the project creator (req 41)
    if (projectCreatorId) {
      notifications.push({
        id:        `n_fb_${Date.now()}`,
        userId:    projectCreatorId,
        type:      'feedback',
        message:   `${user.firstName} ${user.lastName} left feedback on your project.`,
        read:      false,
        createdAt: new Date().toISOString().split('T')[0],
      })
    }
    setNewComment('')
    toast.success('Feedback added!')
  }

  const startEdit = (idx) => {
    setEditingIdx(idx)
    setEditText(comments[idx].comment)
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed) return
    onEdit && onEdit(editingIdx, trimmed)
    setEditingIdx(null)
    setEditText('')
    toast.success('Feedback updated!')
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setEditText('')
  }

  const handleDelete = (idx) => {
    onDelete && onDelete(idx)
    toast.success('Feedback removed.')
  }

  return (
    <div className='flex flex-col p-5 bg-white border border-[#E2E8F0] rounded-2xl'>
      <div className='flex items-center gap-2 mb-4'>
        <MessageSquare className='w-4 h-4 text-[#432DD7]' />
        <p className='text-md font-semibold text-[#0F172B]'>{title}</p>
        {comments.length > 0 && (
          <span className='ml-auto text-xs font-medium text-[#62748E] bg-[#F1F5F9] px-2 py-0.5 rounded-full'>
            {comments.length}
          </span>
        )}
      </div>

      {/* Existing comments */}
      {comments.length === 0 && (
        <p className='text-sm text-[#62748E] mb-4'>No feedback yet.</p>
      )}

      <div className='flex flex-col gap-3 mb-4'>
        {comments.map((fb, idx) => {
          const isOwn = fb.instructorId === user?.id

          return (
            <div key={idx} className='flex flex-col gap-2 p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg'>
              <div className='flex items-center justify-between gap-2'>
                <p className='text-xs font-semibold text-[#432DD7]'>{instructorName(fb.instructorId)}</p>
                <div className='flex items-center gap-1'>
                  <span className='text-xs text-[#62748E]'>{fb.createdAt}</span>
                  {isInstructor && isOwn && editingIdx !== idx && (
                    <>
                      <button
                        onClick={() => startEdit(idx)}
                        className='p-1 text-[#62748E] hover:text-[#432DD7] transition-colors cursor-pointer rounded'
                        title='Edit'
                      >
                        <Pencil className='w-3.5 h-3.5' />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className='p-1 text-[#62748E] hover:text-red-500 transition-colors cursor-pointer rounded'
                        title='Delete'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingIdx === idx ? (
                <div className='flex flex-col gap-2'>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={3}
                    className='w-full px-3 py-2 border border-[#432DD7] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#432DD7]/20 resize-none bg-white'
                    autoFocus
                  />
                  <div className='flex gap-2 justify-end'>
                    <button
                      onClick={cancelEdit}
                      className='flex items-center gap-1 text-xs text-[#62748E] border border-[#E2E8F0] px-3 py-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer'
                    >
                      <X className='w-3 h-3' /> Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className='flex items-center gap-1 text-xs text-white bg-[#432DD7] px-3 py-1.5 rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer'
                    >
                      <Check className='w-3 h-3' /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className='text-sm text-[#314158] whitespace-pre-wrap'>{fb.comment}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Add new comment — only for instructors */}
      {isInstructor && (
        <div className='flex flex-col gap-2 pt-4 border-t border-[#E2E8F0]'>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            rows={3}
            placeholder='Write your feedback…'
            className='w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none bg-white'
          />
          <button
            onClick={handleAdd}
            disabled={!newComment.trim()}
            className='flex items-center justify-center gap-1.5 self-end px-4 py-2 bg-[#432DD7] text-white text-sm font-medium rounded-lg hover:bg-[#3524b5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Plus className='w-4 h-4' /> Add Feedback
          </button>
        </div>
      )}
    </div>
  )
}

export default FeedbackCard