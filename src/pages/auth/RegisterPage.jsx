import React, { useEffect } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { NavLink, useLocation, useNavigate } from 'react-router'
import StepIndicator from '../../components/ui/StepIndicator'
import { Briefcase, ChevronRight, GraduationCap, Shield } from 'lucide-react'
import StudentAccountStep from '../../components/ui/StudentAccountStep'
import InstructorAccountStep from '../../components/ui/InstructorAccountStep'
import EmployerAccountStep from '../../components/ui/EmployerAccountStep'
import { useAuth } from '../../context/AuthContext'

const RegisterPage = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (user) {
    navigate('/');
  }
}, [user, navigate]);

  const activeClassName = 'flex text-sm font-medium py-2.5 w-full items-center justify-center rounded-md bg-white drop-shadow-md'
  const inactiveClassName = 'flex text-sm font-medium text-[#62748E] py-2.5 w-full items-center justify-center rounded-md hover:bg-white/80 transition-colors duration-200'
  
  const activeAccountTypeClassName = 'flex flex-col items-center gap-2 bg-[#EEF2FF] border-2 border-[#4F39F6] rounded-xl p-4 w-full max-w-xs hover:cursor-pointer hover:bg-[#EEF2FF]/60 hover:border-[#4F39F6]/60 transition duration-200'
  const inactiveAccountTypeClassName = 'flex flex-col items-center gap-2 bg-white border-2 border-[#E2E8F0] rounded-xl p-4 w-full max-w-xs hover:cursor-pointer hover:bg-[#EEF2FF]/60 hover:border-[#4F39F6]/60 transition duration-200'

  // State/Data
  const [activeStep, setActiveStep] = React.useState(0);
  const [accountType, setAccountType] = React.useState(null);

  const handleAccountTypeSelection = (type) => {
    if (accountType === type) {
      setAccountType(null);
    } else {
      setAccountType(type);
    }
  }

  const AccountTypeSelectionStep = () => {
    return (
      <>
        <p className='text-lg font-semibold text-center mt-6 mb-8 text-[#0F172B]'>
          Select Account Type
        </p>

        <div className='flex items-center justify-center gap-3'>
          <button onClick={() => {handleAccountTypeSelection('student');}} className={accountType === 'student' ? activeAccountTypeClassName : inactiveAccountTypeClassName}>
            <GraduationCap className={`size-6 ${accountType === 'student' ? 'text-[#4F39F6]' : 'text-[#90A1B9] transition-colors duration-200'}`} />
            <span className='text-sm font-medium text-[#0F172B]'>
              Student
            </span>
          </button>
          <button onClick={() => {handleAccountTypeSelection('instructor');}} className={accountType === 'instructor' ? activeAccountTypeClassName : inactiveAccountTypeClassName}>
            <Shield className={`size-6 ${accountType === 'instructor' ? 'text-[#4F39F6]' : 'text-[#90A1B9] transition-colors duration-200'}`} />
            <span className='text-sm font-medium text-[#0F172B]'>
              Instructor
            </span>
          </button>
          <button onClick={() => {handleAccountTypeSelection('employer');}} className={accountType === 'employer' ? activeAccountTypeClassName : inactiveAccountTypeClassName}>
            <Briefcase className={`size-6 ${accountType === 'employer' ? 'text-[#4F39F6]' : 'text-[#90A1B9] transition-colors duration-200'}`} />
            <span className='text-sm font-medium text-[#0F172B]'>
              Employer
            </span>
          </button>
        </div>

        <button disabled={!accountType} onClick={() => setActiveStep((prev) => prev + 1)} className='flex items-center w-full justify-center mt-8 bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5] hover:cursor-pointer transition-colors duration-200 disabled:bg-[#432DD7]/60 disabled:cursor-not-allowed'>
            Continue <ChevronRight className='size-4 ml-1' />
        </button>
      </>
    );
  };

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

      <div className='flex items-center justify-center mt-6 gap-2'>
        <StepIndicator activeStep={activeStep >= 0} />
        <StepIndicator activeStep={activeStep >= 1} />
      </div>

      <div key={activeStep} className='slide-in'>
        {activeStep === 0 && <AccountTypeSelectionStep />}
        {activeStep === 1 && accountType === 'student' && <StudentAccountStep setActiveStep={setActiveStep} />}
        {activeStep === 1 && accountType === 'instructor' && <InstructorAccountStep setActiveStep={setActiveStep} />}
        {activeStep === 1 && accountType === 'employer' && <EmployerAccountStep activeStep={activeStep} setActiveStep={setActiveStep} />}
      </div>

    </AuthLayout>
  )
}

export default RegisterPage