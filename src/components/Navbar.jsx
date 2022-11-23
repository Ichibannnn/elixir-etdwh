import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ navBarData }) => {
  var navigate = useNavigate();

  return (
    <Flex bg="secondary" h="37px" p={1} alignItems="center" boxShadow="sm">
      {/* Navbar Submenu */}
      {navBarData?.subCategory?.map((navbar) => (
        <Button
          bgColor="secondary"
          onClick={() => navigate(navbar.path)}
          _hover={{ bg: "#616161" }}
          borderRadius="0%"
          size="sm"
        >
          <Text className="font" color="#D6D6D6">
            {navbar.subname}
          </Text>
        </Button>
      ))}
    </Flex>
  );
};

export default Navbar;
