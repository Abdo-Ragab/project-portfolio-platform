import { ArrowRight, Circle, Clock, Heart, Star, User } from 'lucide-react';
import React from 'react'
import { courses } from '../../data/courses';
import { NavLink } from 'react-router';
import { instructors, students } from '../../data/users';
import { useAuth } from '../../context/AuthContext';

const ProjectCard = ({ project, likedList }) => {
    const { user } = useAuth();

    const isBachelor = project.courseId === 'c5';
    const projectTypeClassName = isBachelor 
                                ? 'text-xs font-medium py-0.5 px-1.5 rounded-sm bg-[#E0E7FF] text-[#372AAC]' 
                                : 'text-xs font-medium py-0.5 px-1.5 rounded-sm bg-[#F3F4F6] text-[#4A5565]';
    const course = courses.find((course) => course.id === project.courseId);

    const [isLiked, setIsLiked] = React.useState(user?.likedProjectsIds?.includes(project.id));

    return (
        <NavLink key={project.id} to={`/projects/${project.id}`} className='flex justify-between gap-4 bg-white p-5 w-full border-b border-[#E2E8F0] hover:bg-gray-50 transition-colors duration-150'>
            <div className='flex flex-col'>
                <div className='flex items-center'>
                    <p className='text-lg font-semibold text-[#432DD7]'>
                        {project.title}
                    </p>
                    <span className='text-[10px] font-medium text-[#6A7282] mt-px ml-2 border border-[#E2E8F0] rounded-full px-2 py-1'>
                        {project.visibility === 'public' ? 'Public' : 'Private'}
                    </span>
                </div>
                <p className='text-sm text-[#4A5565] mt-1 mb-3 line-clamp-3'>
                    {project.shortDescription}
                </p>
                <div className='flex gap-4 mt-auto'>
                    <div className='flex items-center'>
                        <Circle className='w-2.5 h-2.5 text-[#2B7FFF] fill-[#2B7FFF]' />
                        <span className='text-xs text-[#6A7282] ml-1.5'>
                            {project.languages[0]}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <Star className='w-3.5 h-3.5 text-[#99A1AF]' />
                        <span className='text-xs text-[#6A7282] ml-1'>
                            {project.rating}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <User className='w-3.5 h-3.5 text-[#99A1AF]' />
                        <span className='text-xs text-[#6A7282] ml-1'>
                            {students.find((student) => student.id === project.creatorId)?.firstName} {students.find((student) => student.id === project.creatorId)?.lastName}
                        </span>
                    </div>
                    <div className='flex items-center'>
                        <Clock className='w-3.5 h-3.5 text-[#99A1AF]' />
                        <span className='text-xs text-[#6A7282] ml-1'>
                            {project.createdAt}
                        </span>
                    </div>
                    <div className={projectTypeClassName}>
                        {isBachelor ? 'Bachelor' : courses.find((course) => course.id === project.courseId)?.code}
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-end justify-between'>
                {(user && (user.role === 'student' || user.role === 'employer')) && (
                    <Heart
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(prev => !prev); likedList && likedList(prev => prev.filter(p => p.id !== project.id)); if (!isLiked) likedList && likedList(prev => [...prev, project]); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setIsLiked(prev => !prev); } }}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isLiked}
                        className={`size-5 cursor-default outline-none ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-500'} transition-colors duration-150`}
                    />
                )}
                <div className='flex items-center ml-auto relative'>
                    <img src={instructors.find((instructor) => instructor.id === project.instructorIds[0])?.avatar} alt={course.name} className='w-6 h-6 border-2 border-white rounded-full mr-3' />
                    <img src={students.find((student) => student.id === project.creatorId)?.avatar} alt={course.name} className='w-6 h-6 border-2 border-white rounded-full mr-1 absolute left-3' />
                </div>
            </div>
        </NavLink>
    )
}

export default ProjectCard