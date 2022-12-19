import { Flex, HStack, Icon, Image, Text, Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, Box,} from "@chakra-ui/react";
import React, { useState } from "react";
import { RiLogoutBoxLine, RiUser3Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { decodeUser } from "../services/decode-user";
import { ChevronDownIcon } from "@chakra-ui/icons";

const Header = ({ setSidebarHandler }) => {
  const user = decodeUser();
  var navigate = useNavigate();

  const logoutHandler = () => {
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <Flex
      h="40px"
      bgColor="primary"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <HStack>
        <GiHamburgerMenu
          color="#D1D2D5"
          w="40%"
          onClick={() => setSidebarHandler((x) => !x)}
        />
      </HStack>

      <HStack>
        {/* <Flex>
          <Text className="font" color="#fff">
            Welcome, {`${user && user?.fullName}`}!
          </Text>
        </Flex> */}
      
      <Box>
        <Menu>
          <MenuButton alignItems="center" justifyContent="center">
            <Image
              boxSize="33px"
              objectFit="cover"
              src="/images/user.png"
              alt="lot"
            />
          </MenuButton>
          <MenuList>
          <MenuGroup title='Profile:' />
          <MenuDivider/>
            <MenuItem icon={<RiUser3Fill fontSize="17px"/>}>
              <Text fontSize="15px">
               {`${user && user?.fullName}`}
              </Text>
            </MenuItem>
            <MenuItem icon={<RiLogoutBoxLine fontSize="17px"/>} onClick={logoutHandler}>
              <Text fontSize="15px" _hover={{ color: "red" }}>
                Logout
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      </HStack>
    </Flex>
  );
};

export default Header;
