import { compare, hash } from "bcryptjs";
import {
  CreateUserRequest,
  AuthRequest,
  AuthResponse,
  MyProfileRequest,
  MyProfileResponse,
} from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { sign } from "jsonwebtoken";

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

    const token = sign(
      {
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: String(user.id),
        expiresIn: "15d",
      }
    );

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
  }

  async myProfile({ userId }: MyProfileRequest): Promise<MyProfileResponse> {
    if (!userId) {
      throw Object.assign(new Error("Missing Parameters"), { httpStatus: 400 });
    }

    const userRepository = new UserRepository();

    const userInfo = await userRepository.findUserById(userId);

    return userInfo;
  }
}

export { UserService };
