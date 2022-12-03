import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ navBarData }) => {
  var navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(pathname);

  return (
    <Flex bg="secondary" h="37px" p={1} alignItems="center" boxShadow="sm">
      {/* Navbar Submenu */}
      {navBarData?.subCategory?.map((navbar, i) => (
        <Button
          key={i}
          bgColor={pathname.includes(navbar.path) ? "buttonColor" : "secondary"}
          onClick={() => navigate(navbar.path)}
          _hover={{ bg: "#616161" }}
          borderRadius="0%"
          size="sm"
        >
          <Text className="font" color="#ffff">
            {navbar.subname}
          </Text>
        </Button>
      ))}
    </Flex>
  );
};

export default Navbar;
