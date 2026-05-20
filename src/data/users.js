import Fuse from "fuse.js";
import { courses } from "./courses";

// src/data/users.js
export const students = [
  {
    role: "student",                    // req 1
    id: "s1",
    firstName: "Ahmed",               // req 2
    lastName: "Hassan",               // req 2
    email: "ahmed.hassan@student.guc.edu.eg",  // req 1, 2
    password: "password123",          // req 1
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',                     // req 12
    major: "Computer Science",
    gpa: 3.8,
    classYear: "2026",
    location: "Cairo, Egypt",
    majorId: "m1",
    minor: "Applied Mathematics",
    expectedGraduation: "Spring 2026",
    skills: ["React", "Node.js", "Python", "TypeScript", "Express", "MongoDB", "REST APIs", "Git"],    // req 5, 48
    linkedin: "https://linkedin.com/in/ahmed",
    github: "https://github.com/ahmed",
    personalWebsite: "https://ahmed-hassan.dev",
    hackerrankProfile: "https://hackerrank.com/ahmed_hassan",
    resumeUrl: "https://ahmed-hassan.dev/resume.pdf",
    bio: "Passionate about full-stack development and building scalable web applications. Experienced in React, Node.js, and Python with a focus on backend architecture.",
    shortBio: "Full-stack developer focused on scalable web apps.",
    graduationYear: 2026,
    completedInternships: ["int1"],   // req 90
    likedProjectsIds: ["p2", "p4", "p6"],
    portfoliosIds: ["s2", "s3"],
    internshipExperiences: [
      {
        internshipId: "int1",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        description: "Built and maintained React components for the core product platform. Improved performance of data grids by 30% using virtualization techniques.",
      }
    ],
    isActive: true,                   // req 54
  },
  {
    role: "student",
    id: "s2",
    firstName: "Sara",
    lastName: "Mostafa",
    email: "sara.mostafa@student.guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    majorId: "m7",
    skills: ["UI/UX", "Figma", "CSS", "Wireframing", "Prototyping", "Design Systems", "Accessibility", "Adobe XD"],
    linkedin: "",
    bio: "Creative designer focused on user experience and interface design. Skilled in creating intuitive prototypes and design systems that users love.",
    shortBio: "UI/UX designer who builds clean, intuitive interfaces.",
    graduationYear: 2027,
    completedInternships: [],
    likedProjectsIds: ["p1", "p4"],
    portfoliosIds: ["s1", "s5"],
    isActive: true,
  },
  {
    role: "student",
    id: "s3",
    firstName: "Omar",
    lastName: "Ali",
    email: "omar.ali@student.guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    majorId: "m1",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "HTML", "CSS", "Git", "REST APIs"],
    linkedin: "",
    bio: "Full-stack developer with strong JavaScript fundamentals and a keen interest in modern web frameworks. Enjoys solving complex problems and optimizing performance.",
    shortBio: "JavaScript developer with a strong interest in modern web frameworks.",
    graduationYear: 2026,
    completedInternships: [],
    likedProjectsIds: ["p2", "p5"],
    portfoliosIds: ["s1", "s6"],
    isActive: true,
  },
  {
    role: "student",
    id: "s4",
    firstName: "Lina",
    lastName: "Adel",
    email: "lina.adel@student.guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
    majorId: "m2",
    skills: ["C++", "Embedded Systems", "MATLAB", "RTOS", "IoT", "Arduino", "Signal Processing", "Automotive Software"],
    linkedin: "https://linkedin.com/in/linaadel",
    bio: "Embedded systems engineer with expertise in low-level programming and automotive technology. Passionate about ADAS development and real-time systems.",
    shortBio: "Embedded systems student interested in automotive technology.",
    graduationYear: 2027,
    completedInternships: ["int2"],
    likedProjectsIds: ["p1", "p6"],
    portfoliosIds: ["s2", "s3"],
    isActive: true,
  },
  {
    role: "student",
    id: "s5",
    firstName: "Youssef",
    lastName: "Samir",
    email: "youssef.samir@student.guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    majorId: "m4",
    skills: ["SolidWorks", "CAD", "MATLAB", "Product Design", "3D Modeling", "Simulation", "Manufacturing", "Technical Drawing"],
    linkedin: "",
    bio: "Mechanical engineer interested in product design and CAD modeling. Combines engineering principles with modern software tools to create innovative solutions.",
    shortBio: "Mechanical engineering student focused on CAD and product design.",
    graduationYear: 2028,
    completedInternships: ["int4"],
    likedProjectsIds: ["p4", "p5"],
    portfoliosIds: ["s1", "s4"],
    isActive: true,
  },
  {
    role: "student",
    id: "s6",
    firstName: "Noor",
    lastName: "Walid",
    email: "noor.walid@student.guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/women/35.jpg',
    majorId: "m10",
    skills: ["SQL", "Python", "Power BI", "Data Analysis", "Excel", "Dashboarding", "Statistics", "Business Intelligence"],
    linkedin: "https://linkedin.com/in/noorwalid",
    bio: "Data-driven developer and business analyst passionate about turning raw data into actionable insights. Skilled in SQL, Python, and creating compelling dashboards.",
    shortBio: "Data analyst interested in dashboards and actionable insights.",
    graduationYear: 2027,
    completedInternships: [],
    likedProjectsIds: ["p2", "p6"],
    portfoliosIds: ["s3", "s5"],
    isActive: true,
  }
]

