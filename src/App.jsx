import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

//Component Main Container
import Login from './components/Login'
import MainContainer from './components/MainContainer'
import UomManagement from './pages/setup/UomManagement'
import LotManagement from './pages/setup/LotManagement'
import UserAccount from './pages/UserManagement/UserAccount'
import Department from './pages/UserManagement/Department'
import ProtectedRoutes from './utils/ProtectedRoutes'
import ErrorPage from './pages/ErrorPage'
import UserRole from './pages/UserManagement/UserRole'
import ModuleManagement from './pages/UserManagement/ModuleManagement'
import MenuManagement from './pages/UserManagement/MenuManagement'
import MaterialsManagement from './pages/setup/MaterialsManagement'
import CustomersManagement from './pages/setup/CustomersManagement'
import SuppliersManagement from './pages/setup/SuppliersManagement'
import ItemCategory from './pages/setup/ItemCategory'
import { Context } from './components/context/Context'

//LANDING PAGE
import UserManagementPage from './UserManagementPage'
import SetupManagementPage from './SetupManagementPage'
import LotCategory from './pages/setup/LotCategory'
import CustomerType from './pages/setup/CustomerType'
import ReasonManagement from './pages/setup/ReasonManagement'
import AccountTitlePage from './AccountTitlePage'
import CompanyManagement from './pages/account_title/CompanyManagement'


const App = () => {
  const [menu, setMenu] = useState(null)

  return (
    <Context.Provider value={{ menu, setMenu }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>

          <Route path="/" element={<MainContainer />}>
            <Route path="/setup" element={<SetupManagementPage />}>
              <Route path="/setup/uom-management" element={<UomManagement />} />
              <Route path="/setup/materials-management" element={<MaterialsManagement />}/>
              <Route path="/setup/item-category" element={<ItemCategory />} />
              <Route path="/setup/suppliers-management" element={<SuppliersManagement />}/>
              <Route path="/setup/customers-management" element={<CustomersManagement />}/>
              <Route path="/setup/customer-type" element={<CustomerType />} />
              <Route path="/setup/lot-management" element={<LotManagement />} />
              <Route path="/setup/lot-category" element={<LotCategory />} />
              <Route path="/setup/reason-management" element={<ReasonManagement />} />
            </Route>

            <Route path="/user" element={<UserManagementPage />}>
              <Route path="/user/user-account" element={<UserAccount />} />
              <Route path="/user/user-role" element={<UserRole />} />
              <Route path="/user/department" element={<Department />} />
              <Route path="/user/module-management" element={<ModuleManagement />}/>
              <Route path="/user/menu-management" element={<MenuManagement />}/>
            </Route>

            <Route path="/account-title" element={<AccountTitlePage />}>
              <Route path="/account-title/company-management" element={<CompanyManagement />} />
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>
    </Context.Provider>
  )
}

export default App
