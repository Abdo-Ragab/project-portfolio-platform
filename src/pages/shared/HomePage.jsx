import React from 'react'
import NavBar from '../../components/layout/NavBar'
import { NavLink, useNavigate, useParams } from 'react-router';
import Hero from '../../components/ui/Hero';
import NotFoundPage from './NotFoundPage';
import { BookOpen, Code, Star, Users } from 'lucide-react';
import { projects } from '../../data/projects';
import ProjectCard from '../../components/ui/ProjectCard';

const HomePage = () => {

  return (
        <div className='flex flex-col'>
            <div className='flex flex-col h-screen'>
                <Hero />
                <div className='flex items-center justify-center py-12 gap-44 border-b border-[#E2E8F0] bg-white'>
                    <div className='flex gap-4 items-center'>
                        <div className='bg-[#EFF6FF] rounded-xl h-fit w-fit'>
                            <Users className='text-[#155DFC] size-6 m-3' />
                        </div>
                        <div className='flex flex-col ml-4'>
                            <span className='text-3xl font-bold text-navy'>
                                4200+
                            </span>
                            <span className='text-sm font-medium text-[#6A7282] uppercase'>
                                Active Students
                            </span>
                        </div>
                    </div>

                    <div className='flex gap-4 items-center'>
                        <div className='bg-[#FAF5FF] rounded-xl h-fit w-fit'>
                            <BookOpen className='text-[#9810FA] size-6 m-3' />
                        </div>
                        <div className='flex flex-col ml-4'>
                            <span className='text-3xl font-bold text-navy'>
                                850+
                            </span>
                            <span className='text-sm font-medium text-[#6A7282] uppercase'>
                                Mentored Projects
                            </span>
                        </div>
                    </div>

                    <div className='flex gap-4 items-center'>
                        <div className='bg-[#ECFDF5] rounded-xl h-fit w-fit'>
                            <Star className='text-[#009966] size-6 m-3' />
                        </div>
                        <div className='flex flex-col ml-4'>
                            <span className='text-3xl font-bold text-navy'>
                                120+
                            </span>
                            <span className='text-sm font-medium text-[#6A7282] uppercase'>
                                Hiring Partners
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col self-center items-center justify-center bg-surface py-20 w-[80dvw]'>
                <div className='flex justify-between w-full'>
                    <div className='flex flex-col'>
                        <p className='text-2xl font-bold text-navy w-full'>
                            Recent Projects
                        </p>
                        <p className='text-sm text-[#6A7282] w-full'>
                            Explore top-rated academic works and portfolios across departments.
                        </p>
                    </div>
                    <NavLink to='/projects' className='text-sm self-end font-bold text-[#432DD7] bg-white px-4 py-2 border border-[#E2E8F0] drop-shadow-sm rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-150'>
                        View All Projects 
                    </NavLink>
                </div>
                <div className='flex flex-col mt-8 w-full rounded-lg border border-[#E2E8F0] overflow-hidden'>
                    {projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(project => project.visibility === 'public').slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}
                </div>
            </div>

            <div className='flex flex-col py-12 items-center justify-center bg-white w-full'>
                <NavLink className='flex items-center pointer-events-auto' to='/'>
                    <Code className={`text-[#432DD7] w-6 h-6`}/>
                    <span className={`text-navy font-bold ml-3 text-sm`}>
                        GUC Hub
                    </span>
                </NavLink>
                <p className='text-sm text-center text-[#6A7282] w-full mt-4'>
                    © 2026 German University in Cairo. All rights reserved.
                </p>
            </div>
        </div>
    );
}

export default HomePage