export const fuseStudents = new Fuse(students, {
  keys: ['firstName', 'lastName', 'email']
});

export const instructors = [
  {
    role: "instructor",
    id: "i1",
    firstName: "Sara",
    lastName: "Kamel",
    email: "sara.kamel@guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    title: "Associate Professor of Computer Science",
    bio: "Over 10 years of experience in software engineering research, project supervision, and mentoring student teams on scalable full-stack systems. She focuses on helping students connect strong engineering fundamentals with practical product thinking, especially when building maintainable applications that can grow over time. Her teaching style emphasizes clear architecture, teamwork, and turning ideas into reliable software.",
    researchInterests: ["AI", "Software Architecture"],
    education: [
      { degree: "BSc", field: "Computer Science", institution: "Cairo University", year: "2007" },
      { degree: "MSc", field: "Software Engineering", institution: "Ain Shams University", year: "2010" },
      { degree: "PhD", field: "Software Architecture", institution: "Cairo University", year: "2015" },
    ],
    linkedCourses: ["c3", "c5"],
    isActive: true,
  },
  {
    role: "instructor",
    id: "i2",
    firstName: "Omar",
    lastName: "Fathy",
    email: "omar.fathy@guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    bio: "Specializes in embedded systems, IoT applications, and device-level software architecture for automotive and industrial platforms. He works closely with students to build a solid understanding of how hardware and software interact in real products, from low-level communication to real-time constraints. His background makes him especially strong in guiding project work that needs both technical precision and practical implementation.",
    researchInterests: ["Embedded Systems", "IoT", "Real-Time Systems"],
    education: [
      { degree: "BSc", field: "Electrical Engineering", institution: "Cairo University", year: "2004" },
      { degree: "MSc", field: "Embedded Systems", institution: "TU Berlin", year: "2008" },
      { degree: "PhD", field: "Real-Time Systems", institution: "TU Berlin", year: "2012" },
    ],
    linkedCourses: ["c2", "c5"],
    isActive: true,
  },
  {
    role: "instructor",
    id: "i3",
    firstName: "Nadia",
    lastName: "Hassan",
    email: "nadia.hassan@guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
    bio: "Researcher in human-computer interaction and UX design, with a focus on accessibility, usability testing, and design systems for student-facing products. She helps students think beyond visuals and design interfaces that are easy to understand, inclusive, and grounded in real user needs. Her work combines research, empathy, and structured design methods to create experiences that feel thoughtful and polished.",
    researchInterests: ["HCI", "UX Research", "Accessibility"],
    education: [
      { degree: "BSc", field: "Computer Science", institution: "GUC", year: "2011" },
      { degree: "MSc", field: "Human-Computer Interaction", institution: "GUC", year: "2018" },
    ],
    linkedCourses: ["c4", "c5"],
    isActive: true,
  },
  {
    role: "instructor",
    id: "i4",
    firstName: "Khaled",
    lastName: "Mansour",
    email: "khaled.mansour@guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    bio: "Expert in algorithms, data structures, and competitive programming, with a strong emphasis on problem solving, optimization, and technical interview preparation. He encourages students to build disciplined reasoning habits and approach problems with clarity before jumping into implementation. His sessions typically focus on sharpening analytical thinking while showing how algorithmic choices affect performance in real systems.",
    researchInterests: ["Algorithms", "Graph Theory", "Machine Learning"],
    education: [
      { degree: "BSc", field: "Mathematics and Computer Science", institution: "MIT", year: "2002" },
      { degree: "MSc", field: "Algorithms and Theory", institution: "MIT", year: "2005" },
      { degree: "PhD", field: "Computer Science", institution: "MIT", year: "2010" },
    ],
    linkedCourses: ["c1", "c5"],
    isActive: true,
  },
  {
    role: "instructor",
    id: "i5",
    firstName: "Mai",
    lastName: "Nasser",
    email: "mai.nasser@guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
    bio: "Focuses on cloud computing, cybersecurity fundamentals, and secure software delivery for undergraduate project teams. She helps students understand how to design systems that are not only functional but also resilient, maintainable, and safe to deploy. Her guidance often connects theory with hands-on practices that prepare students for modern software engineering workflows.",
    researchInterests: ["Cybersecurity", "Cloud Computing", "Secure Development"],
    education: [
      { degree: "BSc", field: "Information Systems", institution: "AUC", year: "2011" },
      { degree: "MSc", field: "Cybersecurity", institution: "AUC", year: "2017" },
    ],
    linkedCourses: ["c1", "c3"],
    isActive: true,
  },
  {
    role: "instructor",
    id: "i6",
    firstName: "Tarek",
    lastName: "Youssef",
    email: "tarek.youssef@guc.edu.eg",
    password: "password123",
    avatar: 'https://randomuser.me/api/portraits/men/71.jpg',
    bio: "Teaches backend engineering, database design, and distributed systems with a practical approach to building reliable services. He places strong emphasis on clean data modeling, service reliability, and the tradeoffs involved in scaling applications. Students working with him learn how to design backend systems that are structured, efficient, and easier to evolve over time.",
    researchInterests: ["Databases", "Distributed Systems", "Backend Engineering"],
    education: [
      { degree: "BSc", field: "Computer Engineering", institution: "University of Manchester", year: "2007" },
      { degree: "MSc", field: "Distributed Systems", institution: "University of Manchester", year: "2010" },
      { degree: "PhD", field: "Databases", institution: "University of Manchester", year: "2014" },
    ],
    linkedCourses: ["c2", "c4"],
    isActive: true,
  },
]

