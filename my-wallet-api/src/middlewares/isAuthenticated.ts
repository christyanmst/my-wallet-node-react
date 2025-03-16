import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const authToken = req.headers.authorization;

    if (!authToken) {
        res.status(401).json({ error: "Token missing" });
        return;
    }

    const token = authToken.split(" ")[1];

    if (!process.env.JWT_SECRET) {
        res.status(500).json({ error: "JWT secret is not defined" });
        return;
    }

    try {
        const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload;
        req.user_id = Number(sub);
        next();
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
