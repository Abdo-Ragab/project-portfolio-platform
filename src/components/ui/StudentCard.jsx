import React from 'react'
import { NavLink } from 'react-router'
import { majors } from '../../data/majors'
import { projects } from '../../data/projects'
import { ArrowRight, Circle, FolderKanban, Heart, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const StudentCard = ({ student, portfoliosList }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = React.useState(user?.portfoliosIds?.includes(student.id));

  return (
    <NavLink to={`/portfolios/${student.id}`} className='flex bg-white gap-4 p-5 w-full border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors duration-150'>
        <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className='w-12 h-12 rounded-full object-cover' />
        <div className='flex flex-col w-full'>
            <div className='flex items-center w-full'>
                <p className='text-base font-semibold text-[#432DD7] mr-2'>
                    {student.firstName} {student.lastName}
                </p>
                <span className='text-[10px] font-medium text-[#6A7282] border border-[#E2E8F0] rounded-full px-2 py-0.5'>
                    Class of '{(student.graduationYear || new Date().getFullYear()).toString().slice(-2)}
                </span>
            </div>

            <p className='text-sm text-[#4A5565] mt-1 mb-2'>
                {(majors.find((major) => major.id === student.majorId)?.name || 'Undeclared') + ` Major • ${student.shortBio || student.bio || ''}`}
            </p>

            <div className='flex mt-auto'>
                <div className='flex items-center mr-4'>
                    <FolderKanban className='w-3.5 h-3.5 text-[#99A1AF]' />
                    <span className='text-xs text-center text-[#6A7282] ml-1'>
                        {projects.filter((project) => project.creatorId === student.id || project.collaborators.includes(student.id)).length} Project(s)
                    </span>
                </div>
                <div className='flex items-center'>
                    <Mail className='w-3.5 h-3.5 text-[#99A1AF]' />
                    <span className='text-xs text-center text-[#6A7282] ml-1'>
                        {student.email}
                    </span>
                </div>

                <div className='bg-[#E2E8F0] h-5 w-px mx-4' />

                <div className='flex gap-2 items-center'>
                    {student.skills.map((skill, index) => (
                        (index === 0)
                        ? <div key={index} className='flex items-center'>
                            <Circle className='w-2.5 h-2.5 text-[#2B7FFF] fill-[#2B7FFF]' />
                            <span className='text-xs text-[#6A7282] ml-1.5'>
                                {skill}
                            </span>
                        </div>
                        : (index === 1) 
                        ? <div key={index} className='flex items-center'>
                            <Circle className='w-2.5 h-2.5 text-[#F0B100] fill-[#F0B100]' />
                            <span className='text-xs text-[#6A7282] ml-1.5'>
                                {skill}
                            </span>
                        </div>
                        : (index === 2)
                        ? <p key={index} className='text-xs text-[#99A1AF]'>+{student.skills.length - 2} more</p>
                        : null
                    ))}
                </div>
            </div>
        </div>
        <div className={`flex flex-col items-end ${(user && (user.role === 'student' || user.role === 'employer')) ? 'justify-between' : 'justify-center'}`}>
            {(user && (user.role === 'student' || user.role === 'employer')) && (
                <Heart
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(prev => !prev); portfoliosList && portfoliosList(prev => prev.filter(s => s.id !== student.id)); if (!isLiked) portfoliosList && portfoliosList(prev => [...prev, student]); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setIsLiked(prev => !prev); } }}
                role="button"
                tabIndex={0}
                aria-pressed={isLiked}
                className={`size-5 cursor-default outline-none ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-500'} transition-colors duration-150`}
            />)}
            <div className='flex items-center min-w-max'>
                <span className='text-xs text-[#6A7282] mr-1'>
                    View Portfolio
                </span>
                <ArrowRight className='w-3.5 h-3.5 text-[#6A7282]' />
            </div>
        </div>
    </NavLink>
  )
}

export default StudentCard