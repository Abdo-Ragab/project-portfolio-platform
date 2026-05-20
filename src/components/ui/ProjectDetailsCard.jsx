import { Edit, Flag, Heart, X } from 'lucide-react'
import React from 'react'
import { courses } from '../../data/courses'
import { useAuth } from '../../context/AuthContext';

const ProjectDetailsCard = ({ project, isLiked, isFlagged, setIsLiked, setIsFlagged, showFlagModal, setShowFlagModal }) => {
    const { user, login, logout } = useAuth();
    
    const FlagModal = ({ project, onSubmit, onClose }) => {
      const [flagReason, setFlagReason] = React.useState('')
      const handleSubmit = (e) => {
        e.preventDefault()
        if (!flagReason.trim()) { 
          alert('Please provide a reason for flagging.')
          return 
        }
        onSubmit()
        onClose()
      }


      return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
              <div>
                <p className="font-semibold text-[#0F172B]">Flag {project.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Report any issues with this project</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[#45556C] mb-1.5">Flag Reason <span className="text-red-400">*</span></label>
                <textarea value={flagReason} onChange={e => setFlagReason(e.target.value)} rows={5}
                  placeholder="Explain why you're flagging this project..."
                  className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#432DD7]" />
                <p className="text-xs text-gray-400 mt-1">{flagReason.length} characters</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#45556C] hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#432DD7] text-white rounded-lg text-sm font-medium hover:bg-[#3826b8]">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )
    }


  return (
    <div>
        <div className='flex flex-col p-8 w-full rounded-lg bg-white border border-[#E2E8F0] mt-4'>
              <div className='flex'>
                <span className='text-white text-[10px] font-bold bg-navy rounded-sm py-0.5 px-2 h-fit'>
                  {courses.find(c => c.id === project.courseId)?.code || 'N/A'}
                </span>
                <span className={`ml-2 h-fit text-[10px] mr-auto font-bold rounded-sm py-0.5 px-2 ${project.isFlagged || isFlagged ? 'text-[#B91C1C] bg-[#FEE2E2]' : project.visibility === 'public' ? 'text-[#016630] bg-[#DCFCE7]' : 'text-[#7C2D12] bg-[#FEE2E2]'}`}>
                  {project.isFlagged || isFlagged ? 'FLAGGED' : project.visibility === 'public' ? 'PUBLIC' : 'PRIVATE'}
                </span>

                <a href={project.githubLink} target="_blank" rel="noreferrer" className={`ml-2 flex items-center gap-1.5 text-xs font-medium border border-[#E2E8F0] ${isLiked ? 'text-red-600' : 'text-[#364153]'} rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150`}>
                    <img src={'/githubLogo.svg'} alt="GitHub" className={`w-4 h-4`} />
                </a>
                {(user?.role === 'student' || user?.role === 'instructor') && (
                    <button onClick={() => {setIsLiked(!isLiked);}} className={`ml-2 flex items-center gap-1.5 text-xs font-medium border border-[#E2E8F0] ${isLiked ? 'text-red-600' : 'text-[#364153]'} rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-150`}>
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
                    </button>
                )}
                {(user?.role === 'instructor' || user?.role === 'admin') && (
                    <button disabled={isFlagged} onClick={() => {setShowFlagModal(true)}} className={`ml-2 flex items-center gap-1.5 text-xs font-medium border border-[#E2E8F0] ${isFlagged ? 'text-red-600 cursor-not-allowed ' : 'text-[#364153] cursor-pointer hover:bg-gray-50 transition-colors duration-150'} rounded-md px-3 py-2`}>
                        <Flag className={`w-4 h-4 ${isFlagged ? 'fill-red-600' : ''}`} />
                    </button>
                )}
              </div>
                <p className='text-navy text-3xl font-bold mt-4'>{project.title}</p>
                <p className='text-sm text-[#6A7282] mt-2'>{project.shortDescription}</p>
              </div>
            {showFlagModal && <FlagModal project={project} onSubmit={() => setIsFlagged(true)} onClose={() => setShowFlagModal(false)} />}
    </div>
  )
}

export default ProjectDetailsCard