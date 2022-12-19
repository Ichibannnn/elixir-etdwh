import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Flex
      h="100vh"
      alignItems="center"
      justifyContent="center"
      bg="background"
      flexDirection="column"
      gap={5}
    >
      <Heading color="blue.300">PAGE NOT FOUND</Heading>
      <Button
        w="15%"
        size="sm"
        fontSize="13px"
        colorScheme="blue.300"
        variant="outline"
        onClick={() => {
          navigate("/login");
        }}
      >
        Back to login
      </Button>
    </Flex>
  );
};

export default ErrorPage;
