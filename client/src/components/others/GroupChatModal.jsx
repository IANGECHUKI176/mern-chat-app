import {
  Box,
  Button,
  FormControl,
  FormErrorIcon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedusers, setSelectedusers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats, user } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user/all?search=${query}`,
        config
      );
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occurred",
        description: "Failed to load search results",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedusers) {
      toast({
        title: "Please fill in all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group",
        {
          name:groupChatName,
          users:JSON.stringify(selectedusers.map((u)=>u._id))
        },
        config
      );
      setChats((oldChats)=>[data,...oldChats])
      onClose()
    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };
  const handleGroup = async (userToAdd) => {
    if (selectedusers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedusers((oldArray) => [...oldArray, userToAdd]);
  };
  const deleteUser = (user) => {
    setSelectedusers(selectedusers.filter((u) => u._id !== user._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily={"work sans"}
            fontSize='30px'
            display={"flex"}
            justifyContent='center'
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            alignItems='center'
            flexDirection={"column"}
          >
            <FormControl>
              <Input
                placeholder='Chat Name'
                marginBottom={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder='Add users e.g Ian ,John,Ombogo'
                marginBottom={4}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display='flex' alignItems='center'>
              {selectedusers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleDelete={() => deleteUser(user)}
                />
              ))}
            </Box>
            {loading ? (
              <>
                <Spinner />
              </>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    user={user}
                    key={user._id}
                    handleClick={() => handleGroup(user)}
                    group
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
