import { Router } from "express";
import { UserController } from "./controllers/userController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
router.post("/users", userController.createUser.bind(userController));
router.post('/login', userController.authenticate.bind(userController));
router.get('/my-profile', isAuthenticated, userController.myProfile.bind(userController));

export { router };
