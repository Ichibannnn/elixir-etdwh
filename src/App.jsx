import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { Routes, Route } from "react-router-dom";

//Component Main Container
import Login from "./components/Login";
import MainContainer from "./components/MainContainer";
import UomManagement from "./pages/setup/UomManagement";
import LotManagement from "./pages/setup/LotManagement";
import UserAccount from "./pages/UserManagement/UserAccount";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ErrorPage from "./pages/ErrorPage";

const theme = extendTheme({
  colors: {
    primary: "#1B1C1D",
    secondary: "#333333",
    background: "#F6F8FA",
    form: "#FFFFFF",
    fontColor: "#3F444E",
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<MainContainer />}>
            <Route path="/setup/uom-management" element={<UomManagement />} />
            <Route path="/setup/lot-management" element={<LotManagement />} />

            <Route path="/user/user-account" element={<UserAccount />} />
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
    
  );
};

export default App;
