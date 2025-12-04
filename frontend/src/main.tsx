import { StrictMode, useMemo, useState, createContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import App from "./App.tsx";

type ColorMode = "light" | "dark";

interface ColorModeContextValue {
  mode: ColorMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextValue>({
  mode: "light",
  toggleColorMode: () => {},
});

function Root() {
  const getInitialMode = (): ColorMode => {
    try {
      const stored = localStorage.getItem("color-mode");
      if (stored === "light" || stored === "dark") return stored;
    } catch (e) {
      // ignore
    }
    return "light";
  };

  const [mode, setMode] = useState<ColorMode>(getInitialMode);

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("color-mode", next);
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0066ff" },
          secondary: { main: "#00bfa6" },
          background: {
            default: mode === "light" ? "#f6f9fc" : "#0b1220",
            paper: mode === "light" ? "#ffffff" : "#0f1724",
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: "Inter, Poppins, system-ui, Arial",
          h4: { fontWeight: 600 },
          h6: { fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              contained: { boxShadow: "none", textTransform: "none" },
            },
          },
          MuiPaper: {
            styleOverrides: { root: { borderRadius: 12 } },
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    // Aplicar background e cor do body para sobrepor CSS estático
    if (mode === "light") {
      document.body.style.background = "linear-gradient(180deg, #f7fbff 0%, #f0f6ff 50%, #f6f9fc 100%)";
      document.body.style.color = "#213547";
    } else {
      document.body.style.background = "#071124"; // tom escuro neutro
      document.body.style.color = "#e6eef8";
    }
    document.body.style.transition = "background 200ms ease, color 200ms ease";
  }, [mode]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);