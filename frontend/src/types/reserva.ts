export type Reserva = {
  id: number
  data: string
  horaInicio: string
  horaFim: string
  observacao?: string | null
  status: "pendente" | "aprovado" | "cancelado"
  criadoEm: string
  atualizadoEm: string
  userId: number
  usuario?: User | null
}