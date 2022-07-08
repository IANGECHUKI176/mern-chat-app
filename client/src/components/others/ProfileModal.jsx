import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";


const ProfileModal = ({ children, user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          onClick={onOpen}
          icon={<ViewIcon display={{ base: "flex" }} />}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent height={"410px"}>
          <ModalHeader
            fontSize={"40px"}
            display='flex'
            justifyContent={"center"}
            fontFamily='work sans'
          >
           {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            alignItems={"center"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Image
              src={user.pic}
              alt={user.name}
              borderRadius='full'
              boxSize={"150px"}
            />
            <Text
              fontFamily={"work sans"}
              fontSize={{ base: "22px", md: "25px" }}
            >
              Email:{user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
