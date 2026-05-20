import { createContext, useContext, useState } from "react"
import { internships as initialInternships } from "../data/internships"

const InternshipsContext = createContext()

export function InternshipsProvider({ children }) {
  const [internships, setInternships] = useState(initialInternships)

  const applyToInternship = (internshipId, userId, coverLetter) => {
    setInternships(prev => prev.map(int => {
      if (int.id !== internshipId) return int

      return {
        ...int,
        applicants: [
          ...int.applicants,
          {
            studentId: userId,
            coverLetter,
            status: "pending",
            appliedAt: new Date().toISOString().split("T")[0],
          },
        ],
      }
    }))
  }

  const withdrawApplication = (internshipId, userId) => {
    setInternships(prev => prev.map(int => {
      if (int.id !== internshipId) return int

      return {
        ...int,
        applicants: int.applicants.filter(a => a.studentId !== userId),
      }
    }))
  }

  const addInternship = (internship) => {
    setInternships(prev => [internship, ...prev])
  }

  const updateInternship = (id, updates) => {
    setInternships(prev =>
      prev.map(int => int.id === id ? { ...int, ...updates } : int)
    )
  }

  const deleteInternship = (id) => {
    setInternships(prev => prev.filter(int => int.id !== id))
  }

  const toggleArchiveInternship = (id) => {
    setInternships(prev =>
      prev.map(int =>
        int.id === id ? { ...int, isArchived: !int.isArchived } : int
      )
    )
  }

  const updateApplicantStatus = (internshipId, studentId, status) => {
    setInternships(prev =>
      prev.map(int =>
        int.id === internshipId
          ? {
              ...int,
              applicants: int.applicants.map(app =>
                app.studentId === studentId ? { ...app, status } : app
              ),
            }
          : int
      )
    )
  }

  return (
    <InternshipsContext.Provider
      value={{
        internships,
        applyToInternship,
        withdrawApplication,
        addInternship,
        updateInternship,
        deleteInternship,
        toggleArchiveInternship,
        updateApplicantStatus,
      }}
    >
      {children}
    </InternshipsContext.Provider>
  )
}

export const useInternships = () => useContext(InternshipsContext)