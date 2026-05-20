import React, { useState, useRef, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import toast from 'react-hot-toast'
import { MapPin, Edit2, Trash2 } from 'lucide-react'
import { EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'

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

const EmployerProfile = () => {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef(null)

  const [avatarUrl, setAvatarUrl] = React.useState(user?.avatar || 'https://via.placeholder.com/112')
  const [biography, setBiography] = React.useState(
    user?.bio || 'TechCorp Egypt is a software company interested in hiring talented GUC students for technical internships.'
  )
  const [address, setAddress] = React.useState(user?.address || 'Smart Village, Cairo, Egypt')
  const [contactInfo, setContactInfo] = React.useState(user?.contactInfo || 'hr@techcorp.eg')
  const [googleMapsLocation, setGoogleMapsLocation] = React.useState(
    user?.googleMapsLocation || 'https://maps.google.com/?q=Smart+Village+Cairo'
  )
  const [documents, setDocuments] = React.useState(user?.documents || ['tax-certificate.pdf', 'business-license.pdf'])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const changed = 
      avatarUrl !== (user?.avatar || '') ||
      biography !== (user?.bio || '') ||
      address !== (user?.address || 'Smart Village, Cairo, Egypt') ||
      contactInfo !== (user?.contactInfo || user?.email || 'hr@techcorp.eg') ||
      googleMapsLocation !== (user?.googleMapsLocation || '')
    setHasChanges(changed)
  }, [avatarUrl, biography, address, contactInfo, googleMapsLocation, user])

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

  const handleSave = (e) => {
    e.preventDefault()

    const updatedProfile = {
      avatar: avatarUrl,
      bio: biography,
      address: address,
      contactInfo: contactInfo,
      googleMapsLocation: googleMapsLocation,
      documents: documents,
    }

    updateUser(updatedProfile)
    toast.success('Company profile updated successfully')
  }

  const handleClearInfo = () => {
    setAvatarUrl('https://via.placeholder.com/112')
    setBiography('')
    setAddress('')
    setContactInfo('')
    setGoogleMapsLocation('')

    toast.success('Company information cleared')
  }

  return (
    <DashboardLayout tabs={EMPLOYER_TABS} secondaryTabs={EMPLOYER_TABS_SECONDARY}>
      <div className='p-8 mx-10'>

        {/* Page heading with Save button */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', lineHeight: '32px' }}>
              Company Profile
            </h1>
            <p style={{ fontSize: 14, color: '#6A7282', marginTop: 4 }}>
              Manage your company information, location, and verification documents.
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={handleClearInfo}
              className='cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2'
              style={{
                background:   '#FEE2E2',
                borderRadius: 6,
                padding:      '8px 16px',
                fontSize:     14,
                fontWeight:   500,
                color:        '#DC2626',
              }}
            >
              <Trash2 className='w-4 h-4' />
              Clear Info
            </button>
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
        </div>

        {/* Identity card */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Identity</p>

          <div className='flex items-start gap-5 mb-6'>
            {/* Profile Picture */}
            <div className='relative flex-shrink-0'>
              <img
                src={avatarUrl}
                alt='Company Logo'
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

            {/* Company Name and Email */}
            <div className='flex-1'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <div
                    className='w-full px-4 py-2'
                    style={{ ...inputStyle, background: '#F9FAFB', border: '0.667px solid #E2E8F0', color: '#6A7282' }}
                  >
                    {user?.companyName || 'TechCorp Egypt'}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Company Email</label>
                  <div
                    className='w-full px-4 py-2'
                    style={{ ...inputStyle, background: '#F9FAFB', border: '0.667px solid #E2E8F0', color: '#6A7282' }}
                  >
                    {user?.email || 'hr@techcorp.eg'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Biography</p>
          <label style={labelStyle}>Company Biography</label>
          <textarea
            value={biography}
            onChange={e => setBiography(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder='Tell about your company and what you offer…'
            className={`${inputCls} resize-none`}
            style={inputStyle}
          />
          <p style={{ fontSize: 12, color: '#6A7282', marginTop: 4, textAlign: 'right' }}>
            {biography.length}/500
          </p>
        </div>

        {/* Contact Information */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Contact Information</p>
          <div className='flex flex-col gap-4'>
            <div>
              <label style={labelStyle}>Address</label>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Contact Phone/Info</label>
              <input
                type='text'
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle} className='flex items-center gap-1'>
                <MapPin className='size-4' />
                Google Maps Location
              </label>
              <input
                type='text'
                value={googleMapsLocation}
                onChange={(e) => setGoogleMapsLocation(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
              {googleMapsLocation && (
                <a href={googleMapsLocation} target='_blank' rel='noreferrer' className='text-sm text-[#432DD7] hover:underline mt-2 inline-block'>
                  Open Location in Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div style={cardStyle}>
          <p style={sectionHeadStyle}>Documents</p>
          {documents && documents.length > 0 ? (
            <div>
              <div className='space-y-2 mb-4'>
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className='flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-8 h-8 bg-blue-100 rounded-md'>
                        <span style={{ fontSize: 14, color: '#432DD7', fontWeight: 600 }}>PDF</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 500 }}>
                          {typeof doc === 'object' ? doc.name : doc}
                        </p>
                        <p style={{ fontSize: 12, color: '#6A7282' }}>Verified document</p>
                      </div>
                    </div>
                    {typeof doc === 'object' && doc.url && (
                      <a
                        href={doc.url}
                        target='_blank'
                        rel='noreferrer'
                        className='px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-100 transition-colors'
                      >
                        View
                      </a>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#6A7282' }}>
                No additional documents can be uploaded at this time.
              </p>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#6A7282' }}>No documents on file.</p>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default EmployerProfile