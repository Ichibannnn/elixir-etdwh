import { Flex } from "@chakra-ui/react";
import React from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const MainContainer = () => {
  const [navBarData, setNavbarData] = useState([]);

  return (
    <Flex bgColor="background" h="100vh">
      <Sidebar setNavbarData={setNavbarData} />
      <Flex flexDirection="column" width="full">
        <Header />
        <Navbar navBarData={navBarData} />
        <MainContent />
      </Flex>
    </Flex>
  );
};

export default MainContainer;
