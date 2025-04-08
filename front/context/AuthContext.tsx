"use client"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoggedIn: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logout: () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const name = localStorage.getItem("name")
    const email = localStorage.getItem("email")
    if (name && email) {
      setUser({ name, email })
    }
  }, [])

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)