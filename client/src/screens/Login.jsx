import React, { useContext, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

import { useNavigate } from "react-router-dom";
import axiosinstance from "../config/axios";
import { UserContext } from "../context/UserContext";


const Login = () => {


  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {setUser}= useContext(UserContext);

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosinstance.post(`/users/login`, loginData);
      
      if(res.status === 200){
        setLoginData({email:"",password:""});
        setUser(res.data.user);
        localStorage.setItem("Token",JSON.stringify(res.data.token));
        navigate("/");
        
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    const res = await axiosinstance.post(`/users/register`, {email:registerData.email,password:registerData.password});
    if(res.status === 201){
      setRegisterData({email:"",password:"",confirmPassword:""});
      setUser(res.data.user);
      localStorage.setItem("Token",JSON.stringify(res.data.token));
      navigate("/");
      
    }

  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-black">
      <div className="border-2 border-gray-600 p-6 rounded-lg shadow-md w-[400px]">
        <Tabs defaultValue="Login" className="w-full ">
          <TabsList className="w-full mb-4 bg-white/25 p-4 1">
            <TabsTrigger value="Login" className="flex-1 mr-2 my-2">
              Login
            </TabsTrigger>
            <TabsTrigger value="Register" className="flex-1 ">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4  bg-green-800 text-white rounded-md hover:bg-zinc-700"
              >
                Login
              </button>
            </form>
          </TabsContent>
          <TabsContent value="Register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-white "
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-green-800 text-white rounded-md hover:bg-zinc-700"
              >
                Register
              </button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
