import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = ChatState();
  return (
    <Box
      width={{ base: "100%", md: "68%" }}
      borderWidth={"1px"}
      alignItems="center"
      flexDirection={"column"}
      borderRadius='lg'
      marginLeft={5}
      p={3}
      display={{ base: selectedChat ? "flex" : "none",md:"flex" }}
      bgColor='white'
    >
      <SingleChat/>
    </Box>
  );
};

export default ChatBox;
