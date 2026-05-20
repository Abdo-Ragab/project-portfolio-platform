import React from 'react'
import { fuseInstructors } from '../../data/users';
import { ADMIN_TABS, ADMIN_TABS_SECONDARY, EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY, STUDENT_TABS, STUDENT_TABS_SECONDARY, INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs';
import { useLocation } from 'react-router';
import SearchBarSharedPages from '../../components/ui/SearchBarSharedPages';
import InstructorCard from '../../components/ui/InstructorCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const InstructorsPage = () => {
    const { user, login, logout } = useAuth();
    const tabs = user.role === 'student' ? STUDENT_TABS : user.role === 'employer' ? EMPLOYER_TABS : user.role === 'admin' ? ADMIN_TABS : user.role === 'instructor' ? INSTRUCTOR_TABS : [];
    const secondaryTabs = user.role === 'student' ? STUDENT_TABS_SECONDARY : user.role === 'employer' ? EMPLOYER_TABS_SECONDARY : user.role === 'admin' ? ADMIN_TABS_SECONDARY : user.role === 'instructor' ? INSTRUCTOR_TABS_SECONDARY : [];    

    const [query, setQuery] = React.useState('');
    const location = useLocation();

    const filteredList = fuseInstructors.search(query);

    return (
        <DashboardLayout tabs={tabs} secondaryTabs={secondaryTabs} childrenClassName='p-8'>
            <div className='flex justify-between items-center mb-6'>
                <p className='text-2xl font-bold text-navy'>Browse Instructors</p>
                <p className='text-sm text-[#6A7282]'>Showing {filteredList.length} results</p>
            </div>
            <div key={location.pathname} className='slide-in flex flex-col mt-2 w-full'>
                <SearchBarSharedPages query={query} setQuery={setQuery} placeholder='Search for instructors by name or course...' />
                
                {filteredList.length > 0 ? (
                    <div className='slide-in flex flex-col mt-4 rounded-lg border border-[#E2E8F0] overflow-hidden'>
                        {filteredList.map(result => (
                            <InstructorCard key={result.item.id} instructor={result.item} />
                        ))}
                    </div>
                ) : null}

                {filteredList.length === 0 && (
                    <div className='flex-1 flex items-center justify-center mt-20 rounded-lg'>
                        <p className='text-xl text-[#45556C]'>No instructors found.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default InstructorsPage