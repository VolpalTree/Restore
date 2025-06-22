import { useEffect, useState } from "react"
import type { Product } from "../model/product";
import Catalog from "../../feaatures/catalog/Catalog";
import { Box, Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import NavBar from "./NavBar";

function App() {
  const[products, setProducts] = useState<Product[]>([]);
  const darkMode = true;
  const palleteType = darkMode ? 'dark' : 'light'
  const theme = createTheme({
    palette: {
      mode: palleteType,
      background: {
        default: (palleteType === 'light') ?  '#121212' : '#eaeaea'
      }
    }
  })

  useEffect(() => {
    fetch("https://localhost:5001/api/products")
      .then(response => response.json())
      .then(data => setProducts(data))
  }, [])
  
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <NavBar />
      <Box sx={{
        minHeight: "100vh",
        background: darkMode 
          ?  'radial-gradient(circle, #1e3aBa, #111B27)'
          :  'radial-gradient(circle, #baecf9, #f0f9ff)',
        py: 6
      }}>
        <Container maxWidth="xl" sx={{marginTop: 8}}>
          <Catalog products={products}/>
        </Container>
      </Box>
    </ThemeProvider>

  )
}

export default App
