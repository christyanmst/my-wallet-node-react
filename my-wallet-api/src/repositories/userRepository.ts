import prismaClient from "../prisma";

class UserRepository {
    async findUserByEmail(email: string) {
        const userInfo = await prismaClient.user.findFirst({
            where: {
                email
            }
        });

        return userInfo;
    }

    async createUser(params: {username: string, email: string, passwordHash: string }) {
        await prismaClient.user.create({
            data: {
                username: params.username,
                email: params.email,
                password: params.passwordHash
            }
        })
    }
}

export { UserRepository }
