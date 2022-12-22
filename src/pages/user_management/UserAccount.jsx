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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Portal,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AiTwotoneEdit } from 'react-icons/ai'
import { GiChoice } from 'react-icons/gi'
import { FaSearch } from 'react-icons/fa'
import { VscEye, VscEyeClosed } from 'react-icons/vsc'
import { MdLibraryAdd } from 'react-icons/md'
import PageScroll from '../../utils/PageScroll'
import request from '../../services/ApiClient'
import { ToastComponent } from '../../components/Toast'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { decodeUser } from '../../services/decode-user'
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from '@ajna/pagination'

const UserAccount = () => {
  const [users, setUsers] = useState([])
  const [editData, setEditData] = useState([])
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState('')
  const toast = useToast()
  const currentUser = decodeUser()

  const [isLoading, setIsLoading] = useState(true)
  const [pageTotal, setPageTotal] = useState(undefined)
  const [disableEdit, setDisableEdit] = useState(false)

  const fetchUserApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `User/GetAllUserWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`,
    )

    return response.data
  }

  //PAGINATION
  const outerLimit = 2
  const innerLimit = 2
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  })

  //SHOW USER DATA----
  const getUserHandler = () => {
    fetchUserApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false)
      setUsers(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    getUserHandler()

    return () => {
      setUsers([])
    }
  }, [currentPage, pageSize, status, search])

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value)
    setPageSize(pageSize)
  }

  //STATUS
  const statusHandler = (data) => {
    setStatus(data)
  }

  const changeStatusHandler = (id, isActive) => {
    let routeLabel
    if (isActive) {
      routeLabel = 'InactiveUser'
    } else {
      routeLabel = 'ActivateUser'
    }

    request
      .put(`/User/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent('Success', 'Status updated', 'success', toast)
        getUserHandler()
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(routeLabel)
  }

  const searchHandler = (inputValue) => {
    setSearch(inputValue)
    console.log(inputValue)
  }

  //ADD USER HANDLER---
  const addUserHandler = () => {
    setEditData({
      id: '',
      fullName: '',
      userName: '',
      password: '',
      userRoleId: '',
      departmentId: '',
      addedBy: currentUser.userName,
      modifiedBy: '',
    })
    onOpen()
    setDisableEdit(false)
  }

  //EDIT USER--
  const editUserHandler = (user) => {
    setDisableEdit(true)
    setEditData(user)
    onOpen()
  }
  //FOR DRAWER
  const { isOpen, onOpen, onClose } = useDisclosure()

  // console.log(status);

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack>
              <InputGroup size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaSearch color="black" />}
                />
                <Input
                  borderRadius="none"
                  size="sm"
                  type="text"
                  placeholder="Search: Username"
                  borderColor="gray.400"
                  _hover={{ borderColor: 'gray.400' }}
                  onChange={(e) => searchHandler(e.target.value)}
                />
              </InputGroup>
            </HStack>

            <HStack flexDirection="row">
              <Text fontSize="12px">STATUS:</Text>
              <Select
                fontSize="12px"
                onChange={(e) => statusHandler(e.target.value)}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Select>
            </HStack>
          </Flex>

          <Flex w="full" flexDirection="column" gap={2}>
            <PageScroll maxHeight="350px">
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
                  width="full"
                  border="none"
                  boxShadow="md"
                  bg="gray.200"
                  variant="striped"
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
                    {users.user?.map((user, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{user.id}</Td>
                        <Td fontSize="11px">{user.fullName}</Td>
                        <Td fontSize="11px">{user.userName}</Td>
                        <Td fontSize="11px">{user.department}</Td>
                        <Td fontSize="11px">{user.userRole}</Td>
                        <Td fontSize="11px">{user.addedBy}</Td>
                        <Td fontSize="11px">{user.dateAdded}</Td>

                        <Td pl={0}>
                          <HStack>
                            <Button
                              bg="none"
                              onClick={() => editUserHandler(user)}
                            >
                              <AiTwotoneEdit />
                            </Button>

                            <Popover>
                              {({ onClose }) => (
                                <>
                                  <PopoverTrigger>
                                    <Button p={0} bg="none">
                                      <GiChoice />
                                    </Button>
                                  </PopoverTrigger>
                                  <Portal>
                                    <PopoverContent bg="primary" color="#fff">
                                      <PopoverArrow bg="primary" />
                                      <PopoverCloseButton />
                                      <PopoverHeader>
                                        Confirmation!
                                      </PopoverHeader>
                                      <PopoverBody>
                                        <VStack onClick={onClose}>
                                          {user.isActive === true ? (
                                            <Text>
                                              Are you sure you want to set this
                                              user account inactive?
                                            </Text>
                                          ) : (
                                            <Text>
                                              Are you sure you want to set this
                                              user account active?
                                            </Text>
                                          )}
                                          <Button
                                            colorScheme="green"
                                            size="sm"
                                            onClick={() =>
                                              changeStatusHandler(
                                                user.id,
                                                user.isActive,
                                              )
                                            }
                                          >
                                            Yes
                                          </Button>
                                        </VStack>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Portal>
                                </>
                              )}
                            </Popover>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>

            <Flex justifyContent="space-between">
              <Button
                size="sm"
                fontSize="13px"
                fontWeight="normal"
                colorScheme="blue"
                _hover={{ bg: 'blue.400', color: '#fff' }}
                w="auto"
                leftIcon={<MdLibraryAdd fontSize="19px" />}
                borderRadius="none"
                onClick={addUserHandler}
              >
                New User
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchUserApi={fetchUserApi}
                  getUserHandler={getUserHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )}

              <Stack>
                <Pagination
                  pagesCount={pagesCount}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                >
                  <PaginationContainer>
                    <PaginationPrevious
                      bg="primary"
                      color="white"
                      p={1}
                      _hover={{ bg: 'green', color: 'white' }}
                      size="sm"
                    >
                      {'<<'}
                    </PaginationPrevious>
                    <PaginationPageGroup ml={1} mr={1}>
                      {pages.map((page) => (
                        <PaginationPage
                          _hover={{ bg: 'green', color: 'white' }}
                          _focus={{ bg: 'green' }}
                          p={3}
                          bg="primary"
                          color="white"
                          key={`pagination_page_${page}`}
                          page={page}
                          size="sm"
                        />
                      ))}
                    </PaginationPageGroup>
                    <HStack>
                      <PaginationNext
                        bg="primary"
                        color="white"
                        p={1}
                        _hover={{ bg: 'green', color: 'white' }}
                        size="sm"
                        mb={2}
                      >
                        {'>>'}
                      </PaginationNext>
                      <Select
                        onChange={handlePageSizeChange}
                        bg="#fff"
                        size="sm"
                      >
                        <option value={Number(5)}>5</option>
                        <option value={Number(10)}>10</option>
                        <option value={Number(25)}>25</option>
                        <option value={Number(50)}>50</option>
                      </Select>
                    </HStack>
                  </PaginationContainer>
                </Pagination>
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default UserAccount

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    fullName: yup.string().required('Fullname is required'),
    userName: yup
      .string()
      .required('Username is required')
      .min(5, 'Username must be at least 5 characters'),
    password: yup
      .string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters'),
    userRoleId: yup.string().required('User Role is required'),
    departmentId: yup.string().required('Department is required'),
  }),
})

const currentUser = decodeUser()

const DrawerComponent = (props) => {
  const { isOpen, onClose, getUserHandler, editData, disableEdit } = props

  const [showPassword, setShowPassword] = useState(false)
  const [roles, setRoles] = useState([])
  const [departments, setDepartment] = useState([])
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      formData: {
        id: '',
        fullName: '',
        userName: '',
        password: '',
        userRoleId: '',
        departmentId: '',
        addedBy: currentUser?.userName,
        modifiedBy: '',
      },
    },
  })

  const fetchRoles = async () => {
    try {
      const res = await request.get('Role/GetAllActiveRoles')
      setRoles(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    try {
      fetchRoles()
    } catch (error) {}
  }, [])

  const fetchDepartment = async () => {
    try {
      const res = await request.get('User/GetAllActiveDepartment')
      setDepartment(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    try {
      fetchDepartment()
    } catch (error) {}
  }, [])

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === '') {
        delete data.formData['id']
        const res = await request
          .post(`User/AddNewUser`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'New user created!', 'success', toast)
            getUserHandler()
            onClose()
          })
          .catch((err) => {
            ToastComponent('Error', err.response.data, 'error', toast)
            data.formData.id = ''
          })
      } else {
        const res = await request
          .put(`User/UpdateUserInfo`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'User Updated', 'success', toast)
            getUserHandler()
            onClose(onClose)
          })
          .catch((error) => {
            ToastComponent(
              'Update Failed',
              error.response.data,
              'warning',
              toast,
            )
          })
      }
    } catch (err) {}
  }

  // console.log(editData);

  useEffect(() => {
    if (editData.id) {
      setValue(
        'formData',
        {
          id: editData.id,
          fullName: editData?.fullName,
          userName: editData?.userName,
          password: editData?.password,
          userRoleId: editData?.userRoleId,
          departmentId: editData?.departmentId,
          modifiedBy: currentUser.userName,
        },
        { shouldValidate: true },
      )
    }
  }, [editData])

  console.log(watch('formData.userRoleId'))

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">User Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Full Name:</FormLabel>
                  <Input
                    {...register('formData.fullName')}
                    placeholder="Please enter Fullname"
                    autoFocus
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.fullName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Username:</FormLabel>
                  <Input
                    {...register('formData.userName')}
                    placeholder="Please enter Fullname"
                    autoComplete="off"
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    _disabled={{ color: 'black' }}
                    bgColor={disableEdit && 'gray.300'}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.userName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Password:</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...register('formData.password')}
                      placeholder="Please enter Password"
                      autoComplete="off"
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
                    {errors.formData?.password?.message}
                  </Text>
                </Box>

                <Flex mt={3}></Flex>

                <Box>
                  <FormLabel>Role:</FormLabel>
                  {roles.length > 0 ? (
                    <Select
                      {...register('formData.userRoleId')}
                      placeholder="Select Role"
                    >
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.id}>
                          {rol.roleName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    'loading'
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.userRoleId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Department:</FormLabel>
                  {departments.length > 0 ? (
                    <Select
                      {...register('formData.departmentId')}
                      placeholder="Select Department"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    'loading'
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.departmentId?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" disabled={!isValid}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  )
}
