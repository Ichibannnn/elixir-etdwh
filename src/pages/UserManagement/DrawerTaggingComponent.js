import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Flex,
    Select,
    VStack,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Button,
  } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import request from '../../services/ApiClient'

const DrawerTaggingComponent = ({isOpen, onClose}) => {
  const [mainMenu, setMainMenu ] = useState([])
  const [moduleStatus, setModuleStatus] = useState("")

  // FETCH MAIN MENU
  const fetchMainMenuApi = async () => {
    const res = await request.get(`Module/GetAllActiveMainMenu`)
    return res.data
  }

  // GET/SHOW MAIN MENU
  const getMainMenuHandler = () => {
    fetchMainMenuApi().then(res => {
      setMainMenu(res)
    })
  }

  useEffect(() => {
    getMainMenuHandler()
  }, [])

  const moduleStatusHandler = (data) => {
    if (data) {
      setMainMenu(data)
    }

  }
  

  return (
    <>
    <Flex>
    <Drawer isOpen={isOpen} placement="top" size="full" onClose={onClose}>
      <DrawerOverlay />
      
      <DrawerContent p={7} > 
      <DrawerCloseButton />
      <DrawerHeader>
        Module Tagging
      </DrawerHeader>

      <DrawerBody>
        <Flex w="25%" alignContent="flex-end">
          {
            mainMenu.length > 0 ? (<Select
            placeholder="Select Main Menu"
            onChange={(e) => moduleStatusHandler(e.target.value)}
            >
            {mainMenu.map(menu =>  (
              <option key={menu.id} value={menu.id}>{menu.mainMenu}</option>
            ))}
            </Select>) : "loading"
          }
        </Flex>

        <Flex>
          {/* For List of Tag Modules */}
          <VStack w="50%" mt={4}>
            <Flex>
              <VStack>
                <Text fontWeight="semibold">
                  LIST OF TAGGED MODULES
                </Text>
              </VStack>
            </Flex>

            <Flex>
              <Table size="sm">
                <Thead>
                  <Tr bg="primary">
                    <Td color="white">Id</Td>
                    <Td color="white">Main Menu</Td>
                    <Td color="white">Sub-Menu</Td>
                    <Td color="white">Untag</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Tag Main Menu 1</Td>
                    <Td>TTag Main Menu 1</Td>
                    <Td>Tag Main Menu 1</Td>
                    <Td>Tag Main Menu 1</Td>
                  </Tr>
                  <Tr>
                    <Td>Tag Main Menu 2</Td>
                    <Td>Tag Main Menu 2</Td>
                    <Td>Tag Main Menu 2</Td>
                    <Td>Tag Main Menu 2</Td>
                  </Tr>
                  <Tr>
                    <Td>Tag Main Menu 3</Td>
                    <Td>Tag Main Menu 3</Td>
                    <Td>Tag Main Menu 3</Td>
                    <Td>Tag Main Menu 3</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Flex>
          </VStack>

          {/* For List of Untag Modules */}
          <VStack w="50%" mt={4}>
            <Flex>
              <VStack>
                <Text>
                  LIST OF UNTAGGED MODULES
                </Text>
              </VStack>
            </Flex>

            <Flex>
              <Table size="sm">
                <Thead>
                  <Tr bg="primary" fontWeight="semibold">
                    <Td color="white">Id</Td>
                    <Td color="white">Main Menu</Td>
                    <Td color="white">Sub-Menu</Td>
                    <Td color="white">Untag</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Untag Main Menu 1</Td>
                    <Td>Untag Main Menu 1</Td>
                    <Td>Untag Main Menu 1</Td>
                    <Td>Untag Main Menu 1</Td>
                  </Tr>
                  <Tr>
                    <Td>Untag Main Menu 2</Td>
                    <Td>Untag Main Menu 2</Td>
                    <Td>Untag Main Menu 2</Td>
                    <Td>Untag Main Menu 2</Td>
                  </Tr>
                  <Tr>
                    <Td>Untag Main Menu 3</Td>
                    <Td>Untag Main Menu 3</Td>
                    <Td>Untag Main Menu 3</Td>
                    <Td>Untag Main Menu 3</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Flex>
          </VStack>
        </Flex>
      </DrawerBody>

      <DrawerFooter>
        <Button colorScheme="red" variant="outline" onClick={onClose}>
          Close
        </Button>
      </DrawerFooter>
      </DrawerContent>

    </Drawer>
    </Flex>
    </>
  )
}

export default DrawerTaggingComponent