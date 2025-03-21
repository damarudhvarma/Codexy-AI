import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../screens/Login';
import Home from '../screens/Home';
import Projects from '../screens/Projects';


const AppRoutes = () => {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/project" element={<Projects/>} />
      </Routes>
      </BrowserRouter>
  )
}

export default AppRoutes