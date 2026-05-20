import React, { useEffect } from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { NavLink, useNavigate } from 'react-router';
import { admins, employers, instructors, students } from '../../data/users';
import toast from 'react-hot-toast';
import OTPInput from '../../components/ui/OTPInput';
import { useAuth } from '../../context/AuthContext';

const ForgotPasswordPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [generatedOTP, setGeneratedOTP] = React.useState('')
  const [email, setEmail] = React.useState('');
  const [enteredOTP, setEnteredOTP] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [passwordError, setPasswordError] = React.useState(null);
  const [passwordErrorShake, setPasswordErrorShake] = React.useState(false);
  const [error, setError] = React.useState('')
  const [shake, setShake] = React.useState(false);

  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = window.location;

  useEffect(() => {
  if (user) {
    navigate('/');
  }
}, [user, navigate]);

  const handleOTPSending = (e) => {
    e.preventDefault();

    if (!email) { 
      setError('Please enter your email');
      setShake(true);
      return; 
    }
    if([...students, ...instructors, ...employers, ...admins].find(u => u.email === email) === undefined) {
      setError('No account found with this email');
      setShake(true);
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(otp);
    setError('');

    console.log(`OTP for ${email}: ${otp}`);
    toast.success(`Demo mode - your OTP is: ${otp}`);

    setActiveStep(1);
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (enteredOTP !== generatedOTP) {
      toast.error('Incorrect OTP, please try again');
      return;
    }
    setError('');
    setActiveStep(2);
  }

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { 
      setError('Please fill in all fields'); 
      setShake(true);
      return; 
    }
    if (newPassword !== confirmPassword)  { 
      setError('Passwords do not match');    
      setShake(true);
      return;
    }

    const allUsers = [...students, ...instructors, ...employers, ...admins];
    const userIndex = allUsers.findIndex(u => u.email === email);

    if (userIndex !== -1) {
      allUsers[userIndex].password = newPassword;
    }

    toast.success('Password reset successfully!');
    navigate('/login');
  }

  return (
    <AuthLayout>
      <p className='text-2xl font-bold text-center mt-6 text-[#0F172B]'>
        Reset Password
      </p>
      <p className='text-sm text-center mt-2 text-[#62748E]'>
        Enter your email to receive a 6-digit OTP code.
      </p>

      {activeStep === 0 && (
        <form key={location.pathname} className='slide-in flex flex-col mt-6 gap-1' onSubmit={handleOTPSending}>
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
            {error && (
              <div onAnimationEnd={() => setShake(false)} className={`bg-red-50 border border-red-200 text-red-600 text-sm mt-2 px-4 py-3 rounded-lg ${shake ? "animate-[wiggle_0.25s]" : ""}`}>
                {error}
              </div>
            )}

            <button type='submit' className='mt-6 bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5] hover:cursor-pointer transition-colors duration-200'>
              Send OTP
            </button>
        </form>
      )}

      {activeStep === 1 && (
        <form key={location.pathname} className='slide-in flex flex-col mt-6 gap-1' onSubmit={handleVerifyOTP}>
            <OTPInput value={enteredOTP} onChange={setEnteredOTP} />
            <button type='submit' className='mt-4 bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5] hover:cursor-pointer transition-colors duration-200'>
              Verify OTP
            </button>
        </form>
      )}

      {activeStep === 2 && (
        <form key={location.pathname} className='slide-in flex flex-col mt-6 gap-1' onSubmit={handleResetPassword}>
            <label className='text-sm font-medium text-[#314158]'>
                New Password
            </label>
            <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='••••••••'
                className={`w-full px-3 py-3 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200`}
                required
            />

            <label className='text-sm font-medium text-[#314158]'>
                Confirm Password
            </label>
            <input
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='••••••••'
                className={`w-full px-3 py-3 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200`}
                required
            />

            {error && (
              <div onAnimationEnd={() => setShake(false)} className={`bg-red-50 border border-red-200 text-red-600 text-sm mt-2 px-4 py-3 rounded-lg ${shake ? "animate-[wiggle_0.25s]" : ""}`}>
                {error}
              </div>
            )}

            <button type='submit' className='mt-6 bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5] hover:cursor-pointer transition-colors duration-200'>
              Reset Password
            </button>
        </form>
      )}

      <NavLink to='/login' className='text-sm text-[#45556C] hover:opacity-70 mt-6 text-center'>
        Back to Login
      </NavLink>
    </AuthLayout>
  )
}

export default ForgotPasswordPage