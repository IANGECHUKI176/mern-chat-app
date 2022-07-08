import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);
  const postDetails = async (image) => {
    setLoading(true);
    if (image === undefined) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (image.type === "image/jpeg" || image.type === "image/png") {
      let formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "chat-app");
      formData.append("cloud_name", "ian-inc");
      try {
        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/ian-inc/image/upload",
          formData
        );
        setPic(data.url.toString());
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error occured while uploading image",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else {
      toast({
        title: "Please select an image.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/register",
        { name, email, password, pic }
      );
      toast({
        title: "Registration successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats")
    } catch (error) {
      toast({
        title: "error occurred",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing='5px'>
      <FormControl isRequired>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input
          id='name'
          value={name}
          autoFocus
          type='text'
          placeholder='enter your name'
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='email'>Email</FormLabel>
        <Input
          id='email'
          type='email'
          value={email}
          placeholder='enter your email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='password'>Password</FormLabel>
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            type={show ? "text" : "password"}
            id='password'
            value={password}
            placeholder='enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor='ConfirmPassword'>ConfirmPassword</FormLabel>
        <InputGroup size='md'>
          <Input
            pr='4.5rem'
            type={show ? "text" : "password"}
            id='ConfirmPassword'
            value={confirmPassword}
            placeholder='enter your password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {pic ? (
        <Avatar size='xl' name='pic' src={pic} />
      ) : (
        <FormControl isRequired>
          <FormLabel htmlFor='ConfirmPassword'>Upload Picture</FormLabel>
          <Input
            type='file'
            p={1.5}
            accept='image/*'
            id='ConfirmPassword'
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>
      )}

      <Button
        colorScheme='blue'
        w='100%'
        mt='15px'
        onClick={submitHandler}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  );
};

export default Register;
