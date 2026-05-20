import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import SideBar from './SideBar'
import { useAuth } from '../../context/AuthContext'
import { Bell, Code } from 'lucide-react'
import NavBar from './NavBar'

const DashboardLayout = ({ tabs, secondaryTabs, children, childrenClassName, notifications }) => {
    const { user, login, logout } = useAuth();

    return (
        <div className={`flex flex-col h-screen`}>
            <NavBar notifications={notifications} />
            <div className='flex flex-1 overflow-hidden'>
                <SideBar tabs={tabs} secondaryTabs={secondaryTabs} />

                <main className={`flex-1 overflow-y-auto bg-surface ${childrenClassName || ''}`}>
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
