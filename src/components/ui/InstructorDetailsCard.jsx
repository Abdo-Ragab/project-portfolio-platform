import { Edit, FolderKanban, Mail } from 'lucide-react';
import React from 'react'
import { useLocation } from 'react-router';

const InstructorDetailsCard = ({ user, instructor }) => {
    const location = useLocation();

    return (
        <div key={location.window} className='slide-in flex items-start bg-white p-8 rounded-lg border border-[#E2E8F0] mt-4'>
            <img src={instructor.avatar} alt={`${instructor.firstName} ${instructor.lastName}`} className='size-27 rounded-full object-cover border-4 border-white drop-shadow-md' />
            <div className='flex flex-col ml-6'>
                <div className='flex items-center'>
                    <p className='text-3xl font-bold text-navy mr-3'>
                        {instructor.firstName} {instructor.lastName}
                    </p>
                    <span className='text-[10px] font-bold bg-[#432DD7]/10 text-[#432DD7] border border-[#432DD7]/20 rounded-full px-2.5 py-1 uppercase'>
                        {instructor.education[0].degree} {instructor.education[0].institution}
                    </span>
                </div>

                <div className='flex mt-1 items-center'>
                    <Mail className='size-4.5 text-[#99A1AF]' />
                    <span className='text-base text-center text-[#6A7282] ml-1'>
                        {instructor.email}
                    </span>
                </div>

                <div className='flex mt-3'>
                    {instructor.researchInterests.map((interest, index) => (
                        <span key={index} className='text-xs text-teal px-2.5 py-1 bg-teal/10 rounded-full mr-2'>
                            {interest}
                        </span>
                    ))}
                </div>
            </div>

            <div className='flex items-end justify-start ml-auto gap-2'>
                {user.id === instructor.id && (
                    <button onClick={() => {}} className='flex items-center cursor-pointer bg-white px-4 py-2 rounded-md border border-[#E2E8F0] text-sm text-[#4A5565] hover:bg-gray-50 transition-colors duration-150'>
                        <Edit className='size-4 mr-2 font-medium text-[#364153]' />
                        <span className='text-sm font-medium text-[#364153] '>Edit Portfolio</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default InstructorDetailsCard