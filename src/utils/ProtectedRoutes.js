import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import MainContainer from '../components/MainContainer'
import MainContent from '../components/MainContent'


const ProtectedRoutes = () => {
let auth = sessionStorage.getItem("userToken")
// let userToken =  {'token':false}

  return (
    auth ? <Outlet /> : <Navigate to="*"/>
  )
}

export default ProtectedRoutes