import { createContext, useContext, useState, useCallback } from "react"
import toast from "react-hot-toast"
import { admins, employers, instructors, students } from "../data/users"

const AuthContext = createContext()

export const DEMO_USERS = {
  student: students[0],
  instructor: instructors[0],
  employer: employers[0],
  admin: admins[0],
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (user) => {
    toast.success(`Logged in successfully`)
    setUser(user)
    return user
  }

  const logout = () => {
    toast.success("Logged out successfully")
    return setUser(null)
  }

  const updateUser = useCallback((updates) => setUser(prev => ({ ...prev, ...updates })), [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)