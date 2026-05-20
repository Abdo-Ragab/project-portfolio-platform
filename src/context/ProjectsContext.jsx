import { createContext, useContext, useState } from "react"
import { projects as initialProjects } from "../data/projects"

const ProjectsContext = createContext()

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(initialProjects)

  const addProject    = (project)         => setProjects(prev => [project, ...prev])
  const updateProject = (id, updates)     => setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  const deleteProject = (id)              => setProjects(prev => prev.filter(p => p.id !== id))

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export const useProjects = () => useContext(ProjectsContext)
