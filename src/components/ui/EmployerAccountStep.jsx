import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router'
import { FileText, Upload, X } from 'lucide-react'
import { employers } from '../../data/users'

const EmployerAccountStep = ({ setActiveStep }) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = React.useRef(null)

  const [companyName, setCompanyName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [documents, setDocuments] = React.useState([])
  const [error, setError] = React.useState(null)
  const [shake, setShake] = React.useState(false)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const combined = [...documents, ...files]

    if (combined.length > 3) {
      setError('Maximum 3 PDF documents allowed')
      setShake(true)
      return
    }

    const nonPdfFile = files.find(file => file.type !== 'application/pdf')

    if (nonPdfFile) {
      setError('Only PDF documents are allowed')
      setShake(true)
      return
    }

    const newDocs = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setDocuments(prev => [...prev, ...newDocs])
    setError(null)
  }

  const handleRegister = (e) => {
    e.preventDefault()

    if (!companyName || !email || !password || !confirmPassword || documents.length === 0) {
      setError('Please fill in all fields and upload at least one PDF document.')
      setShake(true)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setShake(true)
      return
    }

    const newEmployer = {
      role: 'employer',
      id: `e${employers.length + 1}`,
      companyName,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${companyName}&background=random`,
      bio: '',
      address: '',
      contactInfo: email,
      location: { lat: 30.0626, lng: 31.1993 },
      documents,
      likedProjectsIds: [],
      portfoliosIds: [],
      isVerified: false,
      isActive: true,
    }

    employers.push(newEmployer)
    login(newEmployer)
    navigate('/employer/dashboard')
  }

  return (
    <form onSubmit={handleRegister} className='flex flex-col'>
      <label className='text-sm font-medium text-[#314158] mt-4 mb-1'>
        Company Name
      </label>

      <input
        type='text'
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder='Company Name'
        className='w-full px-3 py-3 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20'
        required
      />

      <label className='text-sm font-medium text-[#314158] mt-4 mb-1'>
        Company Email
      </label>

      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Company Email'
        className='w-full px-3 py-3 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20'
        required
      />

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
            className='w-full px-3 py-3 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20'
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
            className='w-full px-3 py-3 rounded-lg text-sm border border-gray-200 outline-none focus:border-[#432DD7] focus:ring-2 focus:ring-[#432DD7]/20'
            required
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='application/pdf'
        multiple
        onChange={handleFileChange}
        className='hidden'
      />

      {documents.length > 0 && (
        <div className='flex flex-col gap-2 mt-4'>
          {documents.map((doc, index) => (
            <div key={index} className='flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3'>
              <div className='flex items-center gap-3'>
                <FileText className='w-5 h-5 text-[#432DD7]' />
                <p className='text-sm font-medium text-gray-700'>{doc.name}</p>
              </div>

              <button type='button' onClick={() => setDocuments(prev => prev.filter((_, i) => i !== index))} className='text-gray-400 hover:text-red-500'>
                <X className='w-4 h-4' />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => documents.length < 3 && fileInputRef.current.click()}
        className={`flex gap-4 items-center justify-center text-center mt-4 border-2 border-dashed bg-surface border-gray-200 rounded-2xl p-4 hover:bg-[#432DD7]/5 transition-all duration-200 ${
          documents.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#432DD7]'
        }`}
      >
        <Upload className='w-6 h-6 text-[#7C86FF]' />

        <div className='flex flex-col items-start text-start w-full gap-1 text-[#432DD7]'>
          <p className='text-sm font-medium text-[#0F172B]'>
            Click to upload company verification documents
          </p>
          <p className='text-xs text-[#62748E]'>PDF only - Maximum 3 files</p>
        </div>
      </div>

      {error && (
        <div onAnimationEnd={() => setShake(false)} className={`bg-red-50 border border-red-200 text-red-600 text-sm mt-4 px-4 py-3 rounded-lg ${shake ? 'animate-[wiggle_0.25s]' : ''}`}>
          {error}
        </div>
      )}

      <div className='flex gap-3 items-center justify-center mt-6'>
        <button type='button' onClick={() => setActiveStep(prev => prev - 1)} className='flex-1 bg-white text-[#0F172B] py-2.5 rounded-lg font-medium text-sm border border-[#E2E8F0] hover:bg-[#f0f0f0]'>
          Back
        </button>

        <button type='submit' className='flex flex-2 items-center justify-center bg-[#432DD7] text-white py-2.5 rounded-lg font-medium text-sm hover:bg-[#3524b5]'>
          Submit Application
        </button>
      </div>

      <p className='text-xs text-[#62748E] text-center mt-6'>
        Your account will be under review. <br />Our admin team will verify and get back to you within 24-48 hours.
      </p>
    </form>
  )
}

export default EmployerAccountStep