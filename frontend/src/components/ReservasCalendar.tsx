import React, { useMemo, useState } from "react"
import { Box, Paper, Typography, IconButton } from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import type { Reserva } from "../types/reserva"

type Props = {
  reservas: Reserva[]
  onDayClick: (dateISO: string) => void
}

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const firstWeekday = (year: number, month: number) => new Date(year, month, 1).getDay()

export default function ReservasCalendar({ reservas, onDayClick }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthName = useMemo(() => new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" }), [year, month])

  const days = useMemo(() => {
    const total = daysInMonth(year, month)
    const first = firstWeekday(year, month)
    const arr: Array<{ day: number; dateISO: string; reservas: Reserva[] }> = []
    for (let i = 1; i <= total; i++) {
      const date = new Date(year, month, i)
      const iso = date.toISOString().substring(0,10)
      const r = reservas.filter(s => s.data.substring(0,10) === iso)
      arr.push({ day: i, dateISO: iso, reservas: r })
    }
    return { first, arr }
  }, [year, month, reservas])

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1) } else setMonth(m => m-1) }} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
        <Typography variant="h6">{monthName}</Typography>
        <IconButton onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1) } else setMonth(m => m+1) }} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
        {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d => <Box key={d} textAlign="center" fontWeight={600}>{d}</Box>)}
        {Array.from({ length: days.first }).map((_, i) => <Box key={`pad-${i}`} />)}
        {days.arr.map(cell => (
          <Box key={cell.dateISO} onClick={() => onDayClick(cell.dateISO)} sx={{ minHeight: 80, border: "1px solid rgba(0,0,0,0.08)", p: 1, cursor: "pointer" }}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" fontWeight={600}>{cell.day}</Typography>
              <Typography variant="caption">{cell.reservas.length}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={0.5}>
              {cell.reservas.slice(0,2).map(r => (
                <Box key={r.id} sx={{ bgcolor: r.status === "aprovado" ? "rgba(76,175,80,0.12)" : r.status === "pendente" ? "rgba(255,193,7,0.12)" : "rgba(244,67,54,0.08)", borderRadius: 0.5, px: 0.5 }}>
                  <Typography variant="caption" noWrap>{r.horaInicio.substring(11,16)} {r.usuario?.nome}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
