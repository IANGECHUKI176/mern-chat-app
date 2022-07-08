import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/chatLogic";
import GroupChatModal from "./GroupChatModal";
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { selectedChat, setSelectedChat, chats, setChats, user,fetchAgain,setNotifications } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed loading chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const fetchNotifications = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:5000/api/notification/all",
          config
        );
      
        setNotifications(data);
  };
  useEffect(() => {
    fetchChats();
    fetchNotifications()
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection='column'
      alignItems={"center"}
      p={3}
      bgColor={"white"}
      borderWidth={"5px"}
      borderRadius='lg'
      width={{ base: "100%", md: "31%" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "22px", md: "25px" }}
        fontFamily='work sans'
        display='flex'
        alignItems={"center"}
        justifyContent='space-between'
        width='100%'
      >
        <Text>My Chats</Text>
        <GroupChatModal>
          <Button
            rightIcon={<AddIcon />}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        borderRadius='lg'
        height='90%'
        width='100%'
        p={3}
        bgColor='#f8f8f8'
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (
              <Box
                px={3}
                py={2}
                cursor='pointer'
                key={chat._id}
                borderRadius='lg'
                bgColor={selectedChat?._id === chat._id ? "#38b2ac" : "#e8e8e8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                onClick={() => setSelectedChat(chat)}
              >
                <Text>
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(loggedUser, chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
