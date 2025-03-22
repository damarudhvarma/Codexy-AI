import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext'
import React, { useContext, useEffect, useState } from 'react'

const UserAuth = ({children}) => {
    const {user}= useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const token = JSON.parse(localStorage.getItem("Token"));
    const navigate = useNavigate();

    useEffect(() => {

        if(user){
            setIsLoading(false);
        }

        if(!token){
            navigate("/login");
        }

        if(!user)
        {
            navigate("/login");
        }
    
    })

    if(isLoading){
        return <div>Loading...</div>
    }

  return (
    <>
      {children}
    </>
  )
}

export default UserAuth