import React from 'react'
import { employers } from '../../data/users';
import { internships } from '../../data/internships';

const InternshipCard = ({ internshipId }) => {
  const internship = internships.find(i => i.id === internshipId);

  return (
    <div className='p-6 bg-white border border-[#E2E8F0] rounded-lg'>
      <div className='flex items-start gap-4 mb-4'>
        <img
          src={employers.find(e => e.id === internship.employerId)?.avatar}
          alt={internship.companyName} 
          className='w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-white font-semibold text-lg'
        />
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-[#0F172B]'>{internship.title}</h3>
          <p className='text-sm text-[#432DD7] font-medium'>
            {internship.companyName}
          </p>
        </div>
        <div className='text-right shrink-0'>
          <p className='text-sm text-[#6A7282]'>{internship.duration}</p>
        </div>
      </div>

      {/* Description */}
      <p className='text-sm text-[#4A5565] leading-relaxed'>
        {internship.responsibilities}
      </p>
    </div>
  )
}

export default InternshipCard