import React from 'react'
import SearchBarSharedPages from './SearchBarSharedPages'
import { NavLink } from 'react-router'
import { ArrowRight, Code } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
    const { user } = useAuth();

    return (
        <div className='relative flex flex-col px-48 bg-[#0F172B] overflow-hidden'>
          <div className='absolute -top-45 -right-45 w-96 h-115 bg-[#432DD7]/20 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -bottom-45 -left-45 w-96 h-115 bg-[#7569F4]/20 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -top-45 w-96 h-115 bg-[#7569F4]/20 rounded-full blur-3xl pointer-events-none' />

            <NavLink className='flex mt-16 items-center pointer-events-auto' to='/'>
                <Code className={`text-[#7C86FF] w-8 h-8`}/>
                <span className={`text-white font-bold ml-3 text-2xl`}>
                    GUC Hub
                </span>
            </NavLink>
            <div className='flex items-center gap-16 h-screen'>
                <div className='flex-1 flex flex-col items-start'>
                    <p className='text-7xl font-extrabold text-white tracking-tighter'>
                      Showcase Your Work.
                    </p>
                    <p className='text-7xl font-extrabold bg-linear-to-r from-[#432DD7] to-[#7569F4] bg-clip-text text-transparent tracking-tighter'>
                        Get Discovered.
                    </p>
                    <p className='text-[#D1D5DC] text-xl mt-6 max-w-2xl'>
                        The premier project portfolio platform for GUC students. Connect with peers, find mentors, and display your academic excellence to top employers.
                    </p>
                    <div className='flex mt-10 items-center gap-4'>
                        {!user && (
                            <>
                              <NavLink to='/register' className='flex items-center px-6 py-3 bg-[#432DD7] text-white font-medium rounded-md hover:bg-[#321dbb] transition-colors duration-150'>
                                  Sign Up <ArrowRight className='w-4 h-4 ml-1 font-bold' />
                              </NavLink>
                              <NavLink to='/login' className='flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-md border border-white/20 hover:bg-white/20 transition-colors duration-150'>
                                  Log In
                              </NavLink>
                            </>
                        )}
                        {user && (
                          <NavLink to={`/${user.role}/dashboard`} className='flex items-center px-6 py-3 bg-[#432DD7] text-white font-medium rounded-md hover:bg-[#321dbb] transition-colors duration-150'>
                              Go to Dashboard <ArrowRight className='w-4 h-4 ml-1 font-bold' />
                          </NavLink>
                        )}
                    </div>
                </div>
                <div className='relative flex-1 flex flex-col items-start'>
                    <div className="absolute inset-0 bg-[#432DD7]/20 rounded-full blur-3xl pointer-events-none"></div>
                    <img src='/homepageWindow.svg' alt='GUC Hub Platform Preview' className='relative z-10 w-full h-auto rounded-lg hover:rotate-3 transition-rotate duration-150' />
                </div>
            </div>
        </div>
    )
}

export default Hero