import { Router } from "express";
import { UserController } from "./controllers/userController";
router.post("/users", userController.createUser.bind(userController));

export { router };
