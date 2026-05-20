import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className='text-[#62748E] cursor-pointer hover:text-[#0F172B] transition-colors duration-200'>
            <ArrowLeft className='inline-block mr-1.5 size-4' /> <span className='text-sm'>Back</span>
        </button>
    )
}

export default BackButton