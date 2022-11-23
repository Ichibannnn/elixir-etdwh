import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { AiFillDelete, AiOutlinePlus, AiTwotoneEdit } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import request from "../../services/ApiClient";

const fetchUserApi = async () => {
  const response = await request.get("User/GetAllUser");

  return response.data;
};

const UserAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

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
        pl={2}
        fontSize="15px"
        fontWeight="bold"
      >
        User Account
      </Flex>

      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex flexDirection="row" justifyContent="space-between">
            <InputGroup size="xs">
              <InputLeftElement
                pointerEvents="none"
                children={<FaSearch color="black" />}
              />
              <Input
                borderRadius="none"
                w="20%"
                size="xs"
                type="text"
                placeholder="Search: Username"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
              />
            </InputGroup>

            <Button
              size="xs"
              bg="blackAlpha.300"
              _hover={{ bg: "teal.400", color: "#fff" }}
              // bgColor="blackAlpha.400"
              // color="blackAlpha.900"
              w="9%"
              leftIcon={<AiOutlinePlus />}
              borderRadius="none"
            >
              New User
            </Button>
          </Flex>

          <Flex w="full">
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
                            // onClick={() => editHandler(showData)}
                            />
                          </Button>

                          <Button p={0} bg="none">
                            <AiFillDelete />
                          </Button>
                        </HStack>
                      </Flex>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default UserAccount;
