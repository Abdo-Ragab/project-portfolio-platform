import React from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router';
import NavBar from '../../components/layout/NavBar';
import { projects } from '../../data/projects';
import { ArrowLeft, BookOpen, Briefcase, Calendar, CodeXml, Download, Edit, ExternalLink, FileText, FolderKanban, GitPullRequestArrowIcon, GraduationCap, Mail, Star } from 'lucide-react';
import { courses } from '../../data/courses';
import { employers, instructors, students } from '../../data/users';
import { majors } from '../../data/majors';
import { internships } from '../../data/internships';
import ProjectCard from '../../components/ui/ProjectCard';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';
import DashboardLayout from '../../components/layout/DashboardLayout';
import BackButton from '../../components/ui/BackButton';
import PortfoliosDetailsCard from '../../components/ui/PortfoliosDetailsCard';
import InternshipCard from '../../components/ui/InternshipCard';

const PortfoliosDetailsPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];

    const [page, setPage] = React.useState('projects');

    const activeClassName = 'cursor-pointer pb-[13px] text-[#432DD7] text-sm font-bold border-b-3 border-[#432DD7] transition-colors duration-150';
    const inactiveClassName = 'cursor-pointer pb-4 text-[#6A7282] text-sm hover:text-[#432DD7] transition-colors duration-150';

    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const student = students.find((s) => s.id === id);

    if (!student) {
        return (<Navigate to='/404' />);
    }

    const studentProjects = projects.filter((project) => (project.creatorId.includes(student.id) || project.collaborators.includes(student.id)) && project.visibility === 'public' && !project.isFlagged && project.showOnPortfolio);

    return (
        <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='px-8 py-4'>
            <BackButton />
            <PortfoliosDetailsCard user={user} student={student} />
            <div key={location.window} className='slide-in flex gap-10 mt-8 mx-2'>
                <div className='flex flex-2 flex-col'>
                    <div className='flex gap-8 border-b border-[#E2E8F0]'>
                        <button className={(page === 'projects' ? activeClassName : inactiveClassName)} onClick={() => setPage('projects')}>
                            Projects
                        </button>
                        <button className={(page === 'internships' ? activeClassName : inactiveClassName)} onClick={() => setPage('internships')}>
                            Internships
                        </button>
                        <button className={(page === 'about' ? activeClassName : inactiveClassName)} onClick={() => setPage('about')}>
                            About
                        </button>
                    </div>

                    <div className='mt-6'>
                        {page === 'projects' && (
                            studentProjects.length > 0 ? (
                                <div className='flex flex-col'>
                                    {studentProjects.map((project) => (
                                        <ProjectCard key={project.id} project={project} />
                                    ))}
                                </div>
                            ) : (
                                <p className='text-center text-[#45556C]'>No projects yet.</p>
                            )
                        )}
                        {page === 'internships' && (
                            <div className='flex flex-col gap-6'>
                                {student.completedInternships.length > 0 ? (
                                    student.completedInternships.map((internshipId) => (
                                        <InternshipCard key={internshipId} internshipId={internshipId} />
                                    ))
                                ) : (
                                    <p className='text-center text-[#45556C]'>This student has not applied for any internships yet.</p>
                                )}
                            </div>
                        )}
                        {page === 'about' && (
                            <div className='flex flex-col gap-4'>
                                <p className='text-sm text-[#6A7282]'>{student.shortBio}</p>
                                <p className='text-sm text-[#6A7282]'>{student.bio}</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className='flex flex-1 flex-col'>
                    <div className='flex items-center'>
                        <BookOpen className='size-4 font-bold text-[#99A1AF]' />
                        <span className='text-xs text-center font-bold text-[#99A1AF] ml-2 uppercase'>
                            Academic Info
                        </span>
                    </div>
                    <div className='flex flex-col items-start bg-white p-4 rounded-lg border border-[#E2E8F0] mt-4'>
                        <p className='text-xs text-[#6A7282]'>
                            Major
                        </p>
                        <p className='text-sm text-navy font-semibold mt-1'>
                            {majors.find((major) => major.id === student.majorId)?.name || 'N/A'}
                        </p>

                        <p className='text-xs text-[#6A7282] mt-4'>
                            Expected Graduation
                        </p>
                        <p className='text-sm text-navy font-semibold mt-1'>
                            {student.graduationYear || 'N/A'}
                        </p>
                    </div>

                    <div className='flex items-center mt-8'>
                        <CodeXml className='size-4 font-bold text-[#99A1AF]' />
                        <span className='text-xs text-center font-bold text-[#99A1AF] ml-2 uppercase'>
                            Skills
                        </span>
                    </div>

                    <div className='flex flex-wrap mt-4'>
                        {student.skills.map((skill, index) => (
                            <span key={index} className='text-xs text-[#364153] font-medium border border-[#E2E8F0] bg-white rounded-md px-2.5 py-1.5 mr-2 mb-2 drop-shadow-md'>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default PortfoliosDetailsPage