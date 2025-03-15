import  jwt  from "jsonwebtoken";
import redisClient from "../services/redisService.js";


export const  authUser = async (req,res,next)=>{
 try {

      const token =req.cookies.token || req.headers.authorization.split(' ')[1];
    
     if(!token){
        return res.status(401).json({error:"unauthorized access"});
     }

     const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            res.cookie('token', '');
            return res.status(401).json({error:"unauthorized User"});
        }


    const decode= jwt.verify(token,process.env.CODEXY_SECRET);
    req.user = decode;
    next();
    
 } catch (error) {
    console.log(error)
    res.status(401).json({error:"unauthorized access"});
 }
    
} 