import { Button } from "@chakra-ui/react";
import "./App.css"
import { useState } from "react";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/chats' element={<Chat/>} />
      </Routes>
    </div>
  );
}

export default App;
