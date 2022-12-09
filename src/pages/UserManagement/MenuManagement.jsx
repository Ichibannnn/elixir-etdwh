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
import { GiChoice } from 'react-icons/gi'
import { FaSearch, FaUsers, FaUserTag } from 'react-icons/fa'
import { VscEye, VscEyeClosed } from 'react-icons/vsc'
import { SlUserFollow } from 'react-icons/sl'
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

const MenuManagement = () => {
  const [mainMenu, setMainMenu] = useState([])
  const [editData, setEditData] = useState([])
  const [status, setStatus] = useState(true)
  const toast = useToast()
  const currentUser = decodeUser()

  const [isLoading, setIsLoading] = useState(true)
  const [disableEdit, setDisableEdit] = useState(false)

  console.log(status)

  // FETCH API ROLES:
  const fetchMainMenuApi = async (status) => {
    if (status === true || status === 'true') {
      const response = await request.get(`Module/GetAllActiveMainMenu`)
      return response.data
    } else if (status === false || status === 'false') {
      const response = await request.get(`Module/GetAllInActiveMainMenu`)
      return response.data
    }
  }

  //STATUS
  const statusHandler = (data) => {
    setStatus(data)
  }

  const changeStatusHandler = (id, isActive) => {
    let routeLabel
    if (isActive) {
      routeLabel = 'InActiveMenu'
    } else {
      routeLabel = 'ActivateMainMenu'
    }

    request
      .put(`/Module/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent('Success', 'Status updated', 'success', toast)
        getMainMenuHandler()
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(routeLabel)
  }

  //SHOW MAIN MENU DATA----
  const getMainMenuHandler = () => {
    fetchMainMenuApi(status).then((res) => {
      setIsLoading(false)
      setMainMenu(res)
    })
  }

  useEffect(() => {
    getMainMenuHandler()

    return () => {
      setMainMenu([])
    }
  }, [status])

  //ADD MAIN MENU HANDLER---
  const addMainMenuHandler = () => {
    setEditData({
      id: '',
      moduleName: '',
      menuPath: '',
      addedBy: currentUser.userName,
      modifiedBy: '',
    })
    onOpen()
    setDisableEdit(false)
  }

  //EDIT ROLE--
  const editMainMenuHandler = (mod) => {
    setDisableEdit(true)
    setEditData(mod)
    onOpen()
    // console.log(mod.mainMenu)
  }

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure()

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
              {/* <InputGroup size="sm">
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
              </InputGroup> */}
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
                        Main Menu
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
                    {mainMenu?.map((mod, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{mod.id}</Td>
                        <Td fontSize="11px">{mod.mainMenu}</Td>
                        <Td fontSize="11px">{mod.addedBy}</Td>
                        <Td fontSize="11px">{mod.dateAdded}</Td>

                        <Td>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                onClick={() => editMainMenuHandler(mod)}
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
                                            {mod.isActive === true ? (
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
                                                  mod.id,
                                                  mod.isActive,
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
                onClick={addMainMenuHandler}
              >
                New Main Menu
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchMainMenuApi={fetchMainMenuApi}
                  getMainMenuHandler={getMainMenuHandler}
                  editData={editData}
                  disableEdit={disableEdit}
                />
              )}

              <Stack>
                {/* <Pagination
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
                </Pagination> */}
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MenuManagement

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    moduleName: yup.string().required('Main Menu is required'),
    menuPath: yup.string().required('Main Menu Path is required'),
  }),
})

const currentUser = decodeUser()

const DrawerComponent = (props) => {
  const { isOpen, onClose, getMainMenuHandler, editData, disableEdit } = props
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
        moduleName: '',
        menuPath: '',
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
          .post('Module/AddNewMainMenu', data.formData)
          .then((res) => {
            ToastComponent(
              'Success',
              'New Main Menu created!',
              'success',
              toast,
            )
            getMainMenuHandler()
            onClose()
          })
          .catch((err) => {
            ToastComponent('Error', err.response.data, 'error', toast)
            // data.formData.id = "";
          })
      } else {
        const res = await request
          .put(`Module/UpdateMenu`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'Main Menu Updated', 'success', toast)
            getMainMenuHandler()
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
          moduleName: editData?.mainMenu,
          menuPath: editData?.menuPath,
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
            <DrawerHeader borderBottomWidth="1px">Main Menu Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Main Menu:</FormLabel>
                  <Input
                    {...register('formData.moduleName')}
                    placeholder="Please enter Main Menu name"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.moduleName?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Main Menu Path:</FormLabel>
                  <Input
                    {...register('formData.menuPath')}
                    placeholder="Please enter Main Menu name"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.menuPath?.message}
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
