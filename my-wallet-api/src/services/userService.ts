import { compare, hash } from "bcryptjs";
import { CreateUserRequest, AuthRequest, AuthResponse } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";

class UserService {
  async createUser({
    username,
    email,
    password,
  }: CreateUserRequest): Promise<string> {
    if (!(username && email && password)) {
      throw Object.assign(new Error("Missing Parameters"), { httpStatus: 400 });
    }

    const userRepository = new UserRepository();

    const userAlreadyExists = await userRepository.findUserByEmail(email);

    if (userAlreadyExists) {
      throw Object.assign(new Error("User already exists"), {
        httpStatus: 400,
      });
    }

    const passwordHash = await hash(password, 8);

    await userRepository.createUser({
      username,
      email,
      passwordHash,
    });

    return "added";
  }

  async authenticate({ email, password }: AuthRequest): Promise<AuthResponse> {
    if (!(email && password)) {
      throw Object.assign(new Error("Missing Parameters"), { httpStatus: 400 });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw Object.assign(new Error("Credential Error"), { httpStatus: 401 });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw Object.assign(new Error("Credential Error"), { httpStatus: 401 });
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}

export { UserService };
