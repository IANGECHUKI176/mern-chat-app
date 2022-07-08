import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { getSender, getSenderFullInfo } from "../../config/chatLogic";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const SingleChat = () => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const {
    fetchAgain,
    setFetchAgain,
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setLoading(false);
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error fetching messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim()) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        socket.emit("stop typing", selectedChat._id);
        const { data } = await axios.post(
          "http://localhost:5000/api/message/new",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((oldMessages) => [...oldMessages, data]);
      } catch (error) {
        toast({
          title: "Error sending message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      const createNewNotification = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            "http://localhost:5000/api/notification/new",
            { messageId: newMessageReceived._id },
            config
          );
          setNotifications([data, ...notifications]);
          setFetchAgain(!fetchAgain);
        } catch (error) {
          console.log("notification err");
        }
      };
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        createNewNotification()
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
        return () => {
          socket.off();
        };
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display={"flex"}
            alignItems='center'
            justifyContent={{ base: "space-between" }}
            pb={2}
            px={2}
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily='work sans'
            width='100%'
          >
            <IconButton
              icon={<ArrowBackIcon />}
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFullInfo(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}{" "}
                <UpdateGroupChatModal fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box
            bgColor='#E8E8E8'
            width='100%'
            height='90%'
            display={"flex"}
            flexDirection='column'
            justifyContent={"flex-end"}
            p='3'
            borderRadius={"lg"}
            overflowY='lg'
          >
            {loading ? (
              <Spinner width={20} height={20} margin='auto' />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl isRequired onKeyDown={sendMessage} mt={3}>
              {isTyping ? (
                <>
                  <Lottie
                    width={70}
                    height={10}
                    style={{ marginBottom: "10px", marginLeft: "0" }}
                    options={defaultOptions}
                  />
                </>
              ) : null}
              <Input
                placeholder='Enter a message...'
                bgColor={"#E0E0E0"}
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display='flex'
          justifyContent={"center"}
          alignItems='center'
          height='100%'
          width='100%'
        >
          <Text fontSize={"2xl"} fontFamily='work sans'>
            Click on User to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
