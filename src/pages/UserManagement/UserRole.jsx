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
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  VStack,
  Portal,
  TableContainer,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  AiFillDelete,
  AiOutlinePlus,
  AiOutlineUserAdd,
  AiTwotoneEdit,
} from 'react-icons/ai'
import { RiInboxUnarchiveFill } from 'react-icons/ri'
import { FaSearch, FaUsers, FaUserTag } from 'react-icons/fa'
import { VscEye, VscEyeClosed } from 'react-icons/vsc'
import { GiChoice } from 'react-icons/gi'
import PageScroll from '../../utils/PageScroll'
import request from '../../services/ApiClient'
import { ToastComponent } from '../../components/Toast'
import Swal from 'sweetalert2'
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
import DrawerTaggingComponent from './DrawerTaggingComponent'

const UserRole = () => {
  const [roles, setRoles] = useState([])
  const [editData, setEditData] = useState([])
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState('')
  const toast = useToast()
  const currentUser = decodeUser()

  const [isLoading, setIsLoading] = useState(true)
  const [pageTotal, setPageTotal] = useState(undefined)
  const [disableEdit, setDisableEdit] = useState(false)

  // FETCH API ROLES:
  const fetchRolesApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Role/GetAllRoleWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`,
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
      routeLabel = 'InActiveRoles'
    } else {
      routeLabel = 'ActivateRoles'
    }

    request
      .put(`/Role/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent('Success', 'Status updated', 'success', toast)
        getRolesHandler()
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(routeLabel)
  }

  //SHOW ROLES DATA----
  const getRolesHandler = () => {
    fetchRolesApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false)
      setRoles(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    getRolesHandler()

    return () => {
      setRoles([])
    }
  }, [currentPage, pageSize, status, search])

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue)
    console.log(inputValue)
  }

  //ADD ROLE HANDLER---
  const addRolesHandler = () => {
    setEditData({
      id: '',
      roleName: '',
      addedBy: currentUser.userName,
      modifiedBy: '',
    })
    onOpen()
    setDisableEdit(false)
  }

  //EDIT ROLE--
  const editRolesHandler = (role) => {
    setDisableEdit(true)
    setEditData(role)
    onOpen()
    console.log(role.roleName)
  }

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDrawerTaggingOpen,
    onOpen: openDrawerTagging,
    onClose: closeDrawerTagging,
  } = useDisclosure()

  //MODULE TAGGING
  const [taggingParameter, setTaggingParameter] = useState({
    roleId: '',
    roleName: '',
  })
  const moduleTaggingHandler = (id, roleName) => {
    setTaggingParameter({ roleId: id, roleName: roleName })
    openDrawerTagging()
    // setSelectedId(id)
    // setSelectedRolename(roleName)
  }

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
                  placeholder="Search: User Role"
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
            <PageScroll>
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
                        User Role
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      {/* <Th color="#D6D6D6" fontSize="10px">
                          Modified By
                        </Th>
                        <Th color="#D6D6D6" fontSize="10px">
                          Date Modified
                        </Th> */}
                      <Th color="#D6D6D6" fontSize="10px">
                        Action
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Access
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {roles.role?.map((rol, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{rol.id}</Td>
                        <Td fontSize="11px">{rol.roleName}</Td>
                        <Td fontSize="11px">{rol.addedBy}</Td>
                        <Td fontSize="11px">{rol.dateAdded}</Td>

                        <Td>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                onClick={() => editRolesHandler(rol)}
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
                                            {rol.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this department inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this department active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  rol.id,
                                                  rol.isActive,
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
                          </Flex>
                        </Td>
                        <Td>
                          <Button
                            bg="none"
                            onClick={() =>
                              moduleTaggingHandler(rol.id, rol.roleName)
                            }
                          >
                            <FaUserTag />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </PageScroll>

            <Flex justifyContent="space-between" mt={3}>
              <Button
                size="sm"
                colorScheme="blue"
                _hover={{ bg: 'blue.400', color: '#fff' }}
                w="auto"
                leftIcon={<FaUsers />}
                borderRadius="none"
                onClick={addRolesHandler}
              >
                New Role
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchRolesApi={fetchRolesApi}
                  getRolesHandler={getRolesHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )}

              {isDrawerTaggingOpen && (
                <DrawerTaggingComponent
                  isOpen={isDrawerTaggingOpen}
                  onClose={closeDrawerTagging}
                  onOpen={openDrawerTagging}
                  taggingData={taggingParameter}
                  // fetchRolesApi={fetchRolesApi}
                  getRolesHandler={getRolesHandler}
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
                        bg="#FFFFFF"
                        // size="sm"
                        mb={2}
                        variant="outline"
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

export default UserRole

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    roleName: yup.string().required('User Role is required'),
  }),
})

const currentUser = decodeUser()

const DrawerComponent = (props) => {
  const { isOpen, onClose, getRolesHandler, editData, disableEdit } = props
  const [showPassword, setShowPassword] = useState(false)
  const [roles, setRoles] = useState([])
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      formData: {
        id: '',
        roleName: '',
        addedBy: currentUser?.userName,
        modifiedBy: '',
      },
    },
  })

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === '') {
        delete data.formData['id']
        const res = await request
          .post('Role/AddNewRole', data.formData)
          .then((res) => {
            ToastComponent('Success', 'New Role created!', 'success', toast)
            getRolesHandler()
            onClose()
          })
          .catch((err) => {
            ToastComponent('Error', err.response.data, 'error', toast)
            // data.formData.id = "";
          })
      } else {
        const res = await request
          .put(`Role/UpdateUserInfo`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'Role Updated', 'success', toast)
            getRolesHandler()
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

  useEffect(() => {
    if (editData.id) {
      setValue(
        'formData',
        {
          id: editData.id,
          roleName: editData?.roleName,
          modifiedBy: currentUser.userName,
        },
        { shouldValidate: true },
      )
    }
  }, [editData])

  console.log(watch('formData'))

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Role Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>User Role:</FormLabel>
                  <Input
                    {...register('formData.roleName')}
                    placeholder="Please enter User Role"
                    // onChange={(e) =>
                    //   setEditData((prevValue) => ({
                    //     ...prevValue,
                    //     userName: e.target.value,
                    //   }))
                    // }
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.roleName?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  )
}
