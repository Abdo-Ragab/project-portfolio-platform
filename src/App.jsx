import React from "react"
import { Navigate, Route, Routes, useLocation } from "react-router"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ProjectsProvider } from "./context/ProjectsContext"
import { InternshipsProvider } from "./context/InternshipsContext"
import toast, { Toaster } from "react-hot-toast"

import HomePage from "./pages/shared/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import NotFoundPage from "./pages/shared/NotFoundPage";

import ProjectDetailsPage from "./pages/shared/ProjectDetailsPage";
import PortfoliosDetailsPage from "./pages/shared/PortfoliosDetailsPage";
import InstructorDetailsPage from "./pages/shared/InstructorDetailsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import EmployerVerification from "./pages/admin/EmployerVerification";
import CourseManagement from "./pages/admin/CourseManagement";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentPortfolioPage from "./pages/student/StudentPortfolioPage";
import StudentProjectsPage from "./pages/student/StudentProjectsPage";
import StudentProjectDetailPage from "./pages/student/StudentProjectDetailPage";
import StudentInternshipsPage from "./pages/student/StudentInternshipsPage";
import StudentInternshipDetailPage from "./pages/student/StudentInternshipDetailPage";
import StudentApplicationsPage from "./pages/student/StudentApplicationsPage";
import StudentStatisticsPage from "./pages/student/StudentStatisticsPage";
import StudentInvitationsPage from "./pages/student/StudentInvitationsPage";
import ProjectsPage from "./pages/shared/ProjectsPage";
import PortfoliosPage from "./pages/shared/PortfoliosPage";
import InstructorsPage from "./pages/shared/InstructorsPage";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerProfile from "./pages/Employer/EmployerProfile";
import EmployerInternships from "./pages/Employer/EmployerInternships";
import EmployerApplicants from "./pages/Employer/EmployerApplicants";
import Notifications from "./pages/shared/Notifications";
import FavoritesPage from "./pages/shared/FavoritesPage";
import AdminStatistics from "./pages/admin/AdminStatistics";
import FlaggedProjects from "./pages/admin/FlaggedProjects";
import CourseLinks from "./pages/admin/CourseLinks";
import StudentAppeals from "./pages/admin/StudentAppeals";
import MessagesPage from "./pages/shared/MessagesPage";

import InstructorDashboard      from "./pages/Instructor/InstructorDashboard";
import InstructorStatistics     from "./pages/Instructor/InstructorStatistics";
import InstructorProfileEdit    from "./pages/Instructor/InstructorProfileEdit";
import InstructorCoursesPage    from "./pages/Instructor/InstructorCoursesPage";
import InstructorProjectsPage   from "./pages/Instructor/InstructorProjectsPage";
import InstructorInvitationsPage from "./pages/Instructor/InstructorInvitationsPage";
import Moderation from "./pages/admin/Moderation"

// A wrapper that checks if the user is logged in
function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" state={{ message: "You must be logged in to access this page." }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" state={{ message: "You are not authorized to access this page." }} replace />
  }

  return children
}

function RouteToastListener() {
  const location = useLocation()

  React.useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message)
    }
  }, [location.state])

  return null
}

const App = () => {
  return (
    <AuthProvider>
      <ProjectsProvider>
      <InternshipsProvider>
      <Toaster position="bottom-right" />
        <RouteToastListener />
      <Routes>
        {/* Shared */}
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/projects" element={
            <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
              <ProjectsPage />
            </ProtectedRoute>
          } />

        <Route path="/portfolios" element={
            <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
              <PortfoliosPage />
            </ProtectedRoute>
          } />

        <Route path="/instructors" element={
            <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
              <InstructorsPage />
            </ProtectedRoute>
          } />

        <Route path="/projects/:id" element={
          <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
            <ProjectDetailsPage />
          </ProtectedRoute>
        } />

        <Route path="/portfolios/:id" element={
          <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
            <PortfoliosDetailsPage />
          </ProtectedRoute>
        } />

        <Route path="/instructors/:id" element={
          <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
            <InstructorDetailsPage />
          </ProtectedRoute>
        } />

        <Route path="/favorites" element={
          <ProtectedRoute allowedRoles={["student", "employer"]}>
            <FavoritesPage />
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
            <MessagesPage />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={["student", "employer", "instructor", "admin"]}>
              <Notifications />
            </ProtectedRoute>
          } />

        {/* Student */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/portfolio" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentPortfolioPage />
          </ProtectedRoute>
        } />
        <Route path="/student/projects" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/student/projects/:id" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProjectDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/student/internships" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentInternshipsPage />
          </ProtectedRoute>
        } />
        <Route path="/student/internships/:id" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentInternshipDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/student/applications" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentApplicationsPage />
          </ProtectedRoute>
        } />
        <Route path="/student/statistics" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentStatisticsPage />
          </ProtectedRoute>
        } />
        <Route path="/student/invitations" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentInvitationsPage />
          </ProtectedRoute>
        } />

        {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UserManagement />
          </ProtectedRoute>
          } />
          <Route path="/admin/employers" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EmployerVerification />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CourseManagement />
            </ProtectedRoute>
          } />
         
          <Route path="/admin/statistics" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminStatistics />
            </ProtectedRoute>
          } />
          <Route path="/admin/flagged" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FlaggedProjects />
            </ProtectedRoute>
          } />
          <Route path="/admin/coursesLinks" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CourseLinks />
            </ProtectedRoute>
          } />
          <Route path="/admin/appeals" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentAppeals />
            </ProtectedRoute>
          } />

          {/* Employer */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/employer/profile" element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerProfile />
            </ProtectedRoute>
          } />

          <Route path="/employer/internships" element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerInternships />
            </ProtectedRoute>
          } />
          <Route path="/employer/applicants" element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <EmployerApplicants />
            </ProtectedRoute>
          } />

        {/* Instructor */}
        <Route path="/instructor/dashboard" element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/instructor/statistics" element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorStatistics />
          </ProtectedRoute>
        } />
        <Route path="/instructor/profile" element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorProfileEdit />
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses" element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorCoursesPage />
          </ProtectedRoute>
        } />
        <Route path="/instructor/projects" element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorProjectsPage />
          </ProtectedRoute>
        } />
        <Route path="/instructor/invitations" element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorInvitationsPage />
          </ProtectedRoute>
        } />
          </Routes>
        </InternshipsProvider>
      </ProjectsProvider>
    </AuthProvider>
  )
}

export default App;