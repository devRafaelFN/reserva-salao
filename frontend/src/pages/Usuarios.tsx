import React, { useEffect, useState } from "react"
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button } from "@mui/material"
import { getUsers } from "../services/userService"
import type { User } from "../types/user"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([])

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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Moradores</Typography>
            <Button variant="contained">Novo Morador</Button>
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
                    <IconButton size="small"><EditIcon /></IconButton>
                    <IconButton size="small"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  )
}
