# Project Portfolio Platform

A React-based front-end prototype for a student project portfolio platform. The platform allows students to showcase course projects and bachelor projects through structured project pages containing descriptions, demo links, GitHub repositories, videos, theses, and research materials.

Developed for the Software Engineering course at the German University in Cairo.

---

## Overview

The Project Portfolio Platform is designed as a centralized space where GUC students can present their academic and technical work in a professional way.

Instead of sharing projects across scattered tools such as GitHub, Google Drive, LinkedIn, and deployment links, the platform brings all project information together in one organized portfolio system.

The platform serves students, instructors, employers, and administrators.

---

## Main Features

- User registration and login
- Student portfolio creation and management
- Project creation and submission
- Course project and bachelor project support
- Collaborator assignment
- Instructor and supervisor assignment
- Feedback and review workflow
- Project visibility control
- Public project discovery
- Portfolio search and filtering
- Project search and filtering
- Employer browsing experience
- Notifications
- Dummy data simulation without a backend

---

## User Roles

The system supports multiple user roles:

- Students
- Project collaborators
- Course instructors
- Bachelor project supervisors
- Employers / recruiters
- Administrators

---

## Core Modules

### Authentication & User Management

- Register and log in users
- Manage student profiles
- Create and update portfolios
- Handle role-based access

### Project Management

- Create academic projects
- Add project descriptions
- Add GitHub repository links
- Add live demo links
- Add demo video links
- Upload or reference thesis and research materials
- Assign collaborators and instructors
- Manage feedback and reviews
- Control project visibility

### Discovery & Exploration

- Browse public projects
- Search projects by title, course, type, or technology
- Filter portfolios by student, skill, course, or project category
- View complete project details in one place

---

## Milestones

### Milestone 1: Requirements Engineering

Milestone 1 focused on analyzing the problem scenario and documenting:

- Functional requirements
- Non-functional requirements
- User stories
- Stakeholders
- Requirement dependencies

### Milestone 2: Front-End Prototype

Milestone 2 focuses on building a React front-end prototype using hard-coded dummy data to simulate system behavior without a backend or database.

### Assignment: Design Patterns

The assignment focuses on modeling the full system using a class diagram and applying suitable software design patterns.

---

## Technologies Used

- React
- JavaScript
- HTML
- CSS
- Git
- GitHub

---

## Project Structure

```text
project-portfolio-platform/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── data/
│   ├── App.jsx
│   └── main.jsx
│
├── docs/
│   ├── requirements/
│   └── diagrams/
│
├── package.json
├── README.md
└── LICENSE
```

---

## Getting Started

### Prerequisites

Make sure you have Node.js installed.

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

Then open the local development link shown in the terminal.

---

## Dummy Data

This project does not use a backend or database.

All data is hard-coded to simulate:

- Users
- Projects
- Portfolios
- Courses
- Instructors
- Employers
- Feedback
- Notifications

---

## Example User Journeys

### Student

A student can create a portfolio, add academic projects, include project descriptions, attach demo links, and control whether a project is public or private.

### Instructor

An instructor can review submitted projects, provide feedback, and monitor student project progress.

### Employer

An employer can browse public student portfolios, view project details, watch demos, and discover students with relevant skills.

### Administrator

An administrator can manage users, courses, project categories, and platform-level data.

---

## UI/UX Goals

The interface is designed to be:

- Intuitive
- Responsive
- Consistent
- Easy to navigate
- Professional-looking
- Suitable for academic and employer-facing use

---

## Future Improvements

Potential future improvements include:

- Backend integration
- Database support
- Real authentication
- Role-based permissions
- File upload support
- Messaging system
- Employer contact workflow
- Advanced search and recommendation system
- Analytics for portfolio views

---

## License

This project is licensed under the MIT License.

---

## Authors

Team Members

- Abdelrahman Ragab
- Khalid Hamdy
- Mohamed Mahmoud
- Abdelrahman Kaheel
- Mariam Tahan
