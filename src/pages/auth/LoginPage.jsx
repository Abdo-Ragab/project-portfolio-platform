import { useEffect, useState } from 'react'
import NavBar from '../../components/layout/NavBar'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { admins, employers, instructors, students } from '../../data/users'
import AuthLayout from '../../components/layout/AuthLayout'
import React from 'react'

const LoginPage = () => {
  const { user, login, logout } = useAuth();
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
  if (user) {
    navigate('/');
  }
}, [user, navigate]);

  // Form State/Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const activeClassName = 'flex text-sm font-medium py-2.5 w-full items-center justify-center rounded-md bg-white drop-shadow-md'
  const inactiveClassName = 'flex text-sm font-medium text-[#62748E] py-2.5 w-full items-center justify-center rounded-md hover:bg-white/80 transition-colors duration-200'
  

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      setShake(true);
      return;
    }

    const isInStudents = students.find((student) => student.email === email && student.password === password);
    const isInInstructors = instructors.find((instructor) => instructor.email === email && instructor.password === password);
    const isInEmployers = employers.find((employer) => employer.email === email && employer.password === password);
    const isInAdmins = admins.find((admin) => admin.email === email && admin.password === password);

    if (!isInStudents && !isInInstructors && !isInEmployers && !isInAdmins) {
      setError('Invalid email or password.');
      setShake(true);
      return;
    }

    if (isInStudents) {
      login(isInStudents);
    } else if (isInInstructors) {
      login(isInInstructors);
    } else if (isInEmployers) {
      login(isInEmployers);
    } else if (isInAdmins) {
      login(isInAdmins);
    }

    navigate('/');
  }

  return (
    <AuthLayout>
      <div className='flex bg-[#F1F5F9] rounded-lg p-1 gap-1'>
          <NavLink to='/login' className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
              Login
          </NavLink>
          <NavLink to='/register' className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
              Sign Up
          </NavLink>
      </div>
      <form key={location.pathname} className='slide-in flex flex-col mt-6 gap-1' onSubmit={handleLogin}>
        <label className='text-sm font-medium text-[#314158]'>
          Email Address
        </label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email Address'
          className='px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200'
          required
        />

        <div className='flex flex-col gap-1 mt-4'>
          <div className='flex justify-between items-center'>
            <label className='text-sm font-medium text-[#314158]'>
              Password
            </label>
            <NavLink to='/forgot-password' className='text-xs text-[#4F39F6] hover:opacity-70'>
              Forgot password?
            </NavLink>
          </div>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
            className='px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200'
            required
          />
        </div>

        {error && (
          <div onAnimationEnd={() => setShake(false)} className={`bg-red-50 border border-red-200 text-red-600 text-sm mt-4 px-4 py-3 rounded-lg ${shake ? "animate-[wiggle_0.25s]" : ""}`}>
            {error}
          </div>
        )}

        <button type='submit' className='mt-4 bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5] hover:cursor-pointer transition-colors duration-200'>
          Log in
        </button>

        <p className='text-xs text-[#62748E] text-center mt-6'>Students and instructors must use their GUC email.</p>

      </form>
    </AuthLayout>
  )
}

export default LoginPage