import { Route, Routes } from "react-router-dom"
import { Chat } from "../pages/chat/Chat"
import { Login } from "../pages/login/Login"

export const AppRouter = () => {
  return (
    <Routes>
        <Route path="/chat/*" element={ <Chat /> } />
        <Route path="/*" element={ <Login /> } />
    </Routes>
  )
}