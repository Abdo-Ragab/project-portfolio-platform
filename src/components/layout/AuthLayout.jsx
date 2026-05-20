import { NavLink } from 'react-router'
import NavBar from './NavBar'
import { Briefcase, CircleUserRound, Code, Users } from 'lucide-react'

const AuthLayout = ({ children }) => {  
    return (
        <div className='flex h-screen'>
            <div className='relative flex-1 flex flex-col bg-[#0F172B] pt-12 pb-12 pl-12 pr-28 overflow-hidden'>
                <div className='absolute -bottom-45 -right-45 w-96 h-115 bg-[#2B7FFF]/20 rounded-full blur-3xl pointer-events-none' />
                <div className='absolute -top-45 -left-45 w-96 h-115 bg-[#615FFF]/20 rounded-full blur-3xl pointer-events-none' />

                <NavLink className='flex items-center pointer-events-auto' to='/'>
                    <Code className={`text-[#7C86FF] w-8 h-8`}/>
                    <span className={`text-white font-bold ml-3 text-2xl`}>
                        GUC Hub
                    </span>
                </NavLink>
                <p className='mt-20 text-5xl font-bold text-white tracking-tight'>
                    The platform for your academic journey.
                </p>
                <p className='text-[#CAD5E2] text-lg mt-6'>
                    Connect with instructors, showcase your portfolios, and discover mentored projects all in one unified ecosystem.
                </p>

                <div className='flex mt-10'>
                    <div className='bg-[#615FFF]/20 rounded-xl h-fit w-fit'>
                        <Briefcase className='text-[#7C86FF] w-5 h-5 m-2.5' />
                    </div>
                    <div className='flex flex-col ml-4'>
                        <span className='text-md font-semibold text-white'>
                            Find Projects
                        </span>
                        <span className='text-sm text-[#90A1B9]'>
                            Explore and apply to academic and mentored projects.
                        </span>
                    </div>
                </div>

                <div className='flex mt-6'>
                    <div className='bg-[#615FFF]/20 rounded-xl h-fit w-fit'>
                        <CircleUserRound className='text-[#7C86FF] w-5 h-5 m-2.5' />
                    </div>
                    <div className='flex flex-col ml-4'>
                        <span className='text-md font-semibold text-white'>
                            Build Portfolios
                        </span>
                        <span className='text-sm text-[#90A1B9]'>
                            Showcase your skills, courses, and achievements.
                        </span>
                    </div>
                </div>

                <div className='flex mt-6'>
                    <div className='bg-[#615FFF]/20 rounded-xl h-fit w-fit'>
                        <Users className='text-[#7C86FF] w-5 h-5 m-2.5' />
                    </div>
                    <div className='flex flex-col ml-4'>
                        <span className='text-md font-semibold text-white'>
                            Connect with Faculty
                        </span>
                        <span className='text-sm text-[#90A1B9]'>
                            Discover instructor profiles and their research interests.
                        </span>
                    </div>
                </div>

                <p className='text-[#90A1B9] text-sm mt-auto'>
                    © 2026 German University in Cairo. All rights reserved.
                </p>
            </div>

            <main className='flex-1 flex flex-col items-center justify-center bg-white px-5'>
                <p className='text-3xl font-bold text-start text-navy w-full max-w-md'>
                    Welcome back
                </p>

                <p className='text-sm text-start mt-2 mb-8 text-[#45556C] w-full max-w-md'>
                    Log in or create an account to get started with GUC Hub!
                </p>

                <div className='flex flex-col rounded-2xl w-full max-w-md'>
                    {children}
                </div>
            </main>
        </div>
  )
}

export default AuthLayout