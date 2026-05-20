import React from 'react'
import { projects } from '../../data/projects'
import { Edit, FolderKanban, Mail } from 'lucide-react'
import { majors } from '../../data/majors'
import { useLocation } from 'react-router'

const PortfoliosDetailsCard = ({ user, student }) => {
    const location = useLocation();

    return (
        <div key={location.window} className='slide-in flex items-start bg-white p-8 rounded-lg border border-[#E2E8F0] mt-4'>
            <img src={student.avatar} alt={`${student.firstName} ${student.lastName}`} className='size-27 rounded-full object-cover border-4 border-white drop-shadow-md' />
            <div className='flex flex-col ml-6'>
                <div className='flex items-center'>
                    <p className='text-3xl font-bold text-navy mr-3'>
                        {student.firstName} {student.lastName}
                    </p>
                    <span className='text-[10px] font-bold bg-[#432DD7]/10 text-[#432DD7] border border-[#432DD7]/20 rounded-full px-2.5 py-1 uppercase'>
                        Class of '{student.graduationYear.toString().slice(-2)}
                    </span>
                </div>
                <p className='text-base text-[#4A5565] mt-1'>
                    {majors.find((major) => major.id === student.majorId)?.name} • {student.shortBio}
                </p>

                <div className='flex mt-3'>
                    <div className='flex items-center mr-3'>
                        <FolderKanban className='size-4 text-[#99A1AF]' />
                        <span className='text-xs text-center text-[#6A7282] ml-1'>
                            {projects.filter((project) => project.creatorId === student.id || project.collaborators.includes(student.id)).length} Project(s)
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <Mail className='size-4 text-[#99A1AF]' />
                        <span className='text-xs text-center text-[#6A7282] ml-1'>
                            {student.email}
                        </span>
                    </div>
                </div>
            </div>

            <div className='flex items-end justify-start ml-auto gap-2'>
                {user.id === student.id && (
                    <button onClick={() => {}} className='flex items-center cursor-pointer bg-white px-4 py-2 rounded-md border border-[#E2E8F0] text-sm text-[#4A5565] hover:bg-gray-50 transition-colors duration-150'>
                        <Edit className='size-4 mr-2 font-medium text-[#364153]' />
                        <span className='text-sm font-medium text-[#364153] '>Edit Portfolio</span>
                    </button>
                )}
                <a href={student.linkedin} target='_blank' rel='noopener noreferrer' className='flex items-center cursor-pointer bg-white p-2.5 rounded-md border border-[#E2E8F0] text-sm text-[#4A5565] hover:bg-gray-50 transition-colors duration-150'>
                    <img src='/linkedinLogo.svg' alt='LinkedIn' className='size-4' />
                </a>
                <a href={student.github} target='_blank' rel='noopener noreferrer' className='flex items-center cursor-pointer bg-white p-2.5 rounded-md border border-[#E2E8F0] text-sm text-[#4A5565] hover:bg-gray-50 transition-colors duration-150'>
                    <img src='/githubLogo.svg' alt='GitHub' className='size-4' />
                </a>
            </div>
        </div>
    )
}

export default PortfoliosDetailsCard