import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext';
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';
import { projects } from '../../data/projects';
import ProjectCard from '../../components/ui/ProjectCard';
import { students } from '../../data/users';
import StudentCard from '../../components/ui/StudentCard';
import { useLocation } from 'react-router';

const FavoritesPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];

    const location = useLocation();
    const [page, setPage] = React.useState('projects');
    const [projectsList, setProjectsList] = React.useState([]);
    const [portfoliosList, setPortfoliosList] = React.useState([]);

    React.useEffect(() => {
        setProjectsList(projects.filter((project) => (user?.likedProjectsIds || []).includes(project.id)));
        setPortfoliosList(students.filter((student) => (user?.portfoliosIds || []).includes(student.id)));
    }, [user]);

    const activeClassName = 'cursor-pointer pb-[13px] text-[#432DD7] text-sm font-bold border-b-3 border-[#432DD7] transition-colors duration-150';
    const inactiveClassName = 'cursor-pointer pb-4 text-[#6A7282] text-sm hover:text-[#432DD7] transition-colors duration-150';

  return (
    <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='p-8'>
        <div className='flex gap-8 border-b mb-8 border-[#E2E8F0]'>
            <button className={(page === 'projects' ? activeClassName : inactiveClassName)} onClick={() => setPage('projects')}>
                Favorite Projects
            </button>
            <button className={(page === 'portfolios' ? activeClassName : inactiveClassName)} onClick={() => setPage('portfolios')}>
                Favorite Portfolios
            </button>
        </div>
        {page === 'projects' && projectsList.length > 0 && (
            <div key={page} className='slide-in flex flex-col mt-4 rounded-lg border border-[#E2E8F0] overflow-hidden'>
                {projectsList.map((project) => (
                    <ProjectCard key={project.id} project={project} likedList={setProjectsList} />
                ))}
            </div>
        )}

        {projectsList.length === 0 && page === 'projects' && (
            <p className='text-center text-[#6A7282]'>You haven't liked any projects yet.</p>
        )}

        {page === 'portfolios' && portfoliosList.length > 0 && (
            <div key={page} className='slide-in flex flex-col mt-4 rounded-lg border border-[#E2E8F0] overflow-hidden'>
                {portfoliosList.map((student) => (
                    <StudentCard key={student.id} student={student} portfoliosList={setPortfoliosList} />
                ))}
            </div>
        )}

        {portfoliosList.length === 0 && page === 'portfolios' && (
            <p className='text-center text-[#6A7282]'>You haven't liked any portfolios yet.</p>
        )}
    </DashboardLayout>
  )
}

export default FavoritesPage