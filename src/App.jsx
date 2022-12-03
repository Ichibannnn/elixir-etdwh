import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import { Routes, Route } from "react-router-dom";

//Component Main Container
import Login from "./components/Login";
import MainContainer from "./components/MainContainer";
import UomManagement from "./pages/setup/UomManagement";
import LotManagement from "./pages/setup/LotManagement";
import UserAccount from "./pages/UserManagement/UserAccount";
import Department from "./pages/UserManagement/Department";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ErrorPage from "./pages/ErrorPage";
import UserRole from "./pages/UserManagement/UserRole";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<MainContainer />}>
          <Route path="/setup/uom-management" element={<UomManagement />} />
          <Route path="/setup/lot-management" element={<LotManagement />} />

          <Route path="/user/user-account" element={<UserAccount />} />
          <Route path="/user/user-role" element={<UserRole />} />
          <Route path="/user/department" element={<Department />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
