import React from "react";
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

//App.jsx
import App from "./App"
import "./styles/App.css"

const theme = extendTheme({
  colors: {
    primary: "#1B1C1D",
    secondary: "#333333",
    background: "#E2E8F0",
    form: "#FFFFFF",
    fontColor: "#3F444E",
    buttonColor: "#0987A0"
  },
  components: {
    Drawer: {
      variant: {
        first: {
          second: {
            dialog: {
              maxW: "500px",
            }
          }
        }
      }
    }
  }
});


const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
)