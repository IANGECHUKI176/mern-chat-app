import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useColorMode,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { getSender } from "../../config/chatLogic";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { Effect } from "react-notification-badge";
const SideDrawer = ({ user }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { setSelectedChat, chats, setChats, notifications, setNotifications } =
    ChatState();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    setLoading(true);
    if (!search) {
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
      const { data } = await axios.get(
        `http://localhost:5000/api/user/all?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const accessChat = async (userId) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats((oldChats) => [data, ...oldChats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoadingChat(false);
    }
  };
  const handleNotification = async (notification) => {
    setSelectedChat(notification.message.chat);
    setNotifications(
      notifications.filter((not) => not._id !== notification._id)
    );
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(
        `http://localhost:5000/api/notification/${notification._id}`,
        config
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent='space-between'
        alignItems={"center"}
        width='100%'
        bgColor='white'
        padding='5px 10px 5px 10px'
        borderWidth={"3px"}
      >
        <Tooltip label='Search users to chat' placement='bottom-end' hasArrow>
          <Button variant='ghost' onClick={onOpen}>
            <i className='fa-solid fa-magnifying-glass'></i>
            <Text display={{ md: "flex", base: "none" }} px='4'>
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily='work sans'>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p='1'>
              <NotificationBadge
                count={notifications?.length}
                effect={Effect.SCALE}
              />
              <BellIcon m='1' fontSize={"2xl"} />
            </MenuButton>
            <MenuList>
              {!notifications?.length && "No new Messages"}
              {notifications?.map((n) => (
                <MenuItem key={n._id} onClick={() => handleNotification(n)}>
                  {n.message.chat.isGroupChat
                    ? `New Message in ${n.message.chat.chatName}`
                    : `New Message from ${getSender(
                        user,
                        n.message.chat.users
                      )}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' src={user.pic} name={user.name} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>

              <Divider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input
                placeholder='Search by name or email'
                marginRight='10px'
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading></ChatLoading>
            ) : (
              <>
                {searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleClick={() => accessChat(user._id)}
                  />
                ))}
              </>
            )}
            {loadingChat && <Spinner marginLeft='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
