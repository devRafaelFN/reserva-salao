import axios from "axios"
import type { User } from "../types/user"

// Backend API base — a API local roda em http://localhost:3000 e os endpoints são montados em /api
const API_BASE = "http://localhost:3000/api"

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>(`${API_BASE}/users`)
  return res.data
}

export const getUser = async (id: number): Promise<User> => {
  const res = await axios.get<User>(`${API_BASE}/users/${id}`)
  return res.data
}

export const createUser = async (payload: { nome: string; email: string; password?: string; telefone: string; apartamento: number }) => {
  const res = await axios.post<User>(`${API_BASE}/users`, payload)
  return res.data
}

export const updateUser = async (id: number, payload: { nome?: string; email?: string; password?: string; telefone?: string; apartamento?: number }) => {
  const res = await axios.put<User>(`${API_BASE}/users/${id}`, payload)
  return res.data
}

export const deleteUser = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/users/${id}`)
  return res.data
}

export default { getUsers, getUser, createUser }
