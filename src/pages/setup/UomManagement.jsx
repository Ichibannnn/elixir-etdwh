import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FcAutomatic } from "react-icons/fc";
import { GiWeight } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import { useEffect } from "react";
import { useState } from "react";
import { AiTwotoneEdit, AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import Swal from "sweetalert2";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";

const UomManagement = () => {
  const [uom, setUOM] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState({
    id: "",
    uoM_Code: "",
    uoM_Description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
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
  });

  //SHOW DATA TABLE
  const getOUMHandler = async (pageNumber, pageSize, search) => {
    const response = await request.get(
      `Uom/GetAllUomWithPaginationOrig/true?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`
    );

    return response.data;
  };

  const getOUMHandlerData = () => {
    getOUMHandler(currentPage, pageSize, search).then((res) => {
      setUOM(res);
      setIsLoading(false);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getOUMHandlerData();

    return () => {
      setUOM();
    };
  }, [currentPage, pageSize, search]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  //SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  //ADD UOM
  const addUOMHandler = () => {
    setEditData({
      id: "",
      uoM_Code: "",
      uoM_Description: "",
    });
    onOpen();
  };

  //EDIT DATA TABLE
  const editHandler = (edit) => {
    onOpen();
    setEditData({
      id: edit.id,
      uoM_Code: edit.uoM_Code,
      uoM_Description: edit.uoM_Description,
    });
  };

  //DELETE DATA
  const deleteUOMHandler = (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((confirmButtonText, showCancelButton) => {
        if (confirmButtonText.isConfirmed) {
          request.delete(`Uom/DeleteUom/${id}`);

          Swal.fire("Deleted!", "Your file has been deleted.", "success");

          getOUMHandlerData();
        } else {
          console.log("Not deleted");
        }
      });
    } catch (error) {}
  };

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
        alignItems="center"
        pl={2}
        fontSize="15px"
        fontWeight="bold"
      >
        {/* <GiWeight size="25px" /> */}
        <Text>UOM Management</Text>
      </Flex>

      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex flexDirection="row" justifyContent="space-between">
            <InputGroup size="xs">
              <InputLeftElement
                pointerEvents="none"
                children={<FaSearch color="gray.300" />}
              />
              <Input
                borderRadius="none"
                w="20%"
                size="xs"
                type="text"
                bg="gray.200"
                placeholder="Search: Description"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </InputGroup>

            {/* <Button
              size="xs"
              bg="teal.400"
              color="#fff"
              _hover={{ bg: "teal.300" }}
              // bgColor="blackAlpha.400"
              // color="blackAlpha.900"
              w="7%"
              leftIcon={<AiOutlinePlus />}
              borderRadius="none"
              onClick={addUOMHandler}
            >
              New UOM
            </Button> */}
          </Flex>

          <Flex w="full">
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
                  variant="striped"
                  width="full"
                  border="none"
                  boxShadow="md"
                >
                  <Thead bg="secondary">
                    <Tr fontSize="15px">
                      <Th color="#D6D6D6" fontSize="8px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="8px">
                        UOM
                      </Th>
                      <Th color="#D6D6D6" fontSize="8px">
                        Description
                      </Th>
                      <Th color="#D6D6D6" fontSize="8px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="8px">
                        Added by
                      </Th>
                      <Th color="#D6D6D6" fontSize="8px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {uom?.uom
                      .map((showData, i) => (
                        <Tr key={i}>
                          <Td fontSize="11px">{showData.id}</Td>
                          <Td fontSize="11px">{showData.uoM_Code}</Td>
                          <Td fontSize="11px">{showData.uoM_Description}</Td>
                          <Td fontSize="11px">{showData.dateAdded}</Td>
                          <Td fontSize="11px">{showData.addedBy}</Td>
                          <Td>
                            <HStack>
                              <Button p={0} bg="none" size="xs">
                                <AiTwotoneEdit
                                  onClick={() => editHandler(showData)}
                                />
                              </Button>

                              <Button p={0} bg="none" size="xs">
                                <AiFillDelete
                                  onClick={() => deleteUOMHandler(showData.id)}
                                />
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))
                      .reverse()}
                  </Tbody>
                </Table>
              )}
            </PageScroll>
          </Flex>
        </Flex>
      </Flex>

      {/* Props */}
      {isOpen && (
        <DrawerComponent
          isOpen={isOpen}
          onClose={onClose}
          editData={editData}
          setEditData={setEditData}
          getOUMHandlerData={getOUMHandlerData}
          deleteUOMHandler={deleteUOMHandler}
        />
      )}

      <Flex justifyContent="space-between">
        <Button
          size="sm"
          bg="teal.400"
          color="#fff"
          _hover={{ bg: "teal.300" }}
          // bgColor="blackAlpha.400"
          // color="blackAlpha.900"
          w="8%"
          leftIcon={<AiOutlinePlus />}
          borderRadius="none"
          onClick={addUOMHandler}
        >
          New UOM
        </Button>

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
                _hover={{ bg: "green", color: "white" }}
                size="sm"
              >
                {"<<"}
              </PaginationPrevious>
              <PaginationPageGroup ml={1} mr={1}>
                {pages.map((page) => (
                  <PaginationPage
                    _hover={{ bg: "green", color: "white" }}
                    _focus={{ bg: "green" }}
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
                  _hover={{ bg: "green", color: "white" }}
                  size="sm"
                  mb={2}
                >
                  {">>"}
                </PaginationNext>
                <Select
                  onChange={handlePageSizeChange}
                  bg="#FFFFFF"
                  size="sm"
                  mb={2}
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
  );
};

export default UomManagement;

const DrawerComponent = (props) => {
  const { isOpen, onClose, setEditData, editData, getOUMHandlerData } = props;

  const submitHandler = async () => {
    if (editData.id) {
      //EDIT - PUT
      const submitData = {
        id: editData.id,
        uoM_Code: editData.uoM_Code,
        uoM_Description: editData.uoM_Description,
      };
      const id = editData.id;
      const res = await request.put(`Uom/UpdateUom/${id}`, submitData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successfully updated UOM!",
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
      getOUMHandlerData();
    } else if (editData.id === "") {
      delete editData["id"];
      const res = await request.post("Uom/AddNewUOM", editData);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successfully added UOM!",
        showConfirmButton: false,
        timer: 1500,
      });

      onClose();
      getOUMHandlerData();
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClick={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>UOM Information</DrawerHeader>

          <DrawerBody>
            <Text fontSize="sm">UOM Name</Text>
            <Input
              size="sm"
              value={editData.uoM_Code}
              placeholder="Enter UOM Name"
              onChange={(e) =>
                setEditData({
                  id: editData.id,
                  uoM_Code: e.target.value,
                  uoM_Description: editData.uoM_Description,
                })
              }
            />

            <Text fontSize="sm">UOM Description</Text>
            <Input
              size="sm"
              value={editData.uoM_Description}
              placeholder="Enter UOM Description Name"
              onChange={(e) =>
                setEditData({
                  id: editData.id,
                  uoM_Code: editData.uoM_Code,
                  uoM_Description: e.target.value,
                })
              }
            />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" size="sm" onClick={submitHandler}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
