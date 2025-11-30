import type { Reserva } from "../types/reserva"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  Box,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckIcon from "@mui/icons-material/Check"

type Props = {
  reservas: Reserva[]
  onEdit: (r: Reserva) => void
  onDelete: (id: number) => void
  onApprove: (id: number) => void
  currentUserId?: number
}

export default function ReservasTable({ 
  reservas, 
  onEdit, 
  onDelete, 
  onApprove 
}: Omit<Props, 'currentUserId'>) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {["Data", "Horário", "Morador", "Apartamento", "Status", "Ações"].map(h => (
              <TableCell key={h} align="center">{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {reservas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center"><Typography>Nenhuma reserva</Typography></TableCell>
            </TableRow>
          ) : reservas.map(r => (
            <TableRow key={r.id} hover>
              <TableCell align="center">{r.data.substring(0,10)}</TableCell>
              <TableCell align="center">{r.horaInicio.substring(11,16)} - {r.horaFim.substring(11,16)}</TableCell>
              <TableCell align="center">{r.usuario?.nome ?? "-"}</TableCell>
              <TableCell align="center">{r.usuario?.apartamento ?? "-"}</TableCell>
              <TableCell align="center">{r.status}</TableCell>
              <TableCell align="center">
                <Box display="flex" justifyContent="center" gap={1}>
                  <Tooltip title="Editar"><IconButton size="small" onClick={() => onEdit(r)}><EditIcon /></IconButton></Tooltip>
                  <Tooltip title="Remover"><IconButton size="small" onClick={() => onDelete(r.id)}><DeleteIcon /></IconButton></Tooltip>
                  {r.status !== "aprovado" && <Tooltip title="Aprovar"><IconButton size="small" onClick={() => onApprove(r.id)}><CheckIcon /></IconButton></Tooltip>}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
