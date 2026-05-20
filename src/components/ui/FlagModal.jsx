import React, { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

/**
 * FlagModal
 *
 * Props:
 *   isOpen      {boolean}
 *   onClose     {function}
 *   onConfirm   {function}  (reason: string) => void
 *   projectTitle {string}
 */
const FlagModal = ({ isOpen, onClose, onConfirm, projectTitle = 'this project' }) => {
  const [reason, setReason] = useState('')
  const [error,  setError]  = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setError('Please provide a reason for flagging.')
      return
    }
    onConfirm(trimmed)
    setReason('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setReason('')
    setError('')
    onClose()
  }

  return (
    /* Backdrop */
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className='relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6'
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 text-[#62748E] hover:text-[#0F172B] transition-colors cursor-pointer'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Icon + heading */}
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2.5 bg-red-100 rounded-xl'>
            <AlertTriangle className='w-5 h-5 text-red-600' />
          </div>
          <div>
            <p className='text-base font-semibold text-[#0F172B]'>Flag Project</p>
            <p className='text-xs text-[#62748E]'>{projectTitle}</p>
          </div>
        </div>

        <p className='text-sm text-[#45556C] mb-4'>
          Flagging this project will automatically <span className='font-medium text-[#0F172B]'>deactivate</span> it
          and notify the student. They may send an appeal. Please provide a clear reason.
        </p>

        <label className='block text-sm font-medium text-[#314158] mb-1.5'>
          Reason for flagging <span className='text-red-500'>*</span>
        </label>
        <textarea
          value={reason}
          onChange={e => { setReason(e.target.value); setError('') }}
          rows={4}
          maxLength={300}
          placeholder='e.g. Potential plagiarism detected — code appears copied from an external source.'
          className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 resize-none ${
            error ? 'border-red-500' : 'border-[#E2E8F0] focus:border-[#432DD7]'
          }`}
        />
        <div className='flex justify-between mt-1 mb-5'>
          {error
            ? <p className='text-xs text-red-500'>{error}</p>
            : <span />
          }
          <p className='text-xs text-[#62748E]'>{reason.length}/300</p>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={handleClose}
            className='flex-1 py-2.5 border border-[#E2E8F0] text-[#0F172B] text-sm font-medium rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className='flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors cursor-pointer'
          >
            Flag Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default FlagModal