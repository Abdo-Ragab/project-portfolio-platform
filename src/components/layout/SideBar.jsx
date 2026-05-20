import { LogOutIcon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'
import { useAuth } from '../../context/AuthContext'

const SideBar = ({ tabs = [], secondaryTabs = [] }) => {
  const { logout } = useAuth()

  return (
    <aside className='w-60 bg-white border-r border-gray-200 flex flex-col gap-1'>
      <p className='text-[10px] text-[#99A1AF] font-bold uppercase tracking-wider ml-6 mt-6 mb-3'>personal</p>
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-4 px-3.5 py-2 rounded-r-md text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-[#432DD7]/10 text-[#432DD7] border-l-3 border-[#432DD7]'
                  : 'text-[#45556C] hover:bg-gray-100 hover:text-gray-800'
              }`
            }
          >
            {Icon && <Icon className='w-5 h-5' />}
            {label}
          </NavLink>
        ))}

        <p className='text-[10px] text-[#99A1AF] font-bold uppercase tracking-wider ml-6 mt-6 mb-3'>Manage</p>
        {secondaryTabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 mx-4 px-3.5 py-2 rounded-r-md text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#432DD7] border-l-3 border-[#432DD7]'
                  : 'text-[#45556C] hover:bg-gray-100 hover:text-gray-800'
              }`
            }
          >
            {Icon && <Icon className='w-5 h-5' />}
            {label}
          </NavLink>
        ))}
        <div className='mt-auto border-t border-[#E2E8F0]'>
            <NavLink className='flex items-center m-4 px-3 py-2 gap-3 rounded-[10px] text-sm font-medium text-[#45556C] hover:bg-gray-100 hover:text-red-500 transition-colors duration-150' onClick={() => {logout();}} to='/'>
                <LogOutIcon className='w-5 h-5'/>
                Log out
            </NavLink>
        </div>
      </aside>
  )
}

export default SideBar
