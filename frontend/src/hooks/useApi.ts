import { api } from "../services/api"
import { Reserva } from "../types/reserva"
import { User } from "../types/user"

export const useApi = () => ({
  login: async (email: string) => {
    const response = await api.post("/login", { email })
    return response.data
  },
  listarReservas: async () => {
    const response = await api.get("/reservas")
    return response.data as Reserva[]
  },
  criarReserva: async (data: Reserva) => {
    const response = await api.post("/reservas", data)
    return response.data
  },
  atualizarReserva: async (id: number, data: Partial<Reserva>) => {
    const response = await api.put(`/reservas/${id}`, data)
    return response.data
  },
  deletarReserva: async (id: number) => {
    const response = await api.delete(`/reservas/${id}`)
    return response.data
  },
  listarUsuarios: async () => {
    const response = await api.get("/users")
    return response.data as User[]
  }
})
