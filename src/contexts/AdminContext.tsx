'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface AdminContextType {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const login = (password: string) => {
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'portfolio2024'
    if (password === adminPass) {
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => setIsAdmin(false)

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
