import { Request, Response } from "express";
import { UserService } from "../services/userService";

class UserController {
  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    const userService = new UserService();

    const auth = await userService.authenticate({
      email,
      password,
    });

    return res.json(auth);
  }

  async createUser(req: Request, res: Response) {
    const { username, email, password } = req.body;

    const userService = new UserService();

    const user = await userService.createUser({ username, email, password });

    return res.json(user);
  }

}

export { UserController };
