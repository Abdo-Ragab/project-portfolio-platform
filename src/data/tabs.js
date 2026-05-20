import {
  BarChart2,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  FileText,
  FolderKanban,
  Heart,
  LayoutDashboard,
  Link,
  Mail,
  MessageSquare,
  Newspaper,
  ShieldAlert,
  UserCircle,
  Users,
} from 'lucide-react'

export const STUDENT_TABS = [
  { to: '/student/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/student/statistics',    label: 'Statistics',      icon: BarChart2 },
  { to: '/student/portfolio',     label: 'My Portfolio',    icon: Newspaper },
  { to: '/student/projects',      label: 'My Projects',     icon: FolderKanban },
  { to: '/favorites',     label: 'Favorites',       icon: Heart },
]

export const STUDENT_TABS_SECONDARY = [
  { to: '/student/applications',   label: 'My Applications', icon: Briefcase },
  { to: '/student/invitations',    label: 'Invitations',     icon: ClipboardList },
]

// Employer tabs to be used across all employer pages
export const EMPLOYER_TABS = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employer/profile', label: 'Company Profile', icon: Building2 },
  { to: '/favorites',     label: 'Favorites',       icon: Heart },
]

export const EMPLOYER_TABS_SECONDARY = [
  { to: '/employer/internships', label: 'Internships', icon: FileText },
  { to: '/employer/applicants', label: 'Applicants', icon: Users },
]

export const ADMIN_TABS = [
  { to: '/admin/dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/admin/statistics',  label: 'Statistics',    icon: BarChart2 },
  { to: '/admin/users',       label: 'Manage Users',  icon: Users },
]

export const ADMIN_TABS_SECONDARY = [
  { to: '/admin/employers',   label: 'Employer Approvals', icon: FileText },
  { to: '/admin/courses',     label: 'Course Management',       icon: BookOpen },
  { to: '/admin/coursesLinks',label: 'Course Links',       icon: Link },
  { to: '/admin/appeals',     label: 'Student Appeals',    icon: MessageSquare },
  { to: '/admin/flagged',     label: 'Flagged Projects',   icon: ShieldAlert },
]

// Instructor tabs to be used across all instructor pages
export const INSTRUCTOR_TABS = [
  {to: '/instructor/dashboard',   label: 'Dashboard',         icon: LayoutDashboard },
  {to: '/instructor/statistics',  label: 'Statistics',        icon: BarChart2       },
  {to: '/instructor/profile',     label: 'My Profile',        icon: UserCircle      },
  {to: '/instructor/courses',     label: 'My Courses',        icon: BookOpen        },
]

export const INSTRUCTOR_TABS_SECONDARY = [
  {to: '/instructor/projects',    label: 'Assigned Projects', icon: FolderKanban    },
  {to: '/instructor/invitations', label: 'Invitations',       icon: Mail            },
]