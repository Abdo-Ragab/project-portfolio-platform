import React, { useState, useMemo } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Star, CheckCircle, X, TrendingUp, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSearchParams, useNavigate } from 'react-router'
import { EMPLOYER_TABS, EMPLOYER_TABS_SECONDARY } from '../../data/tabs'
import { useAuth } from '../../context/AuthContext'
import { useInternships } from '../../context/InternshipsContext'

const getStatusColor = (status) => {
  switch (status) {
    case 'accepted': return 'bg-green-100 text-green-700'
    case 'nominated': return 'bg-blue-100 text-blue-700'
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const EmployerApplicants = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { internships, updateApplicantStatus } = useInternships()

  const myInternships = internships.filter(
    internship =>
      internship.employerId === user?.id ||
      internship.companyName === user?.companyName
  )

  // Get internship ID from URL params or default to first
  const urlInternshipId = searchParams.get('internshipId')
  const [selectedInternshipId, setSelectedInternshipId] = useState(
    urlInternshipId || myInternships[0]?.id || ''
  )
  const [applicantSortBy, setApplicantSortBy] = useState('contributors')

  const selectedInternship = myInternships.find(internship => internship.id === selectedInternshipId)

  const getSortedApplicants = (applicants) => {
    if (!applicants) return []
    const sorted = [...applicants]
    
    if (applicantSortBy === 'contributors') {
      sorted.sort((a, b) => (b.contributions || 0) - (a.contributions || 0))
    } else if (applicantSortBy === 'applied') {
      sorted.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    }
    
    return sorted
  }

  const getRecommendedApplicants = (applicants) => {
    if (!applicants) return []
    return applicants.filter(app => app.matchesFavorites)
  }

  const applicants = selectedInternship?.applicants || []
  const recommended = useMemo(() => getRecommendedApplicants(applicants), [applicants])
  const sorted = useMemo(() => getSortedApplicants(applicants), [applicants, applicantSortBy])

  const handleInternshipChange = (e) => {
    setSelectedInternshipId(e.target.value)
    setApplicantSortBy('contributors')
  }

  const handleStatusChange = (studentId, status) => {
    updateApplicantStatus(selectedInternship.id, studentId, status)
    toast.success(`Applicant status changed to ${status}`)
  }

  React.useEffect(() => {
    if (!selectedInternshipId && myInternships.length > 0) {
      setSelectedInternshipId(myInternships[0].id)
    }
  }, [myInternships, selectedInternshipId])

  return (
    <DashboardLayout tabs={EMPLOYER_TABS} secondaryTabs={EMPLOYER_TABS_SECONDARY}>
      <div className='p-6 space-y-6'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-[#0F172B]'>Internship Applicants</h1>
          <p className='text-sm text-[#62748E] mt-1'>
            Review, manage, and select applicants for your internship positions
          </p>
        </div>

        {/* Internship Selector */}
        <div className='bg-white border border-[#E2E8F0] rounded-xl p-5'>
          <label className='block text-sm font-medium text-[#0F172B] mb-2'>
            Select Internship
          </label>
          <select
            value={selectedInternshipId}
            onChange={handleInternshipChange}
            className='cursor-pointer w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#432DD7]'
          >
            {myInternships.length === 0 ? (
              <option disabled>No internships available</option>
            ) : (
              myInternships.map((internship) => (
                <option key={internship.id} value={internship.id}>
                  {internship.title} ({internship.applicants?.length || 0} applicants)
                </option>
              ))
            )}
          </select>
        </div>

        {selectedInternship ? (
          <>
            {/* Recommended Applicants Section */}
            {recommended.length > 0 && (
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <Star className='size-5 text-yellow-500' />
                  <h2 className='text-lg font-semibold text-[#0F172B]'>
                    Recommended Applications ({recommended.length})
                  </h2>
                  <span className='text-xs text-[#62748E]'>Based on your portfolio favorites</span>
                </div>

                <div className='space-y-3'>
                  {recommended.map((applicant) => (
                    <div key={applicant.studentId} className='bg-white border border-yellow-200 bg-yellow-50 rounded-xl p-5'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => navigate(`/portfolios/${applicant.studentId}`)}
                              className='font-semibold text-[#0F172B] hover:text-[#432DD7] cursor-pointer hover:underline transition-colors text-left'
                            >
                              {applicant.name}
                            </button>
                            <Star className='size-4 text-yellow-500 fill-yellow-500' />
                          </div>
                          <p className='text-sm text-[#62748E]'>{applicant.email}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(applicant.status)}`}>
                          {applicant.status}
                        </span>
                      </div>

                      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-yellow-200'>
                        <div>
                          <p className='text-xs text-[#62748E] mb-0.5'>Contributions</p>
                          <div className='flex items-center gap-1'>
                            <TrendingUp className='size-4 text-[#432DD7]' />
                            <span className='font-semibold text-[#0F172B]'>{applicant.contributions || 0}</span>
                          </div>
                        </div>
                        <div>
                          <p className='text-xs text-[#62748E] mb-0.5'>Applied</p>
                          <p className='font-medium text-[#0F172B] text-sm'>{applicant.appliedAt}</p>
                        </div>
                        <div className='md:col-span-2'>
                          <p className='text-xs text-[#62748E] mb-0.5'>Skills</p>
                          <p className='font-medium text-[#0F172B] truncate text-sm'>
                            {applicant.skills?.join(', ') || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {applicant.coverLetter && (
                        <div className='mb-4 p-3 bg-white rounded border border-yellow-100'>
                          <p className='text-xs font-medium text-[#62748E] mb-1'>Cover Letter</p>
                          <p className='text-sm text-[#45556C]'>{applicant.coverLetter}</p>
                        </div>
                      )}

                      <div className='flex gap-2 flex-wrap'>
                        {applicant.status !== 'accepted' && (
                          <button
                            onClick={() => handleStatusChange(applicant.studentId, 'accepted')}
                            className='cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors'
                          >
                            <CheckCircle className='size-3.5' />
                            Accept
                          </button>
                        )}
                        {applicant.status !== 'nominated' && (
                          <button
                            onClick={() => handleStatusChange(applicant.studentId, 'nominated')}
                            className='cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors'
                          >
                            <Star className='size-3.5' />
                            Nominate
                          </button>
                        )}
                        {applicant.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(applicant.studentId, 'rejected')}
                            className='cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors'
                          >
                            <X className='size-3.5' />
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Applicants Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold text-[#0F172B]'>
                  All Applications
                  <span className='ml-2 text-sm font-normal text-[#62748E]'>({sorted.length})</span>
                </h2>
                <select
                  value={applicantSortBy}
                  onChange={(e) => setApplicantSortBy(e.target.value)}
                  className='cursor-pointer text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#432DD7]'
                >
                  <option value='contributors'>Sort by: Top Contributors</option>
                  <option value='applied'>Sort by: Recently Applied</option>
                </select>
              </div>

              {applicants.length === 0 ? (
                <div className='bg-white border border-[#E2E8F0] rounded-xl p-12 text-center'>
                  <AlertCircle className='size-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-[#62748E]'>No applications yet for this internship</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {sorted.map((applicant) => (
                    <div key={applicant.studentId} className='bg-white border border-[#E2E8F0] rounded-xl p-5 hover:shadow-md transition-shadow'>
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() => navigate(`/portfolios/${applicant.studentId}`)}
                              className='font-semibold text-[#0F172B] hover:text-[#432DD7] cursor-pointer hover:underline transition-colors text-left'
                            >
                              {applicant.name}
                            </button>
                            {applicant.matchesFavorites && (
                              <Star className='size-4 text-yellow-500 fill-yellow-500' title='Matches your portfolio favorites' />
                            )}
                          </div>
                          <p className='text-sm text-[#62748E]'>{applicant.email}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${getStatusColor(applicant.status)}`}>
                          {applicant.status}
                        </span>
                      </div>

                      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-[#E2E8F0]'>
                        <div>
                          <p className='text-xs text-[#62748E] mb-0.5'>Contributions</p>
                          <p className='font-semibold text-[#0F172B] text-sm'>{applicant.contributions || 0}</p>
                        </div>
                        <div>
                          <p className='text-xs text-[#62748E] mb-0.5'>Applied</p>
                          <p className='font-medium text-[#0F172B] text-sm'>{applicant.appliedAt}</p>
                        </div>
                        <div className='md:col-span-2'>
                          <p className='text-xs text-[#62748E] mb-0.5'>Skills</p>
                          <p className='font-medium text-[#0F172B] truncate text-sm'>
                            {applicant.skills?.join(', ') || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {applicant.coverLetter && (
                        <div className='mb-4 p-3 bg-gray-50 rounded border border-[#E2E8F0]'>
                          <p className='text-xs font-medium text-[#62748E] mb-1'>Cover Letter</p>
                          <p className='text-sm text-[#45556C]'>{applicant.coverLetter}</p>
                        </div>
                      )}

                      <div className='flex gap-2 flex-wrap'>
                        {applicant.status !== 'accepted' && (
                          <button
                            onClick={() => handleStatusChange(applicant.studentId, 'accepted')}
                            className='cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors'
                          >
                            <CheckCircle className='size-3.5' />
                            Accept
                          </button>
                        )}
                        {applicant.status !== 'nominated' && (
                          <button
                            onClick={() => handleStatusChange(applicant.studentId, 'nominated')}
                            className='cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors'
                          >
                            <Star className='size-3.5' />
                            Nominate
                          </button>
                        )}
                        {applicant.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(applicant.studentId, 'rejected')}
                            className='cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors'
                          >
                            <X className='size-3.5' />
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='bg-white border border-[#E2E8F0] rounded-xl p-12 text-center'>
            <AlertCircle className='size-12 text-gray-300 mx-auto mb-3' />
            <p className='text-[#62748E]'>No internships available</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default EmployerApplicants