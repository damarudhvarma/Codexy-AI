import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../screens/Login';
import Home from '../screens/Home';
import Projects from '../screens/Projects';
import UserAuth from '../auth/userAuth';


const AppRoutes = () => {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserAuth><Home /></UserAuth>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/project" element={<UserAuth><Projects/></UserAuth>} />
      </Routes>
      </BrowserRouter>
  )
}

export default AppRoutes