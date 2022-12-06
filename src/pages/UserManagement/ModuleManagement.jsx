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

const ModuleManagement = () => {
  const [module, setModule] = useState([])
  const [editData, setEditData] = useState([])
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState('')
  const toast = useToast()
  const currentUser = decodeUser()

  const [isLoading, setIsLoading] = useState(true)
  const [pageTotal, setPageTotal] = useState(undefined)
  const [disableEdit, setDisableEdit] = useState(false)

  // FETCH API MODULES:
  const fetchModuleApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Module/GetAllModulesWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`,
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
      routeLabel = 'InActiveModule'
    } else {
      routeLabel = 'ActivateModule'
    }

    request
      .put(`/Module/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent('Success', 'Status updated', 'success', toast)
        getModuleHandler()
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(routeLabel)
  }

  //SHOW MODULE DATA----
  const getModuleHandler = () => {
    fetchModuleApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false)
      setModule(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    getModuleHandler()

    return () => {
      setModule([])
    }
  }, [currentPage, pageSize, status, search])

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue)
    console.log(inputValue)
  }

  //ADD MODULE HANDLER---
  const addModuleHandler = () => {
    setEditData({
      id: '',
      mainMenuId: '',
      subMenuName: '',
      moduleName: '',
      addedBy: currentUser.userName,
      modifiedBy: '',
    })
    onOpen()
    setDisableEdit(false)
  }

  //EDIT MODULE--
  const editModuleHandler = (module) => {
    setDisableEdit(true)
    setEditData(module)
    onOpen()
    console.log(module.mainMenuId)
  }

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDrawerTaggingOpen,
    onOpen: openDrawerTagging,
    onClose: closeDrawerTagging,
  } = useDisclosure()

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
      {/* <Flex
        h="40px"
        w="full"
        alignItems="center"
        p={2}
        fontSize="15px"
        fontWeight="bold"
      >
        <Text>User Roles:</Text>
      </Flex> */}

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
                  placeholder="Search: Sub-Menu Name"
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
                        Menu Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Sub-Menu Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {module.module?.map((mod, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{mod.id}</Td>
                        <Td fontSize="11px">{mod.mainMenu}</Td>
                        <Td fontSize="11px">{mod.subMenuName}</Td>
                        <Td fontSize="11px">{mod.dateAdded}</Td>
                        <Td fontSize="11px">{mod.addedBy}</Td>

                        <Td>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                onClick={() => editModuleHandler(mod)}
                              >
                                <AiTwotoneEdit />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      <Button p={0} bg="none">
                                        <RiInboxUnarchiveFill />
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
                        {/* <Td>
                          <Button
                            bg="none"
                            // onClick={() => editRolesHandler(rol)}
                          >
                            <FaUserTag />
                          </Button>
                        </Td> */}
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
                // leftIcon={<IoDocumentsSharp />}
                borderRadius="none"
                onClick={addModuleHandler}
              >
                New Module
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchModuleApi={fetchModuleApi}
                  getModuleHandler={getModuleHandler}
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

export default ModuleManagement

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    mainMenuId: yup.number().required('Main Menu is required'),
    subMenuName: yup.string().required('Sub-Menu is required'),
    moduleName: yup.string().required('Module Path is required'),
  }),
})

const currentUser = decodeUser()

const DrawerComponent = (props) => {
  const { isOpen, onClose, getModuleHandler, editData, disableEdit } = props
  const [module, setModule] = useState([])
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
        mainMenuId: '',
        subMenuName: '',
        moduleName: '',
        addedBy: currentUser?.userName,
      },
    },
  })

  // FETCH MAIN MENU
  const fetchMainMenu = async () => {
    try {
      const res = await request.get('Module/GetAllActiveMainMenu')
      setModule(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    try {
      fetchMainMenu()
    } catch (error) {}
  }, [])

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === '') {
        delete data.formData['id']
        const res = await request
          .post('Module/AddNewModule', data.formData)
          .then((res) => {
            ToastComponent('Success', 'New Module created!', 'success', toast)
            getModuleHandler()
            onClose()
          })
          .catch((err) => {
            ToastComponent('Error', err.response.data, 'error', toast)
            // data.formData.id = "";
          })
      } else {
        const res = await request
          .put(`Module/UpdateModule`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'Module Updated', 'success', toast)
            getModuleHandler()
            onClose()
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
          mainMenuId: editData?.mainMenuId,
          subMenuName: editData?.subMenuName,
          moduleName: editData?.moduleName,
          // modifiedBy: currentUser.userName,
        },
        { shouldValidate: true },
      )
    }
  }, [editData])

  console.log(watch('formData.id'))

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Module Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Main Menu:</FormLabel>

                  {module.length > 0 ? (
                    <Select
                      {...register('formData.mainMenuId')}
                      placeholder="Select Main Menu"
                    >
                      {module.map((mods) => (
                        <option key={mods.id} value={mods.id}>
                          {mods.mainMenu}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    'loading'
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.mainMenuId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Sub-Menu Name:</FormLabel>
                  <Input
                    {...register('formData.subMenuName')}
                    placeholder="Please enter Sub-Menu name"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.subMenuName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Menu Path Name:</FormLabel>
                  <Input
                    {...register('formData.moduleName')}
                    placeholder="Please enter Menu Path name"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.moduleName?.message}
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
