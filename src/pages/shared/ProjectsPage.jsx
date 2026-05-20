import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { fuseProjects } from '../../data/projects';
import { useLocation } from 'react-router';
import SearchBarSharedPages from '../../components/ui/SearchBarSharedPages';
import { ChevronDown, Funnel } from 'lucide-react';
import ProjectCard from '../../components/ui/ProjectCard';
import { courses } from '../../data/courses';
import { instructors } from '../../data/users';

const ProjectsPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];
    
    const [query, setQuery] = React.useState('');
    const [filterCourse, setFilterCourse] = React.useState('');
    const [filterInstructor, setFilterInstructor] = React.useState('');
    const [dataRange, setDataRange] = React.useState('');
    const [sortCriteria, setSortCriteria] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);

    const location = useLocation();
    const dropdownClassName = 'h-full cursor-pointer w-36.5 px-3 py-2 pr-10 border border-[#E2E8F0] rounded-lg text-sm text-[#4A5565] outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 bg-white appearance-none';

    const filteredList = fuseProjects.search(query).filter(result => {
                    return filterCourse ? result.item.courseId === filterCourse : true;
                }).filter(result => {
                    return filterInstructor ? result.item.instructorIds.includes(filterInstructor) : true;
                }).filter(result => {
                    if (dataRange === 'lastWeek') {
                        const projectDate = new Date(result.item.createdAt);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return projectDate >= oneWeekAgo;
                    } else if (dataRange === 'lastMonth') {
                        const projectDate = new Date(result.item.createdAt);
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                        return projectDate >= oneMonthAgo;
                    }
                    else if (dataRange === 'lastYear') {
                        const projectDate = new Date(result.item.createdAt);
                        const oneYearAgo = new Date();
                        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                        return projectDate >= oneYearAgo;
                    } else if (dataRange === 'lastTwoYears') {
                        return true;
                    }
                    return true;
                }).sort((a, b) => {
                    if (sortCriteria === '') {
                        return new Date(b.item.createdAt) - new Date(a.item.createdAt);
                    } else if (sortCriteria === 'oldest') {
                        return new Date(a.item.createdAt) - new Date(b.item.createdAt);
                    } else if (sortCriteria === 'highestRated') {
                        return b.item.rating - a.item.rating;
                    } else if (sortCriteria === 'lowestRated') {
                        return a.item.rating - b.item.rating;
                    }
                });


    return (
        <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='p-8'>
            <div className='flex justify-between items-center mb-6'>
                <p className='text-2xl font-bold text-navy'>Browse Projects</p>
                <p className='text-sm text-[#6A7282]'>Showing {filteredList.length} results</p>
            </div>
            <div key={location.pathname} className='slide-in flex flex-col mt-2 w-full'>

                <div className='flex gap-4'>
                    <SearchBarSharedPages query={query} setQuery={setQuery} placeholder='Search project titles...' />
                    <div className='relative'>
                        <select
                            value={filterCourse}
                            onChange={(e) => setFilterCourse(e.target.value)}
                            className={dropdownClassName}
                        >
                            <option value=''>All Courses</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
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
                            <option value=''>Newest</option>
                            <option value='oldest'>Oldest</option>
                            <option value='highestRated'>Highest Rated</option>
                            <option value='lowestRated'>Lowest Rated</option>
                        </select>
                        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                    </div>
                    <button onClick={() => setShowFilters((prev) => !prev)} className={`flex text-center items-center bg-white p-3 rounded-md border text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${showFilters ? 'border-[#432DD7] text-[#432DD7]' : 'border-[#E2E8F0] text-[#364153]'}`}>
                        <Funnel className='size-4 font-medium' /> <span className='ml-1.5 font-medium text-sm text-[#45556C]'>Filters</span>
                    </button>
                </div>
                
                <div className={`flex bg-surface rounded-lg p-4 border border-[#E2E8F0] w-full mt-4 items-center gap-4 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className='flex flex-col gap-1'>
                        <span className='text-xs text-[#6A7282] font-bold uppercase tracking-wider'>Instructor</span>
                        <div className='relative'>
                            <select
                                value={filterInstructor}
                                onChange={(e) => setFilterInstructor(e.target.value)}
                                className={dropdownClassName}
                            >
                                <option value=''>All Instructors</option>
                                {instructors.map(i => (
                                    <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>
                                ))}
                            </select>
                            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-1'>
                        <span className='text-xs text-[#6A7282] font-bold uppercase tracking-wider'>Date Range</span>
                        <div className='relative'>
                            <select
                                value={dataRange}
                                onChange={(e) => setDataRange(e.target.value)}
                                className={dropdownClassName}
                            >
                                <option value=''>All Time</option>
                                <option value='lastWeek'>Last Week</option>
                                <option value='lastMonth'>Last Month</option>
                                <option value='lastYear'>Last Year</option>
                            </select>
                            <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
                        </div>
                    </div>
                </div>

                {filteredList.length > 0 && (
                    <div key={location.pathname} className='slide-in flex flex-col mt-4 rounded-lg border border-[#E2E8F0] overflow-hidden'>
                        {filteredList.map((result) => (
                            <ProjectCard key={result.item.id} project={result.item} />
                        ))}
                    </div>
                )}

                {filteredList.length === 0 && (
                    <div className='flex-1 flex items-center justify-center mt-24 rounded-lg'>
                        <p className='text-xl text-[#45556C]'>No projects found.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
  )
}

export default ProjectsPage