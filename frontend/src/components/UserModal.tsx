import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material"
import { createUser } from "../services/userService"
import type { User } from "../types/user"

type Props = {
  open: boolean
  onClose: () => void
  onSaved: () => void
  user?: User | null
}

export default function UserModal({ open, onClose, onSaved, user }: Props) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefone, setTelefone] = useState("")
  const [apartamento, setApartamento] = useState<number | string>("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) {
      setNome("")
      setEmail("")
      setPassword("")
      setTelefone("")
      setApartamento("")
      setSaving(false)
    }
  }, [open])

  useEffect(() => {
    // Se um usuário foi passado, preencher campos para edição
    if (open && user) {
      setNome(user.nome || "")
      setEmail(user.email || "")
      setTelefone(user.telefone || "")
      setApartamento(user.apartamento ?? "")
      setPassword("")
    }
  }, [open, user])

  const handleSave = async () => {
    if (!nome || !email || !telefone || !apartamento) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    setSaving(true)
    try {
      const payload = {
        nome,
        email,
        password: password || undefined,
        telefone,
        apartamento: Number(apartamento)
      }

      if (user && user.id) {
        // editar
        await (await import("../services/userService")).updateUser(user.id, payload)
      } else {
        // criar
        await createUser(payload)
      }
      onSaved()
      onClose()
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Erro ao criar usuário')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Novo Morador</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Senha (opcional)" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth />
          <TextField label="Apartamento" value={apartamento} onChange={(e) => setApartamento(e.target.value)} type="number" fullWidth />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
      </DialogActions>
    </Dialog>
  )
}
