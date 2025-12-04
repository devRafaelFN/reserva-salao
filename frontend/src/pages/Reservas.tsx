import React, { useEffect, useState } from "react"
import { Box, Paper, Typography, Button, Tabs, Tab, TextField, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReservasTable from "../components/ReservasTable"
import ReservaModal from "../components/ReservaModal"
import ReservasCalendar from "../components/ReservasCalendar"
import type { Reserva } from "../types/reserva"
import { getReservas, deleteReserva, approveReserva } from "../services/reservaService"
import { getUsers } from "../services/userService"
import type { User } from "../types/user"

export default function Reservas() {
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroApto, setFiltroApto] = useState<number | "todos">("todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reserva | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [snack, setSnack] = useState<{open:boolean; msg:string; severity:"success"|"error"}>({open:false,msg:"",severity:"success"})
  const [searchQuery, setSearchQuery] = useState<string>("")

  const carregar = async () => {
    try {
      const r = await getReservas()
      setReservas(r.sort((a,b) => a.horaInicio.localeCompare(b.horaInicio)))
    } catch (e) {
      setSnack({open:true,msg:"Erro ao carregar reservas",severity:"error"})
    }
  }

  useEffect(() => {
    (async () => {
      await carregar()
      const u = await getUsers()
      setUsers(u)
    })()
  }, [])

  const aplicarFiltros = () => {
    const q = searchQuery.trim().toLowerCase();
    return reservas
      .filter(r => (filtroStatus === "todos" ? true : r.status === filtroStatus || (filtroStatus === 'confirmada' && r.status === 'aprovado')))
      .filter(r => (filtroApto === "todos" ? true : r.usuario?.apartamento === filtroApto))
      .filter(r => (q === "" ? true : (r.usuario?.nome || "").toLowerCase().includes(q)))
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteReserva(id)
      setReservas(prev => prev.filter(p => p.id !== id))
      setSnack({open:true,msg:"Reserva removida",severity:"success"})
    } catch (e) {
      setSnack({open:true,msg:"Erro ao remover",severity:"error"})
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await approveReserva(id)
      await carregar()
      setSnack({open:true,msg:"Reserva aprovada",severity:"success"})
    } catch (e) {
      setSnack({open:true,msg:"Erro ao aprovar",severity:"error"})
    }
  }

  return (
    <Box p={3} display="flex" justifyContent="center" bgcolor="background.default" minHeight="100vh">
      <Box width="100%" maxWidth={1100}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box className="app-hero" display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Voltar</Button>
              <Typography variant="h6">Gestão de Reservas - Salão de Festas</Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Button variant="contained" onClick={() => { setEditing(null); setModalOpen(true) }}>Nova Reserva</Button>
            </Box>
          </Box>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
            <Tab label="Lista" />
            <Tab label="Calendário" />
            <Tab label="Admin" />
          </Tabs>

          {tab === 0 && (
            <Box mt={2}>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, mb: 2 }}>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select labelId="status-label" value={filtroStatus} label="Status" onChange={(e) => setFiltroStatus(String(e.target.value))}>
                      <MenuItem value="todos">Todos</MenuItem>
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="confirmada">Aprovado</MenuItem>
                      <MenuItem value="cancelado">Cancelado</MenuItem>
                      <MenuItem value="finalizada">Finalizada</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl fullWidth>
                    <InputLabel id="apto-label">Apartamento</InputLabel>
                    <Select labelId="apto-label" value={filtroApto} label="Apartamento" onChange={(e) => setFiltroApto(e.target.value === "todos" ? "todos" : Number(e.target.value))}>
                      <MenuItem value="todos">Todos</MenuItem>
                      {Array.from(new Set(users.map(u => u.apartamento))).map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <TextField fullWidth label="Pesquisar morador" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </Box>
              </Box>

              <ReservasTable reservas={aplicarFiltros()} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={handleDelete} onApprove={handleApprove} />
            </Box>
          )}

          {tab === 1 && (
            <Box mt={2}>
              <ReservasCalendar reservas={reservas} onDayClick={(iso) => { const dayRes = reservas.filter(r => r.data.substring(0,10) === iso); if (dayRes.length) { setEditing(dayRes[0]); setModalOpen(true) } else { setEditing(null); setModalOpen(true); } }} />
            </Box>
          )}

          {tab === 2 && (
            <Box mt={2}>
              <Typography variant="subtitle1" mb={1}>Painel Admin</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>Aprovar reservas pendentes.</Typography>
              <ReservasTable reservas={reservas.filter(r => r.status === "pendente")} onEdit={(r) => { setEditing(r); setModalOpen(true) }} onDelete={handleDelete} onApprove={handleApprove} />
            </Box>
          )}
        </Paper>

        <ReservaModal open={modalOpen} reserva={editing} onClose={() => setModalOpen(false)} onSaved={() => { setModalOpen(false); carregar() }} currentUserId={undefined} />

        <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>{snack.msg}</Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
