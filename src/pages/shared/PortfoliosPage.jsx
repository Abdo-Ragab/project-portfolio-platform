import React from 'react'
import { fuseStudents, students } from '../../data/users';
import { projects } from '../../data/projects';
import { useLocation } from 'react-router';
import { ChevronDown, Funnel } from 'lucide-react';
import SearchBarSharedPages from '../../components/ui/SearchBarSharedPages';
import { majors } from '../../data/majors';
import StudentCard from '../../components/ui/StudentCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';

const PortfoliosPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];

    const [query, setQuery] = React.useState('');
    const [filterMajor, setFilterMajor] = React.useState('');
    const [filterSkills, setFilterSkills] = React.useState('');
    const [sortCriteria, setSortCriteria] = React.useState('mostProjects');
    const [showFilters, setShowFilters] = React.useState(false);

    const location = useLocation();
    const dropdownClassName = 'h-full cursor-pointer w-36.5 px-3 py-2 pr-10 border border-[#E2E8F0] rounded-lg text-sm text-[#4A5565] outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 bg-white appearance-none';

    const skills = students.reduce((acc, student) => {
        student.skills.forEach(skill => {
            if (!acc.some(s => s.id === skill)) {
                acc.push({ id: skill, name: skill });
            }
        });
        return acc;
    }, []);

    const filteredList = fuseStudents.search(query).filter(result => {
          return filterMajor ? result.item.majorId === filterMajor : true;
      }).filter(result => {
          return filterSkills ? result.item.skills.includes(filterSkills) : true;
      }).sort((a, b) => {
        const aProjects = projects.filter((project) => project.creatorId.includes(a.item.id) || project.collaborators.includes(a.item.id)).length;
        const bProjects = projects.filter((project) => project.creatorId.includes(b.item.id) || project.collaborators.includes(b.item.id)).length;
          if (sortCriteria === 'mostProjects') {
              return bProjects - aProjects;
          } else if (sortCriteria === 'leastProjects') {
              return aProjects - bProjects;
          }
      });

    return (
        <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='p-8'>
            <div className='flex justify-between items-center mb-6'>
                <p className='text-2xl font-bold text-navy'>Student Portfolios</p>
                <p className='text-sm text-[#6A7282]'>Showing {filteredList.length} results</p>
            </div>
            <div key={location.pathname} className='slide-in flex flex-col mt-6 w-full'>
                
                <div className='flex gap-4'>
                    <SearchBarSharedPages query={query} setQuery={setQuery} placeholder='Search portfolios by name or email...' />
                    <div className='relative'>
                        <select
                            value={filterMajor}
                            onChange={(e) => setFilterMajor(e.target.value)}
                            className={dropdownClassName}
                        >
                            <option value=''>All Majors</option>
                            {majors.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                    </div>
                    <div className='relative'>
                        <select
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                            className={dropdownClassName}
                        >
                            <option value='mostProjects'>Most Projects</option>
                            <option value='leastProjects'>Least Projects</option>
                        </select>
                        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                    </div>
                    <button onClick={() => setShowFilters((prev) => !prev)} className={`flex text-center items-center bg-white p-3 rounded-md border text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${showFilters ? 'border-[#432DD7] text-[#432DD7]' : 'border-[#E2E8F0] text-[#364153]'}`}>
                        <Funnel className='size-4 font-medium' /> <span className='ml-1.5 font-medium text-sm text-[#45556C]'>Filters</span>
                    </button>
                </div>
                
                <div className={`flex bg-surface rounded-lg p-4 border border-[#E2E8F0] w-full mt-4 items-center gap-4 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className='flex flex-col gap-1'>
                        <span className='text-xs text-[#6A7282] font-bold uppercase tracking-wider'>Specific Skill</span>
                        <div className='relative'>
                            <select
                                value={filterSkills}
                                onChange={(e) => setFilterSkills(e.target.value)}
                                className={dropdownClassName}
                            >
                                <option value=''>All Skills</option>
                                {skills.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                        </div>
                    </div>
                </div>

                {filteredList.length > 0 && (
                    <div key={location.pathname} className='slide-in flex flex-col mt-4 rounded-lg border border-[#E2E8F0] overflow-hidden'>
                        {filteredList.map(result => (
                            <StudentCard key={result.item.id} student={result.item} />
                        ))}
                    </div>
                )}
                {filteredList.length === 0 && (
                    <div className='flex-1 flex items-center justify-center mt-24 rounded-lg'>
                        <p className='text-xl text-[#45556C]'>No portfolios found.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default PortfoliosPage