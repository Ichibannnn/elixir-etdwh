import { Box, Button, Flex, HStack, Input, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import React from 'react'
import { BiImport } from 'react-icons/bi';


const ImportPO = () => {


  return (
    <Flex bg="form" w="full" boxShadow="md" flexDirection="column">
      <Flex justifyContent="space-between">
        <Box />
        <Box p={2}>
          <Button leftIcon={<BiImport fontSize="19px" />} colorScheme="green" borderRadius="none" fontSize="12px" size="sm">
            Import Purchase Order
          </Button>
        </Box>
      </Flex>

      <Flex w="100%" p={2} h='full' mt={-4} flexDirection="column">
        <Flex  w="100%" h='95%' border="2px" borderColor="secondary"  borderWidth="3px" >     
          <Table>
            <Thead bg="secondary" >
              <Tr>
                <Th color="white" fontSize="9px">PR Number</Th>
                <Th color="white" fontSize="9px">PR Date</Th>
                <Th color="white" fontSize="9px">PO Number</Th>
                <Th color="white" fontSize="9px">PO Date</Th>
                <Th color="white" fontSize="9px">Item Code</Th>
                <Th color="white" fontSize="9px">Item Description</Th>
                <Th color="white" fontSize="9px">Qty Ordered</Th>
                <Th color="white" fontSize="9px">Qty Delivered</Th>
                <Th color="white" fontSize="9px">Qty Billed</Th>
                <Th color="white" fontSize="9px">UOM</Th>
                <Th color="white" fontSize="9px">Unit Price</Th>
                <Th color="white" fontSize="9px">Supplier</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Flex>

          <Box p={1} bg="secondary" > 
            <Input color="white" type="file" w="25%" size="25px" justifyContent="center" alignItems="center" fontSize="13px"></Input>
          </Box>
      </Flex>

    </Flex>
  )
}

export default ImportPO