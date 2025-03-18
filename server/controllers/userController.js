import { validationResult } from "express-validator"
import { createUser, getAllUser } from "../services/userServices.js";
import User from "../models/userModel.js";
import redisClient from "../services/redisService.js";





export const createUserController =  async(req,res)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    try{
        const {email,password} = req.body;
        const user = await createUser({email,password});
        const token = await user.generateToken();
        delete user._doc.password;
        return res.status(201).json({user,token});

    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Something went wrong"});
    }
}




export const userLoginController = async (req,res)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    try{
        const {email,password} = req.body;
        const user = await  User.findOne({email}).select('+password');;
        if(!user){
            return res.status(401).json({error:"Invalid credentials"});
        }
        const ismatch= await user.isValidPassword(password)
        if(!ismatch){
            return res.status(401).json({error:"Invalid credentials"});
        }
        const token = await user.generateToken();
        delete user._doc.password;
        return res.status(200).json({user,token});
    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Something went wrong"});
    }
}; 



export const profileController= async(req,res)=>{
    
    res.status(200).json({user:req.user});
}


export const logoutController = async(req,res)=>{
  try {
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({error:"unauthorized access"});
    }
    redisClient.set(token,"logout",'EX',60*60*24);
    return res.status(200).json({message:"Logged out successfully"});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"Something went wrong"});    
  }

}


export const getAllUsersController = async(req,res)=>{
    try {
        const loggedInUser= await User.findOne({email:req.user.email});
        const userId = loggedInUser._id;

        const getAllUsers= await getAllUser({userId});
        return res.status(200).json({users:getAllUsers});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Something went wrong"});
        
    }
}
