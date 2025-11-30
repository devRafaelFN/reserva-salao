import axios from "axios"
import type { User } from "../types/user"

const API_BASE = "http://localhost:3333"

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>(`${API_BASE}/users`)
  return res.data
}

export const getUser = async (id: number): Promise<User> => {
  const res = await axios.get<User>(`${API_BASE}/users/${id}`)
  return res.data
}

export default { getUsers, getUser }
