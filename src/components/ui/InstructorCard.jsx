import React from 'react'
import { courses } from '../../data/courses'
import { NavLink } from 'react-router'
import { ArrowRight, BookOpen, FolderKanban, GraduationCap, Info, Mail, Users } from 'lucide-react'
import { projects } from '../../data/projects'

const InstructorCard = ({ instructor }) => {
    return (
        <NavLink to={`/instructors/${instructor.id}`} className='flex bg-white gap-4 p-5 w-full border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors duration-150'>
            <img src={instructor.avatar} alt={`${instructor.firstName} ${instructor.lastName}`} className='w-12 h-12 rounded-full object-cover' />
            <div className='flex flex-col w-full'>
                <div className='flex items-center w-full'>
                    <p className='text-base font-semibold text-[#432DD7] mr-2'>
                        {instructor.firstName} {instructor.lastName}
                    </p>
                    <span className='text-[10px] font-medium text-[#6A7282] border border-[#E2E8F0] rounded-full px-2 py-0.5'>
                        {instructor.role.charAt(0).toUpperCase() + instructor.role.slice(1)}
                    </span>
                </div>

                <p className='text-sm text-[#4A5565] mt-1 mb-2 line-clamp-1'>
                    {instructor.bio}
                </p>

                <div className='flex mt-auto'>
                    <div className='flex items-center px-2 py-1 mr-4 bg-[#F9FAFB] border border-[#E2E8F0] rounded-sm'>
                        <BookOpen className='w-3.5 h-3.5 text-[#432DD7]' />
                        <span className='text-xs font-medium text-center text-navy ml-1.5'>
                            {instructor.education[0].degree} {instructor.education[0].institution}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <Users className='w-3.5 h-3.5 text-[#99A1AF]' />
                        <span className='text-xs text-center text-[#6A7282] ml-1'>
                            {projects.filter((project) => project.instructorIds.includes(instructor.id)).length} Project(s) Supervised
                        </span>
                    </div>

                    <div className='flex gap-2 items-center ml-4'>
                        {instructor.researchInterests.map((interest, index) => (
                            (index === 0)
                            ? <span key={index} className='text-xs text-[#4A5565] px-2 py-0.5 bg-[#F3F4F6] rounded-sm border border-[#E5E7EB]'>
                                {interest}
                              </span>
                            : (index === 1) 
                            ? <span key={index} className='text-xs text-[#4A5565] px-2 py-0.5 bg-[#F3F4F6] rounded-sm border border-[#E5E7EB]'>
                                {interest}
                              </span>
                            : (instructor.researchInterests.length > 2)
                            ? <p key={index} className='text-xs text-[#99A1AF]'>+{instructor.researchInterests.length - 2} more</p>
                            : null
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex items-center min-w-max'>
                <span className='text-xs text-[#6A7282] mr-1'>
                    View Portfolio
                </span>
                <ArrowRight className='w-3.5 h-3.5 text-[#6A7282]' />
            </div>
        </NavLink>
    )
}

export default InstructorCard