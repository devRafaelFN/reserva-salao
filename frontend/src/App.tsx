import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Home from "./components/Home"
import ThemeToggleFloating from "./components/ThemeToggleFloating"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import { useState } from "react"
import Reservas from "./pages/Reservas"
import Usuarios from "./pages/Usuarios"

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light")
  const theme = createTheme({ palette: { mode } })
  const toggleColorMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"))

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeToggleFloating toggleColorMode={toggleColorMode} mode={mode} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
