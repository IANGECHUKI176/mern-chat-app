import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {BrowserRouter} from 'react-router-dom'
import theme from "./theme";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
);
