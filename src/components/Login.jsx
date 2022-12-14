import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import request from '../services/ApiClient'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'

//Toast
import { ToastComponent } from './Toast'
import { saltKey } from '../saltkey'
import { decodeUser } from '../services/decode-user'

const Login = () => {
  var [username, setUsername] = useState('')
  var [password, setPassword] = useState('')
  var navigate = useNavigate()
  var [Loader, setLoader] = useState(false)
  const toast = useToast()
  const user = decodeUser()

  const submitHandler = async (event, user) => {
    event.preventDefault()

    var login = { username, password }

    if ((username || password) === '') {
      return ToastComponent(
        'Login Error',
        'Username and Password is required!',
        'error',
        toast,
      )
    } else if ((username && password) === '') {
      return ToastComponent(
        'Login Error',
        'Please fill up username or password!',
        'error',
        toast,
      )
    } else {
      setLoader(true)
      var response = await request
        .post('Login/authenticate', login)
        .then((response) => {
          var ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(response?.data),
            saltKey,
          ).toString()
          sessionStorage.setItem('userToken', ciphertext)
          setLoader(false)
          navigate('/')
          window.location.reload(false)
          ToastComponent(
            'Login Success',
            `Welcome to Elixir ETD! ${response?.data.fullName}`,
            'success',
            toast,
          )
        })
        .catch((err) => {
          ToastComponent('Login', err.response.data.message, 'error', toast)
          setLoader(false)
        })
    }
  }

  return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
      <Box
        w={['full', 'sm']}
        p={[8, 8]}
        mt={[20, '10vh']}
        mx="auto"
        borderRadius={10}
        alignItems="center"
        justifyContent="center"
        className="form-color"
        boxShadow="lg"
      >
        <VStack spacing={8} align="flex-start" w="full">
          <VStack spacing={-1} align={['flex', 'center']} w="full">
            <Image
              boxSize="100px"
              objectFit="fill"
              src="/images/elixirlogos.png"
              alt="etheriumlogo"
            />
            <Heading fontSize="3xl" className="logo-text">
              Elixir ETD
            </Heading>
            <Text fontSize="12px" color="#fff">
              Enter your username and password to login
            </Text>
          </VStack>

          <Flex flexDirection="column" w="full">
            <form onSubmit={submitHandler}>
              <Text color="#fff" fontSize="13px">
                Username
              </Text>
              <Input
                placeholder="Enter username"
                rounded="none"
                variant="outline"
                borderColor="whiteAlpha.300"
                fontSize="xs"
                color="#fff"
                // bg="#1A202C"
                _hover={{ bg: '#1A202C' }}
                onChange={(event) => {
                  setUsername(event.target.value)
                }}
              />
              <Text color="#fff" fontSize="13px">
                Password
              </Text>
              <Input
                placeholder="Enter password"
                rounded="none"
                variant="outline"
                type="password"
                color="#fff"
                borderColor="whiteAlpha.300"
                // bg="#1A202C"
                _hover={{ bg: '#1A202C' }}
                fontSize="xs"
                onChange={(event) => {
                  setPassword(event.target.value)
                }}
              />
              <Button
                borderRadius="none"
                fontSize="13px"
                type="submit"
                colorScheme="blue"
                w="full"
                mt={5}
                isLoading={Loader}
              >
                Login
              </Button>
            </form>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  )
}

export default Login
