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

const LotManagement = () => {
  const [lots, setLots] = useState([])
  const [editData, setEditData] = useState([])
  const [status, setStatus] = useState(true)
  const [search, setSearch] = useState('')
  const toast = useToast()
  const currentUser = decodeUser()

  const [isLoading, setIsLoading] = useState(true)
  const [pageTotal, setPageTotal] = useState(undefined)
  const [disableEdit, setDisableEdit] = useState(false)

  // FETCH API LOT CATEGORY:
  const fetchLotApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Lot/GetAllLotNameWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`,
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
    console.log(id)
    console.log(isActive)
    if (isActive) {
      routeLabel = 'InActiveLotName'
    } else {
      routeLabel = 'ActivateLotName'
    }

    request
      .put(`Lot/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent('Success', 'Status updated', 'success', toast)
        getLotHandler()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //SHOW LOT DATA----
  const getLotHandler = () => {
    fetchLotApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false)
      setLots(res)
      setPageTotal(res.totalCount)
    })
  }

  useEffect(() => {
    getLotHandler()

    return () => {
      setLots([])
    }
  }, [currentPage, pageSize, status, search])

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue)
    console.log(inputValue)
  }

  //ADD LOT HANDLER---
  const addLotHandler = () => {
    setEditData({
      id: '',
      lotNameCode: '',
      lotCategoryId: '',
      sectionName: '',
      addedBy: currentUser.userName,
      modifiedBy: '',
    })
    onOpen()
    setDisableEdit(false)
  }

  //EDIT LOT--
  const editLotHandler = (lotname) => {
    setDisableEdit(true)
    setEditData(lotname)
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
              <InputGroup size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaSearch color="black" />}
                />
                <Input
                  borderRadius="none"
                  size="sm"
                  type="text"
                  placeholder="Search: Section Name"
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
                        Lot Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Lot Name
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Section Name
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
                    {lots?.lotname?.map((lot, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{lot.id}</Td>
                        <Td fontSize="11px">{lot.lotNameCode}</Td>
                        <Td fontSize="11px">{lot.lotCategory}</Td>
                        <Td fontSize="11px">{lot.sectionName}</Td>
                        <Td fontSize="11px">{lot.addedBy}</Td>
                        <Td fontSize="11px">{lot.dateAdded}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                onClick={() => editLotHandler(lot)}
                                bg="none"
                                title="Edit"
                              >
                                <AiTwotoneEdit />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      <Button
                                        bg="none"
                                        p={0}
                                        title="Active/Inactive"
                                      >
                                        <GiChoice  />
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
                                            {lot.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this Lot Name inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this Lot Name active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  lot.id,
                                                  lot.isActive,
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
                leftIcon={<MdLibraryAdd fontSize="22px" />}
                borderRadius="none"
                onClick={addLotHandler}
              >
                New Lot
              </Button>

              {/* PROPS */}
              {isOpen && (
                <DrawerComponent
                  isOpen={isOpen}
                  onClose={onClose}
                  fetchLotApi={fetchLotApi}
                  getLotHandler={getLotHandler}
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

export default LotManagement

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string(),
    lotNameCode: yup.string().required('Lot Code is required'),
    lotCategoryId: yup.string().required('Lot Name is required'),
    sectionName: yup.string().required('Section Name is required'),
  }),
})

const currentUser = decodeUser()

const DrawerComponent = (props) => {
  const { isOpen, onClose, getLotHandler, editData, disableEdit } = props
  const toast = useToast()
  const [lotName, setLotName] = useState([])

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
        lotNameCode: '',
        lotCategoryId: '',
        sectionName: '',
        addedBy: currentUser?.userName,
        modifiedBy: '',
      },
    },
  })

  const fetchLot = async () => {
    try {
      const res = await request.get('Lot/GetAllActiveLotCategories')
      setLotName(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    try {
      fetchLot()
    } catch (error) {}
  }, [])

  const submitHandler = async (data) => {
    try {
      if (data.formData.id === '') {
        delete data.formData['id']
        const res = await request
          .post('Lot/AddNewLotName', data.formData)
          .then((res) => {
            ToastComponent(
              'Success',
              'Lot created!',
              'success',
              toast,
            )
            getLotHandler()
            onClose()
          })
          .catch((err) => {
            ToastComponent('Error', err.response.data, 'error', toast)
            data.formData.id = ''
          })
      } else {
        const res = await request
          .put(`Lot/UpdateLotName`, data.formData)
          .then((res) => {
            ToastComponent('Success', 'Lot Updated', 'success', toast)
            getLotHandler()
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
          lotNameCode: editData?.lotNameCode,
          lotCategoryId: editData?.lotCategoryId,
          sectionName: editData?.sectionName,
          modifiedBy: currentUser.userName,
        },
        { shouldValidate: true },
      )
    }
  }, [editData])

  console.log(lotName)

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Lot Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Lot Code:</FormLabel>
                  <Input
                    {...register('formData.lotNameCode')}
                    placeholder="Please enter Lot Code"
                    autoComplete="off"
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    _disabled={{ color: 'black' }}
                    bgColor={disableEdit && 'gray.300'}
                    autoFocus
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.lotNameCode?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Lot Name:</FormLabel>
                  {lotName.length > 0 ? (
                    <Select
                      {...register('formData.lotCategoryId')}
                      placeholder="Select Lot Name"
                    >
                      {lotName.map((ln) => (
                        <option key={ln.id} value={ln.id}>
                          {ln.lotCategoryName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    'loading'
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.lotCategoryId?.message}
                  </Text>
                </Box>
                <Box>
                  <FormLabel>Section Name:</FormLabel>
                  <Input
                    {...register('formData.sectionName')}
                    placeholder="Please enter Section Name"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.sectionName?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isValid} colorScheme="blue">
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  )
}
