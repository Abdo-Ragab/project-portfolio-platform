import React from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router';
import NavBar from '../../components/layout/NavBar';
import { projects } from '../../data/projects';
import { ArrowLeft, BookOpen, Briefcase, Calendar, Download, ExternalLink, FileText, GitPullRequestArrowIcon, GraduationCap, Mail, Star, Users } from 'lucide-react';
import { courses } from '../../data/courses';
import { employers, instructors, students } from '../../data/users';
import { majors } from '../../data/majors';
import { internships } from '../../data/internships';
import ProjectCard from '../../components/ui/ProjectCard';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';
import BackButton from '../../components/ui/BackButton';
import DashboardLayout from '../../components/layout/DashboardLayout';
import InstructorDetailsCard from '../../components/ui/InstructorDetailsCard';

const InstructorDetailsPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const instructor = instructors.find((i) => i.id === id);

  if (!instructor) {
    navigate('/404')
    return null
  }

    const supervisedProjects = projects.filter((project) => project.instructorIds.includes(instructor.id) && project.visibility === 'public' && !project.isFlagged);

    return (
        <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='px-8 py-4'>
            <BackButton />
            <InstructorDetailsCard instructor={instructor} user={user} />
            <div key={location.window} className='slide-in flex gap-10 mt-8 mx-2'>
                <div className='flex flex-2 flex-col'>
                    <p className='text-lg font-semibold text-navy'>Biography</p>
                    <p className='text-base text-[#364153] mt-4'>
                        {instructor.bio}
                    </p>

                    <div className='w-full h-px bg-[#E2E8F0] my-10' />
                    
                    <div className='flex mt-1 items-center'>
                        <Users className='size-5 text-[#99A1AF]' />
                        <span className='text-lg text-center font-semibold text-navy ml-2'>
                            Supervised Projects
                        </span>
                    </div>
                    <div className='mt-4 flex flex-col'>
                        {supervisedProjects.length > 0 ? (
                            supervisedProjects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))
                        ) : (
                            <p className='text-center text-[#45556C]'>This instructor has not supervised any projects yet.</p>
                        )}
                    </div>
                </div>
                
                <div className='flex flex-1 flex-col'>
                    <div className='flex items-center mb-4'>
                        <BookOpen className='size-4 font-bold text-[#99A1AF]' />
                        <span className='text-xs text-center font-bold text-[#99A1AF] ml-2 uppercase'>
                            Linked Courses
                        </span>
                    </div>
                    {courses.filter((course) => instructor.linkedCourses.includes(course.id)).map((course) => (
                        <div key={course.id} className='flex flex-col items-start bg-white p-4 rounded-lg border border-[#E2E8F0] mb-3'>
                            <div className='flex items-center w-full'>
                                <span className='text-sm font-bold text-navy mr-2'>
                                    {course.code}
                                </span>
                                <span className='text-[10px] font-bold bg-[#EFF6FF] text-[#1447E6] rounded-sm px-1.5 py-0.5 ml-auto uppercase'>
                                    Semester {course.semester}
                                </span>
                            </div>
                            <p className='text-xs text-[#4A5565] mt-1'>
                                {course.name}
                            </p>
                        </div>
                    ))}

                    <div className='flex items-center mt-4'>
                        <GraduationCap className='size-4 font-bold text-[#99A1AF]' />
                        <span className='text-xs text-center font-bold text-[#99A1AF] ml-2 uppercase'>
                            Education Timeline
                        </span>
                    </div>
                    <div className='mt-4 ml-2.5 flex flex-col'>
                        {instructor.education.toReversed().map((edu, index) => (
                            <div key={index} className='relative'>
                                <div className={`absolute left-0 top-2.5 w-3 h-3 bg-white border-3 ${index === 0 ? 'border-[#432DD7]' : 'border-[#D1D5DC]'} rounded-full -translate-x-1/2 -translate-y-1/2`} />
                                <div key={index} className={`flex flex-col pl-6 ${index !== instructor.education.length - 1 ? 'pb-6' : ''} border-l border-[#E5E7EB]`}>
                                    <span className='text-sm font-bold text-navy'>
                                        {edu.degree} in {edu.field}
                                    </span>
                                    <span className='text-xs font-medium text-[#432DD7]'>
                                        {edu.institution}
                                    </span>
                                    <span className='text-xs text-[#6A7282] mt-1'>
                                        {edu.year}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default InstructorDetailsPage