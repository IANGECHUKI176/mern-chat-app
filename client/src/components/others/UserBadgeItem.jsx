import { CloseIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

const UserBadgeItem = ({ handleDelete, user }) => {
    const [loggedUser, setLoggedUser] = useState(
      JSON.parse(localStorage.getItem("userInfo"))
    );
  return (
    <Box
      px={3}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      cursor='pointer'
      bgColor={"purple"}
      color='white'
      fontSize={12}
      variant='solid'
      onClick={handleDelete}
    >
      {user._id === loggedUser._id ? <>{user.name}(you)</> : user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
