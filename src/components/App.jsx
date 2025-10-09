import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import  '../css/App.css'
import Login from './Login'
import Home from './Home'
import Register from './Register'
import PrivateRoute from './PrivateRoute'
import Home2 from './Home'
import ComercioLogin from './ComercioLogin'
import UserProfile from "./UserProfile";
import ComercioDetalle from './ComercioDetalle'
function App() {

 
  return (
    <>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/register" element = {<Register/>}/>
      <Route path = "/home2" element = {<Home2/>}/>
      <Route path="/comercio/:id" element={<ComercioDetalle />} />
      <Route path = "/comercioLogin" element = {<ComercioLogin/>}/>
      <Route
  path="/profile"
  element={
    <PrivateRoute>
      <UserProfile hideActions={false} />
    </PrivateRoute>
  }
/>
      
    </Routes>
      
    </>
  )
}

export default App 
