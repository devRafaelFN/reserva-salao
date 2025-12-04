import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ThemeToggleFloating from "./components/ThemeToggleFloating";
import { useContext } from "react";
import Reservas from "./pages/Reservas";
import Usuarios from "./pages/Usuarios";
import { ColorModeContext } from "./main";

function App() {
  const { mode, toggleColorMode } = useContext(ColorModeContext);

  return (
    <>
      <ThemeToggleFloating toggleColorMode={toggleColorMode} mode={mode} />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
