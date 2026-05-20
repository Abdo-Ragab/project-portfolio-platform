import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { INSTRUCTOR_TABS, INSTRUCTOR_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { instructors } from '../../data/users'
import toast from 'react-hot-toast'
import { Plus, Trash2, GraduationCap, BookOpen, User, Edit2 } from 'lucide-react'

const inputCls =
  'w-full px-4 py-2 bg-white text-[#1B2A4A] placeholder-[rgba(27,42,74,0.5)] ' +
  'border border-[#E2E8F0] outline-none transition-all duration-150 ' +
  'focus:border-[#432DD7] focus:ring-2 focus:ring-[rgba(67,45,215,0.1)]'

const inputStyle = { borderRadius: 6, fontSize: 14 }

const labelStyle = {
  fontSize:   12,
  fontWeight: 600,
  color:      '#6A7282',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  marginBottom: 6,
  display: 'block',
}

const cardStyle = {
  background:   '#FFFFFF',
  border:       '0.667px solid #E2E8F0',
  borderRadius: 8,
  padding:      24,
  marginBottom: 16,
}

const sectionHeadStyle = {
  fontSize:   18,
  fontWeight: 600,
  color:      '#1B2A4A',
  lineHeight: '28px',
  marginBottom: 16,
}

const InstructorProfileEdit = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [bio,               setBio]               = useState(user.bio ?? '')
  const [avatarUrl,         setAvatarUrl]         = useState(user.avatar ?? '')
  const [researchInterests, setResearchInterests] = useState([...(user.researchInterests ?? [])])
  const [newInterest,       setNewInterest]       = useState('')
  const [education,         setEducation]         = useState(
    (user.education ?? []).map((e, i) => ({ ...e, _key: i }))
  )
  const [hasChanges, setHasChanges] = useState(false)

  // Track changes to any field
  useEffect(() => {
    const changed = 
      avatarUrl !== (user.avatar ?? '') ||
      bio !== (user.bio ?? '') ||
      JSON.stringify(researchInterests) !== JSON.stringify(user.researchInterests ?? []) ||
      JSON.stringify(education.map(({ _key, ...rest }) => rest)) !== JSON.stringify(user.education ?? [])
    setHasChanges(changed)
  }, [avatarUrl, bio, researchInterests, education, user])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const addInterest = () => {
    const trimmed = newInterest.trim()
    if (!trimmed) return
    if (researchInterests.includes(trimmed)) { toast.error('Already added'); return }
    setResearchInterests(prev => [...prev, trimmed])
    setNewInterest('')
  }

  const removeInterest = (interest) =>
    setResearchInterests(prev => prev.filter(i => i !== interest))

  const addEducation = () =>
    setEducation(prev => [...prev, { degree: '', institution: '', year: '', _key: Date.now() }])

  const updateEducation = (key, field, value) =>
    setEducation(prev => prev.map(e => e._key === key ? { ...e, [field]: value } : e))

  const removeEducation = (key) =>
    setEducation(prev => prev.filter(e => e._key !== key))

  const handleSave = () => {
    for (const edu of education) {
      if (!edu.degree.trim() || !edu.institution.trim() || !edu.year.trim()) {
        toast.error('Please fill in all education fields or remove incomplete entries.')
        return
      }
    }
    const idx = instructors.findIndex(i => i.id === user.id)
    if (idx !== -1) {
      const clean = education.map(({ _key, ...rest }) => rest)
      const updatedProfile = {
        bio,
        avatar:            avatarUrl || instructors[idx].avatar,
        researchInterests: [...researchInterests],
        education:         clean,
      }
      instructors[idx] = {
        ...instructors[idx],
        ...updatedProfile,
      }
      // Update AuthContext to keep user data in sync
      updateUser(updatedProfile)
      toast.success('Profile updated!')
      navigate(`/instructors/${user.id}`)
    }
  }

  return (
    <DashboardLayout tabs={INSTRUCTOR_TABS} secondaryTabs={INSTRUCTOR_TABS_SECONDARY}>
      <div className='p-8 mx-10'>

        {/* Page heading with Save button */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
              My Profile
            </h1>
            <p style={{ fontSize: 14, color: '#6A7282', marginTop: 4 }}>
              Update your public profile information.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className='cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            style={{
              background:   hasChanges ? '#432DD7' : '#CCC',
              borderRadius: 6,
              padding:      '8px 24px',
              fontSize:     14,
              fontWeight:   500,
              color:        '#FFFFFF',
            }}
          >
            Save Changes
          </button>
        </div>

        {/* Identity card */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Identity</p>

          <div className='flex items-start gap-5 mb-6'>
            {/* Profile Picture */}
            <div className='relative flex-shrink-0'>
              <img
                src={avatarUrl || user.avatar}
                alt='Profile'
                className='object-cover'
                style={{
                  width:        112,
                  height:       112,
                  borderRadius: '50%',
                  border:       '4px solid #FFFFFF',
                  boxShadow:    '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)',
                }}
              />
              <button
                onClick={handleProfilePictureClick}
                className='absolute flex items-center justify-center hover:opacity-80 transition-opacity'
                style={{
                  bottom:       -4,
                  right:        -4,
                  width:        28,
                  height:       28,
                  background:   '#432DD7',
                  borderRadius: '50%',
                  border:       '2px solid white',
                  cursor:       'pointer',
                }}
              >
                <Edit2 className='w-3 h-3 text-white' />
              </button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Name and Email */}
            <div className='flex-1'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <div
                    className='w-full px-4 py-2'
                    style={{ ...inputStyle, background: '#F9FAFB', border: '0.667px solid #E2E8F0', color: '#6A7282' }}
                  >
                    {user.firstName}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <div
                    className='w-full px-4 py-2'
                    style={{ ...inputStyle, background: '#F9FAFB', border: '0.667px solid #E2E8F0', color: '#6A7282' }}
                  >
                    {user.lastName}
                  </div>
                </div>
                <div className='col-span-2'>
                  <label style={labelStyle}>GUC Email</label>
                  <div
                    className='w-full px-4 py-2'
                    style={{ ...inputStyle, background: '#F9FAFB', border: '0.667px solid #E2E8F0', color: '#6A7282' }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Biography</p>
          <label style={labelStyle}>Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder='Tell students and employers a little about yourself…'
            className={`${inputCls} resize-none`}
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: '#6A7282', marginTop: 4, textAlign: 'right' }}>
            {bio.length}/500
          </p>
        </div>

        {/* Research Interests */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Research Interests</p>
          <div className='flex gap-2 mb-4'>
            <input
              type='text'
              value={newInterest}
              onChange={e => setNewInterest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder='e.g. Machine Learning'
              className={`${inputCls} flex-1`}
              style={inputStyle}
            />
            <button
              onClick={addInterest}
              className='flex items-center gap-1.5 text-white cursor-pointer hover:opacity-90 transition-opacity'
              style={{
                background:   '#432DD7',
                borderRadius: 6,
                padding:      '8px 16px',
                fontSize:     14,
                fontWeight:   500,
              }}
            >
              <Plus className='w-4 h-4' /> Add
            </button>
          </div>

          {researchInterests.length === 0 ? (
            <p style={{ fontSize: 14, color: '#6A7282' }}>No interests added yet.</p>
          ) : (
            <div className='flex flex-wrap gap-2'>
              {researchInterests.map(interest => (
                <span
                  key={interest}
                  className='flex items-center gap-1.5'
                  style={{
                    background:   'rgba(0,180,166,0.1)',
                    borderRadius: '9999px',
                    padding:      '4px 10px',
                    fontSize:     12,
                    fontWeight:   500,
                    color:        '#00B4A6',
                  }}
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className='cursor-pointer leading-none hover:text-red-400 transition-colors'
                    style={{ color: '#00B4A6' }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Education Timeline */}
        <div style={cardStyle}>
          <div className='flex items-center justify-between mb-4'>
            <p style={sectionHeadStyle}>Education Timeline</p>
            <button
              onClick={addEducation}
              className='flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity'
              style={{
                background:   '#432DD7',
                borderRadius: 6,
                padding:      '6px 12px',
                fontSize:     12,
                fontWeight:   500,
                color:        '#FFFFFF',
              }}
            >
              <Plus className='w-3.5 h-3.5' /> Add Entry
            </button>
          </div>

          {education.length === 0 && (
            <p style={{ fontSize: 14, color: '#6A7282' }}>No education entries yet.</p>
          )}

          {/* Timeline list */}
          <div
            className='flex flex-col gap-6'
            style={{ borderLeft: '0.667px solid #E5E7EB', paddingLeft: 24, marginLeft: 6 }}
          >
            {education.map(edu => (
              <div key={edu._key} className='relative'>
                {/* Timeline dot */}
                <div
                  className='absolute'
                  style={{
                    width:        12,
                    height:       12,
                    left:         -30,
                    top:          4,
                    background:   '#FFFFFF',
                    border:       '2px solid #432DD7',
                    borderRadius: '50%',
                  }}
                />
                <div className='grid grid-cols-3 gap-3'>
                  <div>
                    <label style={labelStyle}>Degree</label>
                    <input
                      type='text'
                      value={edu.degree}
                      onChange={e => updateEducation(edu._key, 'degree', e.target.value)}
                      placeholder='e.g. Ph.D.'
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Institution</label>
                    <input
                      type='text'
                      value={edu.institution}
                      onChange={e => updateEducation(edu._key, 'institution', e.target.value)}
                      placeholder='e.g. Cairo University'
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Year</label>
                    <input
                      type='text'
                      value={edu.year}
                      onChange={e => updateEducation(edu._key, 'year', e.target.value)}
                      placeholder='e.g. 2015'
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
                {edu.institution && (
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#432DD7', marginTop: 4 }}>
                    {edu.institution}
                  </p>
                )}
                <button
                  onClick={() => removeEducation(edu._key)}
                  className='flex items-center gap-1 mt-2 cursor-pointer transition-colors'
                  style={{ fontSize: 12, color: '#EF4444' }}
                >
                  <Trash2 className='w-3.5 h-3.5' /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default InstructorProfileEdit