import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Box, Button, Container, useColorMode } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/others/SideDrawer";
import MyChats from "../components/others/MyChats";
import ChatBox from "../components/others/ChatBox";
const Chat = () => {
 
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer user={user} />}
      <Box
        display='flex'
        justifyContent={"space-between"}
        width='100%'
        height='91vh'
        p='10px'
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chat;
