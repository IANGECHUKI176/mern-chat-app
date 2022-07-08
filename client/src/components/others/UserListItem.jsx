import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleClick, group }) => {

  return (
    <div>
      <Box
        onClick={handleClick}
        px={3}
        py={2}
        mb={2}
        borderRadius='lg'
        display={"flex"}
        alignItems='center'
        color={"black"}
        bgColor='#e8e8e8'
        cursor={"pointer"}
        _hover={{
          backgroundColor: "#38b2ac",
          color: "white",
        }}
        width={group ? "sm" : "100%"}
      >
        <Avatar src={user.pic} size='xs' mr='2' name={user.name} />
        <Box>
          <Text>
            {user.name}
          </Text>
          <Text fontSize={"xs"}>
            <b>Email:</b> {user.email}
          </Text>
        </Box>
      </Box>
    </div>
  );
};

export default UserListItem;
