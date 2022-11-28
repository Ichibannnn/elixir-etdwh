import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  useToast,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  AiFillDelete,
  AiOutlinePlus,
  AiOutlineUserAdd,
  AiTwotoneEdit,
} from "react-icons/ai";
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { SlUserFollow } from "react-icons/sl";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const UserAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [editUserData, seteditUserData] = useState({
    id: "",
    userName: "",
    password: "",
    userRole: "",
    department: "",
  });

  const toast = useToast();

  //SHOW USER DATA----

  const fetchUserApi = async () => {
    const response = await request.get("User/GetAllUsers");

    return response.data;
  };

  const getUserHandler = () => {
    fetchUserApi().then((res) => {
      setUsers(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getUserHandler();

    return () => {
      setUsers();
    };
  }, []);

  //ADD USER HANDLER---
  const addUserHandler = () => {
    seteditUserData({
      id: "",
      userName: "",
      password: "",
      userRole: "",
      department: "",
    });
    onOpen();
  };

  //EDIT USER--
  const editUserHandler = (edit) => {
    onOpen();
    seteditUserData({
      id: edit.id,
      userName: edit.userName,
      password: edit.password,
      userRole: edit.userRole,
      department: edit.department,
    });
  };

  //FOR DRAWER
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      color="fontColor"
      h="full"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <Flex
        h="40px"
        w="full"
        align-items="center"
        p={2}
        fontSize="15px"
        fontWeight="bold"
      >
        User Account
      </Flex>

      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack>
              <InputGroup size="xs">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaSearch color="black" />}
                />
                <Input
                  borderRadius="none"
                  size="xs"
                  type="text"
                  placeholder="Search: Username"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </InputGroup>
            </HStack>

            <HStack flexDirection="row">
              <Text fontSize="12px">STATUS:</Text>
              <Select fontSize="12px">
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </HStack>
          </Flex>

          <Flex w="full" flexDirection="column" gap={2}>
            {isLoading ? (
              <Stack width="full">
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
                <Skeleton height="20px" />
              </Stack>
            ) : (
              <Table
                size="sm"
                variant=""
                width="full"
                border="none"
                boxShadow="md"
              >
                <Thead bg="secondary">
                  <Tr fontSize="15px">
                    <Th color="#D6D6D6" fontSize="10px">
                      ID
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      Fullname
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      Username
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      Department
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      User Role
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      Added By
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      Date Added
                    </Th>
                    <Th color="#D6D6D6" fontSize="10px">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users?.map((user, i) => (
                    <Tr key={i}>
                      <Td fontSize="11px">{user.id}</Td>
                      <Td fontSize="11px">{user.fullName}</Td>
                      <Td fontSize="11px">{user.userName}</Td>
                      <Td fontSize="11px">{user.department}</Td>
                      <Td fontSize="11px">{user.userRole}</Td>
                      <Td fontSize="11px">{user.addedBy}</Td>
                      <Td fontSize="11px">{user.dateAdded}</Td>

                      <Flex>
                        <HStack>
                          <Button p={0} bg="none">
                            <AiTwotoneEdit
                            // onClick={() => editUserHandler(user)}
                            />
                          </Button>
                          <Button p={0} bg="none">
                            <RiInboxUnarchiveFill />
                          </Button>
                        </HStack>
                      </Flex>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}

            <Flex>
              <Button
                size="xs"
                colorScheme="blue"
                _hover={{ bg: "blue.400", color: "#fff" }}
                w="8%"
                leftIcon={<SlUserFollow />}
                borderRadius="none"
                onClick={addUserHandler}
              >
                New User
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* PROPS */}
      {isOpen && (
        <DrawerComponent
          isOpen={isOpen}
          onClose={onClose}
          editUserData={editUserData}
          seteditUserData={seteditUserData}
          fetchUserApi={fetchUserApi}
        />
      )}
    </Flex>
  );
};

export default UserAccount;

const schema = yup
  .object({
    fullName: yup.string().required("Fullname is required"),
    userName: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    userRole: yup.string().required("Role is requred"),
    department: yup.string().required("Department is requred"),
  })
  .required();

const DrawerComponent = (props) => {
  const {
    isOpen,
    onClose,
    fetchUserApi,
    getUserHandler,
    editUserData,
    seteditUserData,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    alert("Success");
  };

  const submitHandler = async () => {
    if (editUserData.id) {
      const submitData = {
        id: editUserData.id,
        fullName: editUserData.fullName,
        userName: editUserData.userName,
        password: editUserData.password,
        role: editUserData.role,
        department: editUserData.department,
      };
      const id = editUserData.id;
      const res = await request.put(`User/UpdateUserInfo/${id}`, submitData);
      onClose();
      ToastComponent();
      fetchUserApi();
    } else if (editUserData.id === "") {
      delete editUserData["id"];
      const res = await request.post("User/AddNewUser", editUserData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successfully added UOM!",
        showConfirmButton: false,
        timer: 1500,
      });

      onClose();
      fetchUserApi();
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">User Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Full Name:</FormLabel>
                  <Input
                    {...register("fullName")}
                    placeholder="Please enter Fullname"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.fullName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Username:</FormLabel>
                  <Input
                    {...register("userName")}
                    placeholder="Please enter Fullname"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.userName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Password:</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Please enter Password"
                    />
                    <InputRightElement>
                      <Button
                        bg="none"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                      >
                        {showPassword ? <VscEye /> : <VscEyeClosed />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Text color="red" fontSize="xs">
                    {errors.password?.message}
                  </Text>
                </Box>

                <Flex mt={3}></Flex>

                <Box>
                  <FormLabel>Role:</FormLabel>
                  <Select>
                    <option>Role 1 </option>
                    <option>Role 2 </option>
                    <option>Role 3 </option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel>Department:</FormLabel>
                  <Select>
                    <option>Department 1 </option>
                    <option>Department 2 </option>
                    <option>Department 3 </option>
                  </Select>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" onClick={submitHandler}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
