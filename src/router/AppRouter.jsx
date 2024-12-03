import { Route, Routes } from "react-router-dom"
import { Login } from "../pages/login/Login"
import { AppRouterPrivate } from "./AppRouterPrivate"

export const AppRouter = () => {
  return (
    <Routes>
        <Route path="/chat/*" element={ <AppRouterPrivate /> } />
        <Route path="/*" element={ <Login /> } />
    </Routes>
  )
}