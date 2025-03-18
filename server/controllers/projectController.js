
import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import { addUserToProject, createProject, getAllProjectByUserId, getProjectById } from '../services/projectService.js';

export const createProjectController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name } = req.body;

        const loggedInuser= await User.findOne({email:req.user.email});
        const userId= loggedInuser._id;
        
        const newProject = await createProject(name, userId);
        res.status(201).json({ newProject });
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        
    }
}


export const getAllProjectController = async (req, res) => {
    try {
        const loggedInuser= await User.findOne({email:req.user.email});
        const userId= loggedInuser._id;
        const allUserProjects = await getAllProjectByUserId(userId);
        res.status(200).json({ projects:allUserProjects });
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        
    }
}


export const addUserToProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { projectId, users } = req.body;
        const loggedInuser= await User.findOne({email:req.user.email});
        const userId= loggedInuser._id;
        const project = await addUserToProject(projectId, users, userId);
        res.status(200).json({ project });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
        
    }
    
}

export const getProjectController = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await getProjectById({projectId});
        res.status(200).json({ project });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
        
    }
}