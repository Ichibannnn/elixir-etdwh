import { Flex, HStack, Icon, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { decodeUser } from "../services/decode-user";

const Header = (props) => {
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

  console.log(user);

  return (
    <Flex
      h="40px"
      bgColor="primary"
      alignItems="center"
      justifyContent="center"
    >
      <GiHamburgerMenu color="#D1D2D5" w="40%" alignItems="center" />

      <Flex height="54px" w="84%" alignItems="center"></Flex>

      <Text className="font" color="#fff">
        Welcome, {`${user && user?.fullName}`}!
      </Text>
      <Image
        boxSize="37px"
        objectFit="cover"
        src="/images/userlogout.png"
        alt="lot"
        onClick={logoutHandler}
      />

      {/* <HStack>
        <Icon as={HiUserCircle} w={7} h={7} color="#D1D2D5" />
      </HStack> */}
    </Flex>
  );
};

export default Header;
