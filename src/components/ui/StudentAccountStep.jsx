import { Briefcase, ChevronDown, ChevronRight, GraduationCap, Shield } from 'lucide-react';
import React from 'react'
import { majors } from '../../data/majors';
import { students } from '../../data/users';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';

const StudentAccountStep = ({ setActiveStep }) => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [emailError, setEmailError] = React.useState(null);
    const [emailErrorShake, setEmailErrorShake] = React.useState(false);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(null);
    const [passwordErrorShake, setPasswordErrorShake] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [shake, setShake] = React.useState(false);

    const handleRegister = (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields!');
            setShake(true);
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError('* Passwords do not match');
            setPasswordErrorShake(true);
            return;
        }

        if (!email.endsWith('@student.guc.edu.eg')) {
            setEmailError('* Please use your GUC student email');
            setEmailErrorShake(true);
            return;
        }

        setError(null);
        setEmailError(null);
        setPasswordError(null);
        setShake(false);
        setEmailErrorShake(false);
        setPasswordErrorShake(false);

        students.push({
            role: "student",
            id: `s${students.length + 1}`,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            avatar: 'https://ui-avatars.com/api/?name=' + firstName + '+' + lastName + '&background=random',
            major: "",
            gpa: 0,
            classYear: "",
            location: "",
            majorId: "",
            minor: "",
            expectedGraduation: "",
            skills: [],
            linkedin: "",
            github: "",
            personalWebsite: "",
            hackerrankProfile: "",
            resumeUrl: "",
            bio: "",
            shortBio: "",
            graduationYear: new Date().getFullYear(),
            completedInternships: [],
            likedProjectsIds: [],
            portfoliosIds: [],
            internshipExperiences: [],
            isActive: true,
        });
        
        login(students[students.length - 1]);
        navigate('/');
    }

    return (
        <form onKeyDown={(e) => e.key === 'Enter' && handleRegister(e)} onSubmit={handleRegister} className='flex flex-col'>
            <div className='flex items-center justify-between gap-4 mt-6'>
                <div className='flex flex-1 flex-col gap-1'>
                    <label className='text-sm font-medium text-[#314158]'>
                        First Name
                    </label>
                    <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='Khalid'
                    className='w-full px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200'
                    required
                    />
                </div>

                <div className='flex flex-1 flex-col gap-1'>
                    <label className='text-sm font-medium text-[#314158]'>
                        Last Name
                    </label>
                    <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Khedr'
                    className='w-full px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200'
                    required
                    />
                </div>
            </div>

            <label className='text-sm font-medium text-[#314158] mt-4 mb-1'>
                GUC Email
            </label>
            <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='your.name@student.guc.edu.eg'
            onAnimationEnd={() => setEmailErrorShake(false)}
            className={`w-full px-3 py-3 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 ${emailErrorShake ? "animate-[wiggle_0.25s]": ""} ${emailError ? "border-2 border-red-600" : "border border-gray-200"}`}
            required
            />
            {emailError && (
                <div onAnimationEnd={() => setEmailErrorShake(false)} className={`text-red-600 text-sm mt-2 rounded-lg ${emailErrorShake ? "animate-[wiggle_0.25s]" : ""}`}>
                    {emailError}
                </div>
            )}

            <div className='flex items-center justify-between gap-4 mt-4'>
                <div className='flex flex-1 flex-col gap-1'>
                    <label className='text-sm font-medium text-[#314158]'>
                        Password
                    </label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='••••••••'
                        onAnimationEnd={() => setPasswordShake(false)}
                        className={`w-full px-3 py-3 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 ${passwordErrorShake ? "animate-[wiggle_0.25s]": ""} ${passwordError ? "border-2 border-red-600" : "border border-gray-200"}`}
                        required
                    />
                </div>

                <div className='flex flex-1 flex-col gap-1'>
                    <label className='text-sm font-medium text-[#314158]'>
                        Confirm Password
                    </label>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='••••••••'
                        onAnimationEnd={() => setPasswordErrorShake(false)}
                        className={`w-full px-3 py-3 rounded-lg text-sm outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20 transition-all duration-200 ${passwordErrorShake ? "animate-[wiggle_0.25s]": ""} ${passwordError ? "border-2 border-red-600" : "border border-gray-200"}`}
                        required
                    />
                </div>
            </div>

            {passwordError && (
                <div onAnimationEnd={() => setPasswordErrorShake(false)} className={`text-red-600 text-sm mt-1 rounded-lg ${passwordErrorShake ? "animate-[wiggle_0.25s]" : ""}`}>
                    {passwordError}
                </div>
            )}

            {error && (
            <div onAnimationEnd={() => setShake(false)} className={`bg-red-50 border border-red-200 text-red-600 text-sm mt-4 px-4 py-3 rounded-lg ${shake ? "animate-[wiggle_0.25s]" : ""}`}>
                {error}
            </div>
            )}

            <div className='flex gap-3 items-center justify-center mt-6'>
                <button onClick={() => setActiveStep((prev) => prev - 1)} className='flex-1 items-center justify-center bg-white text-[#0F172B] py-2.5 rounded-lg font-medium text-sm border border-[#E2E8F0] hover:bg-[#f0f0f0] hover:cursor-pointer transition-colors duration-200'>
                    Back
                </button>
                <button type='submit' className='flex-2 items-center justify-center bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5] hover:cursor-pointer transition-colors duration-200'>
                    Complete Sign Up
                </button>
            </div>
        </form>
    );
  };

export default StudentAccountStep