import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";
const UpdateGroupChatModal = ({fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { fetchAgain, setFetchAgain, selectedChat, user, setSelectedChat } =
    ChatState();
  const handleRemove = async(removeUser) => {
    if(selectedChat.groupAdmin._id !== user._id && removeUser._id !== user._id){
         toast({
           title: "Only admin can remove someone",
           status: "warning",
           duration: 5000,
           position: "top-left",
           isClosable: true,
         });
         return;
    }
    try {
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('http://localhost:5000/api/chat/groupremove',
        {
          chatId:selectedChat._id,
          userId:removeUser._id
        },
        config
        )
        toast({
          title: "User removed successfully",
          status: "success",
          duration: 5000,
          position: "top-left",
          isClosable: true,
        });
        removeUser._id === user._id? setSelectedChat(null):setSelectedChat(data)
        fetchMessages()
        setFetchAgain(!fetchAgain)
        setLoading(false)
    } catch (error) {
            toast({
           title: "Error occured",
           status: "warning",
           duration: 5000,
           position: "top-left",
           isClosable: true,
         });
         setLoading(false)
    }
  };
  const handleAdduser = async (addUser) => {
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      toast({
        title: "user is already in group",
        status: "warning",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users to group",
        status: "warning",
        duration: 5000,
        position: "top-left",
        isClosable: true,
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
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        { chatId: selectedChat._id, userId: addUser._id },
        config
      );
      toast({
        title: "User added successfully",
        status: "success",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setSelectedChat(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error occurred while adding user to group",
        status: "error",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter something in group name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
       if (selectedChat.groupAdmin._id !== user._id) {
         toast({
           title: "Only admins can edit group info",
           status: "warning",
           duration: 5000,
           position: "top-left",
           isClosable: true,
         });
         return;
       }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      toast({
        title: "Group name changed successfully",
        status: "success",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
      setRenameLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);

    } catch (error) {
      setRenameLoading(false);
      toast({
        title: "Error occurred renaming chat",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    setGroupChatName("");
  };
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
      setSearchResult(data);
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

  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />}>
        Open Modal
      </IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            textAlign={"center"}
            fontSize='35px'
            fontFamily={"work sans"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display='flex' flexWrap={"wrap"}>
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleDelete={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder='Chat Name'
                mb='1'
              />
              <Button
                colorScheme={"teal"}
                variant='solid'
                onClick={handleRename}
                isLoading={renameLoading}
                ml={1}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Add users eg:jane doe'
                mb='1'
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult
                .slice(0, 3)
                .map((u) => (
                  <UserListItem
                    user={u}
                    key={u._id}
                    handleClick={() => handleAdduser(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
