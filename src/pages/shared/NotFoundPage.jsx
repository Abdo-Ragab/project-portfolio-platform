import React from 'react'
import { NavLink } from 'react-router'
import { Code, ArrowLeft } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className='relative flex flex-col min-h-screen bg-[#0F172B] overflow-hidden'>
      <div className='absolute -bottom-30 right-60 w-96 h-115 bg-[#432DD7]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -top-45 -right-45 w-96 h-115 bg-[#432DD7]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-45 -left-45 w-96 h-115 bg-[#7569F4]/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -top-45 w-96 h-115 bg-[#7569F4]/20 rounded-full blur-3xl pointer-events-none' />

      <NavLink className='flex mt-16 mx-48 items-center pointer-events-auto w-fit' to='/'>
        <Code className='text-[#7C86FF] w-8 h-8' />
        <span className='text-white font-bold ml-3 text-2xl'>
          GUC Hub
        </span>
      </NavLink>

      <div className='flex-1 flex flex-col items-center justify-center px-6'>
        <div className='text-center'>
          <p className='text-8xl font-extrabold text-white mb-4'>404</p>
          <h1 className='text-5xl font-extrabold text-white mb-4'>
            Page Not Found
          </h1>
          <p className='text-[#D1D5DC] text-lg mb-10 max-w-xl'>
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
          
          <NavLink 
            to='/' 
            className='inline-flex items-center px-6 py-3 bg-[#432DD7] text-white font-medium rounded-md hover:bg-[#321dbb] transition-colors duration-150'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage