import prismaClient from "../prisma";

class UserRepository {
  async findUserByEmail(email: string) {
    const userInfo = await prismaClient.user.findFirst({
      where: {
        email,
      },
      select: {
        username: true,
        email: true,
        id: true,
        password: true,
      },
    });

    return userInfo;
  }

  async findUserById(userId: number) {
    const userInfo = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        username: true,
        email: true,
        id: true,
      },
    });

    return userInfo;
  }

  async createUser(params: {
    username: string;
    email: string;
    passwordHash: string;
  }) {
    await prismaClient.user.create({
      data: {
        username: params.username,
        email: params.email,
        password: params.passwordHash,
      },
    });
  }
}

export { UserRepository };
