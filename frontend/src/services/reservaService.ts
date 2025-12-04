import axios from "axios"
import type { Reserva } from "../types/reserva"

const API_BASE = "http://localhost:3000/api"

export const getReservas = async (): Promise<Reserva[]> => {
  const res = await axios.get<Reserva[]>(`${API_BASE}/reservas?_expand=usuario`)
  return res.data
}

export const getReservasByDate = async (dateISO: string): Promise<Reserva[]> => {
  const res = await axios.get<Reserva[]>(`${API_BASE}/reservas?data=${dateISO}&_expand=usuario`)
  return res.data
}

export const createReserva = async (dados: Partial<Reserva>): Promise<Reserva> => {
  const res = await axios.post<Reserva>(`${API_BASE}/reservas`, dados)
  return res.data
}

export const updateReserva = async (id: number, dados: Partial<Reserva>): Promise<Reserva> => {
  const res = await axios.put<Reserva>(`${API_BASE}/reservas/${id}`, dados)
  return res.data
}

export const deleteReserva = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/reservas/${id}`)
}

export const approveReserva = async (id: number): Promise<Reserva> => {

  const res = await axios.put<Reserva>(`${API_BASE}/reservas/${id}`, { status: "confirmada" })
  return res.data
}

export default {
  getReservas,
  getReservasByDate,
  createReserva,
  updateReserva,
  deleteReserva,
  approveReserva,
}
