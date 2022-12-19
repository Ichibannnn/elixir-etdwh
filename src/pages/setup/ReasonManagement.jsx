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

const ReasonManagement = () => {
  const [reasons, setReasons] = useState([])
  const [editData, setEditData] = useState([])
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState('')
  const toast = useToast()
  const currentUser = decodeUser()

  const [isLoading, setIsLoading] = useState(true)
  const [pageTotal, setPageTotal] = useState(undefined)
  const [disableEdit, setDisableEdit] = useState(false)

  // FETCH API REASON:
  const fetchReasonApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Reason/GetAllReasonWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`,
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
      routeLabel = 'InActiveReason'
    } else {
      routeLabel = 'ActivateReason'
    }

    request
      .put(`/Reason/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent('Success', 'Status updated', 'success', toast)
        getReasonHandler()
      })
      .catch((err) => {
        console.log(err)
      })
    console.log(routeLabel)
  }

  //SHOW REASON DATA----
  const getReasonHandler = () => {
    fetchReasonApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false)
      setReasons(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    getReasonHandler()

    return () => {
      setReasons([])
    }
  }, [currentPage, pageSize, status, search])

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue)
    console.log(inputValue)
  }

  //ADD REASON HANDLER---
  const addReasonHandler = () => {
    setEditData({
      id: '',
      mainMenuId: '',
      reasonName: '',
      addedBy: currentUser.userName,
      modifiedBy: '',
    })
    onOpen()
    setDisableEdit(false)
  }

  //EDIT REASON--
  const editReasonHandler = (reason) => {
    setDisableEdit(true)
    setEditData(reason)
    onOpen()
  }

  //FOR DRAWER
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
              <InputGroup size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaSearch color="black" />}
                />
                <Input
                  borderRadius="none"
                  size="sm"
                  type="text"
                  placeholder="Search: Reason"
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
                        Module
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Reason
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
                    {reasons.reason?.map((rs, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{rs.id}</Td>
                        <Td fontSize="11px">{rs.mainMenu}</Td>
                        <Td fontSize="11px">{rs.reasonName}</Td>
                        <Td fontSize="11px">{rs.addedBy}</Td>
                        <Td fontSize="11px">{rs.dateAdded}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                onClick={() => editReasonHandler(rs)}
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
                                            {rs.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this module inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this module active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  rs.id,
                                                  rs.isActive,
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

            <Flex justifyContent="space-between">
              <Button
                size="sm"
                colorScheme="blue"
                _hover={{ bg: 'blue.400', color: '#fff' }}
                w="auto"
                leftIcon={<MdLibraryAdd fontSize="22px" />}
                borderRadius="none"
                onClick={addReasonHandler}
              >
                New Reason
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchReasonApi={fetchReasonApi}
                  getReasonHandler={getReasonHandler}
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

export default ReasonManagement

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    mainMenuId: yup.number().required('Main Menu is required'),
    reasonName: yup.string().required('Reason is required'),
  }),
})

const currentUser = decodeUser()

const DrawerComponent = (props) => {
  const { isOpen, onClose, getReasonHandler, editData } = props
  const [menu, setMenu] = useState([])
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
        mainMenuId: '',
        reasonName: '',
        addedBy: currentUser?.userName,
      },
    },
  })

  // FETCH MAIN MENU
  const fetchMenu = async () => {
    try {
      const res = await request.get('Module/GetAllActiveMainMenu')
      setMenu(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    try {
      fetchMenu()
    } catch (error) {}
  }, [])

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === '') {
        delete data.formData['id']
        const res = await request
          .post('Reason/AddNewReason', data.formData)
          .then((res) => {
            ToastComponent('Success', 'New Reason created!', 'success', toast)
            getReasonHandler()
            onClose()
          })
          .catch((err) => {
            ToastComponent('Error', err.response.data, 'error', toast)
            data.formData.id = ''
          })
      } else {
        const res = await request
          .put(`Reason/UpdateReason`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'Reason Updated', 'success', toast)
            getReasonHandler()
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
          reasonName: editData?.reasonName,
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
            <DrawerHeader borderBottomWidth="1px">Reason Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Main Menu:</FormLabel>

                  {menu.length > 0 ? (
                    <Select
                      {...register('formData.mainMenuId')}
                      placeholder="Select Main Menu"
                    >
                      {menu.map((mods) => (
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
                  <FormLabel>Reason:</FormLabel>
                  <Input
                    {...register('formData.reasonName')}
                    placeholder="Please enter Reason name"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.reasonName?.message}
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
