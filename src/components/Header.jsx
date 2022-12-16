import { Flex, HStack, Icon, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { decodeUser } from "../services/decode-user";

const Header = ({ setSidebarHandler }) => {
  const user = decodeUser();
  var navigate = useNavigate();

  const logoutHandler = () => {
    Swal.fire({
      title: "Are you sure to logout?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("userToken");
        navigate("/login");
      }
    });
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
        <Flex>
          <Text className="font" color="#fff">
            Welcome, {`${user && user?.fullName}`}!
          </Text>
        </Flex>

        <Image
          boxSize="33px"
          objectFit="cover"
          src="/images/user.png"
          alt="lot"
          onClick={logoutHandler}
        />
      </HStack>
    </Flex>
  );
};

export default Header;
