import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { sidebarData } from "../SidebarData";

//Header
const SidebarHeader = () => {
  return (
    <Flex
      h="150px"
      flexDirection="column"
      alignItems="center"
      gap={1}
      mt={3}
      pt={2}
    >
      <Image
        boxSize="100px"
        objectFit="cover"
        src="/images/elixirlogos.png"
        alt="etheriumlogo"
        mt={1}
      />
      <Text className="logo-title" color="#D1D2D5" mt={-1}>
        ELIXIR ETD
      </Text>
    </Flex>
  );
};

//ListMenu
const SidebarListMenu = ({ setNavbarData }) => {
  var navigate = useNavigate();

  const showSideBarList = (sidebarList) => {
    setNavbarData(sidebarList);

    navigate("/");
  };

  return (
    <Flex h="800px" mt={10} flexDirection="column" pl={2}>
      {sidebarData.map((sidebarList, o) => (
        <Button
          size="sm"
          bgColor="primary"
          justifyContent="left"
          onClick={() => showSideBarList(sidebarList)}
          _hover={{ bg: "form", color: "black" }}
          _focus={{ bg: "form", color: "black" }}
          w="full"
          borderRadius="0%"
        >
          <Text className="font">{sidebarList.name}</Text>
        </Button>
      ))}
    </Flex>
  );
};

//Footer
const SidebarFooter = () => {
  return (
    <Flex h="40px" fontSize="10px" textAlign="center" p={2}>
      © 2022, Elixir ETD Powered by Process Automation (MIS)
    </Flex>
  );
};

const Sidebar = ({ setNavbarData }) => {
  return (
    <Flex h="100vh" w="240px" bg="primary" color="#D1D2D5" boxShadow="md">
      <Flex flexDirection="column">
        <SidebarHeader />
        <SidebarListMenu setNavbarData={setNavbarData} />
        <SidebarFooter />
      </Flex>
    </Flex>

    // <div>Sidebar</div>
  );
};

export default Sidebar;
