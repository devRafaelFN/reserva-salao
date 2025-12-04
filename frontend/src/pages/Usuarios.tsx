import React, { useEffect, useState } from "react"
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UserModal from "../components/UserModal"
import { getUsers } from "../services/userService"
import type { User } from "../types/user"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

export default function Usuarios() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    (async () => {
      const u = await getUsers()
      setUsers(u)
    })()
  }, [])

  return (
    <Box p={3} display="flex" justifyContent="center">
      <Box width="100%" maxWidth={900}>
        <Paper sx={{ p: 2 }}>
          <Box className="app-hero" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Voltar</Button>
              <Typography variant="h6">Moradores</Typography>
            </Box>
            <Button variant="contained" onClick={() => { setSelectedUser(null); setOpenCreate(true); }}>Novo Morador</Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                {["Nome", "Email", "Telefone", "Apartamento", "Ações"].map(h => <TableCell key={h} align="center">{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell align="center">{u.nome}</TableCell>
                  <TableCell align="center">{u.email}</TableCell>
                  <TableCell align="center">{u.telefone}</TableCell>
                  <TableCell align="center">{u.apartamento}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => { setSelectedUser(u); setOpenCreate(true); }} aria-label="Editar usuário"><EditIcon /></IconButton>
                    <IconButton size="small" onClick={async () => {
                      if (!confirm(`Confirma remoção do usuário ${u.nome}?`)) return;
                      try {
                        await (await import("../services/userService")).deleteUser(u.id)
                        const ulist = await getUsers()
                        setUsers(ulist)
                      } catch (e: any) {
                        alert(e?.response?.data?.message || 'Erro ao excluir usuário')
                      }
                    }} aria-label="Excluir usuário"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <UserModal open={openCreate} user={selectedUser} onClose={() => { setOpenCreate(false); setSelectedUser(null); }} onSaved={async () => {
            const u = await getUsers()
            setUsers(u)
            setSelectedUser(null)
          }} />
        </Paper>
      </Box>
    </Box>
  )
}
