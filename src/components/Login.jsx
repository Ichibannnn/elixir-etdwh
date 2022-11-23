import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import request from "../services/ApiClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saltKey } from "../saltkey";

const ToastSuccess = () => {
  toast.success("Login successfully!", {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 1,
    theme: "dark",
  });
};

const Login = () => {
  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");
  // var [message, setMessage] = useState("");
  var navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();

    var login = { username, password };

    var response = await request
      .post("Login/authenticate", login)
      .then((response) => {
        var ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(response.data),
          saltKey
        ).toString();
        sessionStorage.setItem("userToken", ciphertext);

        navigate("/");
        ToastSuccess();
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Login Error",
          text: "Wrong username or password!",
          //text: err.response.data.message,
        });
      });

    // ToastSuccess()
    // .then((response) => {
    //   sessionStorage.setItem("userToken", response.data.token);
    //   sessionStorage.setItem("userData", JSON.stringify(response.data));
    //   navigate("/");
    // })
    // .catch((err) => {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Login Error",
    //     text: "Wrong username or password!",
    //     //text: err.response.data.message,
    //   });
    // });
  };

  return (
    <Flex h="100vh" justifyContent="center" alignItems="center" bg="#F8FAFC">
      <Box
        w={["full", "md"]}
        p={[8, 10]}
        mt={[20, "10vh"]}
        mx="auto"
        // border={["none", "1px"]}
        // borderColor={["", "gray.300"]}
        borderRadius={10}
        alignItems="center"
        justifyContent="center"
        bg="#1A202C"
        // color="black"
      >
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align={["flex-start", "center"]} w="full">
            <Heading color="blue.300">Elixir ETD</Heading>
            <Text fontSize="14px" color="#fff">
              Enter your username and password to login
            </Text>
          </VStack>

          <Flex flexDirection="column" w="full">
            <form onSubmit={submitHandler}>
              <Text color="#fff">Username</Text>
              <Input
                rounded="none"
                variant="filled"
                borderColor="whiteAlpha.300"
                fontSize="xs"
                color="#fff"
                bg="#1A202C"
                _hover={{ bg: "#1A202C" }}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />

              <Text color="#fff">Password</Text>
              <Input
                rounded="none"
                variant="filled"
                type="password"
                color="#fff"
                borderColor="whiteAlpha.300"
                bg="#1A202C"
                _hover={{ bg: "#1A202C" }}
                fontSize="xs"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
              <Button
                rounded="none"
                type="submit"
                colorScheme="blue"
                w="full"
                mt={5}
              >
                Login
              </Button>
            </form>
          </Flex>
        </VStack>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Flex>
  );
};

export default Login;
