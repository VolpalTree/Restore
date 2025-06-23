import { useState } from "react"
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const palleteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: (palleteType === 'light') ?  '#121212' : '#eaeaea'
      }
    }
  })

  
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <NavBar darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <Box sx={{
        minHeight: "100vh",
        background: darkMode 
          ?  'radial-gradient(circle, #1e3aBa, #111B27)'
          :  'radial-gradient(circle, #baecf9, #f0f9ff)',
        py: 6
      }}>
        <Container maxWidth="xl" sx={{marginTop: 8}}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>

  )
}

export default App
