import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"
import type { Reserva } from "../types/reserva"
import { getReservas, createReserva, updateReserva } from "../services/reservaService"
import type { User } from "../types/user"
import { getUsers } from "../services/userService"

type Props = {
  open: boolean
  reserva?: Reserva | null
  onClose: () => void
  onSaved: () => void
  currentUserId?: number
}

export default function ReservaModal({ open, reserva, onClose, onSaved, currentUserId }: Props) {
  const [data, setData] = useState<string>("")
  const [horaInicio, setHoraInicio] = useState<string>("")
  const [horaFim, setHoraFim] = useState<string>("")
  const [observacao, setObservacao] = useState<string>("")
  const [userId, setUserId] = useState<number>(currentUserId ?? 0)
  const [users, setUsers] = useState<User[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const u = await getUsers()
        setUsers(u)
      } catch (e) {}
    })()
  }, [])

  useEffect(() => {
    if (reserva) {
      setData(reserva.data.substring(0, 10))
      setHoraInicio(reserva.horaInicio.substring(11, 16))
      setHoraFim(reserva.horaFim.substring(11, 16))
      setObservacao(reserva.observacao ?? "")
      setUserId(reserva.userId)
    } else {
      setData("")
      setHoraInicio("")
      setHoraFim("")
      setObservacao("")
      setUserId(currentUserId ?? 0)
    }
  }, [reserva, open, currentUserId])

  const toISO = (date: string, time: string) => {
    if (!date || !time) return ""
    return new Date(`${date}T${time}:00`).toISOString()
  }

  const overlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    return !(aEnd <= bStart || aStart >= bEnd)
  }

  const handleSave = async () => {
    if (!data || !horaInicio || !horaFim || !userId) {
      alert("Preencha data, horário e morador")
      return
    }
    const startISO = toISO(data, horaInicio)
    const endISO = toISO(data, horaFim)
    if (startISO >= endISO) {
      alert("Horário de início deve ser antes do horário de fim")
      return
    }
    setSaving(true)
    try {
      const reservasNoDia = await getReservas()
      const conflicts = reservasNoDia.filter((r) => r.data.substring(0, 10) === data && r.id !== reserva?.id)
        .some((r) => overlap(startISO, endISO, r.horaInicio, r.horaFim))
      if (conflicts) {
        alert("Conflito de horário com outra reserva")
        setSaving(false)
        return
      }
      const payload: Partial<Reserva> = {
        data: new Date(`${data}T00:00:00`).toISOString(),
        horaInicio: startISO,
        horaFim: endISO,
        observacao: observacao || null,
        userId,
        status: reserva?.status ?? "pendente",
      }
      if (reserva) {
        await updateReserva(reserva.id, payload)
      } else {
        await createReserva(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      alert("Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{reserva ? "Editar Reserva" : "Nova Reserva"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Hora Início" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} InputLabelProps={{ shrink: true }} />
          <TextField label="Hora Fim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth>
            <InputLabel id="select-morador">Morador</InputLabel>
            <Select labelId="select-morador" value={userId} label="Morador" onChange={(e) => setUserId(Number(e.target.value))}>
              {users.map((u) => <MenuItem key={u.id} value={u.id}>{u.nome} - Apt {u.apartamento}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} multiline rows={3} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
      </DialogActions>
    </Dialog>
  )
}
