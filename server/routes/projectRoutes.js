import { Router } from 'express';
import { addUserToProjectController, createProjectController, getAllProjectController } from '../controllers/projectController.js';
import { body } from 'express-validator';
import { authUser } from '../middlewares/authMiddleware.js';

const projectRouter = Router();

 projectRouter.post('/create',
    authUser,    
    body('name').notEmpty().withMessage('Name is required'),
     createProjectController
    );
 projectRouter.get('/all',authUser,getAllProjectController);   
 
 projectRouter.put('/add-user',
    authUser,
    body('projectId').isString().withMessage('Project Id is needed'),
    body('users').isArray({min:1}).withMessage('Users must be an array').custom((user)=>user.every(user=>typeof user==='string')).withMessage('Users must be an array of strings'),
    addUserToProjectController
 );


 








export default projectRouter;