const instructorsWithCourseNames = instructors.map(instructor => ({
  ...instructor,
  linkedCourses: instructor.linkedCourses.map(courseId => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : courseId;
  })
}));

export const fuseInstructors = new Fuse(instructorsWithCourseNames, {
  keys: ['firstName', 'lastName', 'linkedCourses']
});

export const employers = [
  {
    role: "employer",                   // req 1
    id: "e1",
    companyName: "TechCorp Egypt",    // req 3
    email: "hr@techcorp.eg",          // req 3 — external email, not GUC
    password: "password123",
    avatar: 'https://cloztalk.com/cdn/shop/collections/Tech_Corps_-_color_logo_400x.png',                       // req 12 — profile picture = company logo
    bio: "Leading software company building enterprise web platforms, internal tools, and graduate training opportunities for emerging engineers.", // req 10
    address: "Smart Village, Cairo",  // req 10
    contactInfo: "01000000000",       // req 10
    location: { lat: 30.0626, lng: 31.1993 }, // req 11
    documents: [
      { name: "company_registration.pdf", url: "/fake-docs/company_registration.pdf" },
      { name: "tax_certificate.pdf",      url: "/fake-docs/tax_certificate.pdf" },
    ],      // req 13
    likedProjectsIds: ["p1", "p5", "p_inv2"],
    portfoliosIds: ["s1", "s3"],
    isVerified: true,                 // req 18
    isActive: true,                   // req 54
  },
  {
    role: "employer",
    id: "e2",
    companyName: "Valeo",
    email: "careers@valeo.eg",
    password: "password123",
    avatar: 'https://iconlogovector.com/uploads/images/2024/12/sm-675a313d9cf45-Valeo.webp',
    bio: "Automotive technology company focusing on embedded software, driver assistance systems, and connected vehicle solutions.",
    address: "Smart Village, Cairo",
    contactInfo: "01011112222",
    location: { lat: 30.0634, lng: 31.1978 },
    documents: [
      { name: "company_registration.pdf", url: "/fake-docs/valeo_registration.pdf" },
      { name: "tax_certificate.pdf", url: "/fake-docs/valeo_tax.pdf" },
    ],
    likedProjectsIds: ["p4", "p6"],
    portfoliosIds: ["s4", "s5"],
    isVerified: true,
    isActive: true,
  },
  {
    role: "employer",
    id: "e3",
    companyName: "Google",
    email: "students@google.com",
    password: "password123",
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/960px-Google_%22G%22_logo.svg.png',
    bio: "Global technology company offering internships in infrastructure, product engineering, and data-driven software development.",
    address: "Remote / Cairo hub",
    contactInfo: "01022223333",
    location: { lat: 30.0444, lng: 31.2357 },
    documents: [
      { name: "company_registration.pdf", url: "/fake-docs/google_registration.pdf" },
      { name: "tax_certificate.pdf", url: "/fake-docs/google_tax.pdf" },
    ],
    likedProjectsIds: ["p2", "p3"],
    portfoliosIds: ["s2", "s6"],
    isVerified: true,
    isActive: true,
  },
  {
    role: "employer",
    id: "e4",
    companyName: "Microsoft",
    email: "careers@microsoft.com",
    password: "password123",
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/500px-Microsoft_logo.svg.png',
    bio: "Product engineering organization building cloud services, collaboration tools, and polished front-end experiences for enterprise users.",
    address: "Cairo Festival City",
    contactInfo: "01033334444",
    location: { lat: 30.0212, lng: 31.4359 },
    documents: [
      { name: "company_registration.pdf", url: "/fake-docs/microsoft_registration.pdf" },
      { name: "tax_certificate.pdf", url: "/fake-docs/microsoft_tax.pdf" },
    ],
    likedProjectsIds: ["p1", "p6", "p_inv1"],
    portfoliosIds: ["s1", "s4"],
    isVerified: true,
    isActive: true,
  },
  {
    role: "employer",
    id: "e5",
    companyName: "NileTech Labs",
    email: "jobs@niletechlabs.eg",
    password: "password123",
    avatar: 'https://niletech.com.et/assets/niletec-logo-ChsurPvq.jpeg',
    bio: "Data and product analytics lab that supports startups with reporting pipelines, dashboards, and experimentation platforms.",
    address: "New Cairo, Cairo",
    contactInfo: "01044445555",
    location: { lat: 30.0185, lng: 31.4904 },
    documents: [
      { name: "company_registration.pdf", url: "/fake-docs/niletechlabs_registration.pdf" },
      { name: "tax_certificate.pdf", url: "/fake-docs/niletechlabs_tax.pdf" },
    ],
    likedProjectsIds: ["p2", "p5"],
    portfoliosIds: ["s3", "s5"],
    isVerified: true,
    isActive: true,
  },
]

export const admins = [
  {
    role: "admin",                      // req 1
    id: "a1",
    email: "admin@guc.edu.eg",
    password: "admin123",
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',                       // req 12
    isActive: true,
  },
  {
    role: "admin",
    id: "a2",
    email: "moderator@guc.edu.eg",
    password: "admin123",
    avatar: 'https://ui-avatars.com/api/?name=Moderator&background=random',
    isActive: true,
  },
]