import { createContext, useContext, useState } from "react"
import { User } from "../types/user"
import { useApi } from "./useApi"

type AuthContextType = {
  user: User | null
  login: (email: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null)
  const api = useApi()

  const login = async (email: string) => {
    const data = await api.login(email)
    setUser(data)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
