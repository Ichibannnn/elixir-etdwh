import { Flex, Table, Text, Th, Thead } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const MainContent = () => {
  return (
    <Flex w="100%" h="100vh" bg="background" p={5}>
      <Outlet />
    </Flex>

    // <div>MainContent</div>
  );
};

export default MainContent;
