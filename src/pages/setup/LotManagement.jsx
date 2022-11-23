import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FcAutomatic } from "react-icons/fc";

const LotManagement = () => {
  return (
    <Flex color="fontColor" className="moduleTitle" h="full" w="full">
      <Flex h="40px" w="full" bg="#CBD5E0" alignItems="center" pl={2} gap={1}>
        <Image
          boxSize="20px"
          objectFit="cover"
          src="/images/lot.png"
          alt="lot"
        />
        <Text>Lot Management</Text>
      </Flex>
    </Flex>
  );
};

export default LotManagement;
