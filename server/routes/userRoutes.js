import { Router } from "express";
import { createUserController, getAllUsersController, logoutController, profileController, userLoginController } from "../controllers/userController.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/authMiddleware.js";



const userRouter= Router();


userRouter.post("/register",
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
    ,createUserController);

userRouter.post("/login",body("email").isEmail().withMessage("Email is not valid"),body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),userLoginController);

userRouter.get("/profile",authUser,profileController);

userRouter.get("/logout",authUser,logoutController);

userRouter.get("/all",authUser,getAllUsersController);


export default userRouter;