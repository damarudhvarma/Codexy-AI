import mongoose from "mongoose";
import Project from "../models/projectModel.js";


export const createProject= async(name, userId)=>{
 if(!name){
        throw new Error('Name is required');
    }
  if(!userId){
        throw new Error('User is required');
    }

    const project = await Project.create({name, users: [userId]});


    return project;
}


export const getAllProjectByUserId = async(userId)=>{
    if(!userId){
        throw new Error('User is required');
    }
   
    const projects = await Project.find({users: userId});
    
    return projects;
}




export const addUserToProject = async(projectId, users,userId)=>{
    if(!projectId){
        throw new Error('Project Id is required');
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Project Id is invalid');
    }

    if(!users || users.length===0){
        throw new Error('Users are required');
    }

    if(!users.every(user=>mongoose.Types.ObjectId.isValid(user))){
        throw new Error('Users are invalid');
    }
    if(!userId){
        throw new Error('User is required');
    }
    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new Error('User is invalid');
    }

    const project = await Project.findOne({_id:projectId, users:userId});
    if(!project){
        throw new Error('Project not found');
    }

    const updatedProject = await Project.findByIdAndUpdate({
        _id: projectId
    },{
        $addToSet:{
            users: {$each: users}
        }
    },{new: true});
    return updatedProject;
    
    
}


export const getProjectById = async({projectId})=>{

    if(!projectId){
        throw new Error('Project Id is required');
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error('Project Id is invalid');
    }
    const project = await Project.findById(projectId).populate('users');
    return project;
}