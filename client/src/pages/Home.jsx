import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Register from "../components/Authentication/Register";
import { ChatContext, ChatState } from "../Context/ChatProvider";

const Home = () => {
  const {user}=useContext(ChatContext)
  const navigate=useNavigate()
  if(user){
    navigate("/chats")
  }

  return (
    <Container maxW='xl' centerContent>
      <Box
        display='flex'
        justifyContent='center'
        padding={3}
        bgColor='white'
        borderRadius='lg'
        borderWidth='1px'
        margin='20px 0 15px 0'
        w='100%'
      >
        <Text color='black' fontSize={"4xl"} fontFamily='Work Sans'>
          Talk A Tive
        </Text>
      </Box>
      <Box
        bg='white'
        w='100%'
        borderRadius={"xl"}
        borderWidth='1px'
        color='black'
      >
        <Tabs variant='soft-rounded'>
          <TabList mb='1em'>
            <Tab w='50%'>Login</Tab>
            <Tab w='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
