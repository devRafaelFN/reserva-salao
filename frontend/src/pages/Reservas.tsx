import React, { useEffect, useState } from "react"
import { Box, Paper, Typography, Button, Tabs, Tab, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Snackbar, Alert } from "@mui/material"
import ReservasTable from "../components/ReservasTable"
import ReservaModal from "../components/ReservaModal"
import ReservasCalendar from "../components/ReservasCalendar"
import type { Reserva } from "../types/reserva"
import { getReservas, deleteReserva, approveReserva } from "../services/reservaService"
import { getUsers } from "../services/userService"
import type { User } from "../types/user"
import EditIcon from "@mui/icons-material/Edit"

export default function Reservas() {
  const [tab, setTab] = useState(0)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroApto, setFiltroApto] = useState<number | "todos">("todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Reserva | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [snack, setSnack] = useState<{open:boolean; msg:string; severity:"success"|"error"}>({open:false,msg:"",severity:"success"})

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
    return reservas.filter(r => (filtroStatus === "todos" ? true : r.status === filtroStatus))
      .filter(r => (filtroApto === "todos" ? true : r.usuario?.apartamento === filtroApto))
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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Gestão de Reservas - Salão de Festas</Typography>
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
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select labelId="status-label" value={filtroStatus} label="Status" onChange={(e) => setFiltroStatus(String(e.target.value))}>
                      <MenuItem value="todos">Todos</MenuItem>
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="aprovado">Aprovado</MenuItem>
                      <MenuItem value="cancelado">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="apto-label">Apartamento</InputLabel>
                    <Select labelId="apto-label" value={filtroApto} label="Apartamento" onChange={(e) => setFiltroApto(e.target.value === "todos" ? "todos" : Number(e.target.value))}>
                      <MenuItem value="todos">Todos</MenuItem>
                      {Array.from(new Set(users.map(u => u.apartamento))).map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Pesquisar morador" onChange={(e) => { const q = e.target.value.toLowerCase(); setReservas(prev => prev.map(x => x)) ; setReservas(prev => prev.filter(r => r.usuario?.nome.toLowerCase().includes(q) || !q)) }} />
                </Grid>
              </Grid>

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
