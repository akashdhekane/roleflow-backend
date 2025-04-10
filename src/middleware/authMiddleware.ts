import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// ✅ Updated: CustomRequest expects `userId`
interface CustomRequest extends Request {
    user?: JwtPayload & { userId: string; role?: string };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        // ✅ Match against correct key from JWT payload
        if (typeof decoded === "object" && "userId" in decoded) {
            (req as CustomRequest).user = decoded as JwtPayload & { userId: string; role?: string };
            next();
        } else {
            return res.status(403).json({ message: "Invalid token format" });
        }
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const customReq = req as CustomRequest;
        const userRole = customReq.user?.role;

        // If user has no role, allow only if allowedRoles is empty
        if (!userRole) {
            if (allowedRoles.length === 0) {
                return next(); // Allow role-less access
            } else {
                return res.status(403).json({ message: "Access denied: role required" });
            }
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Access denied: role not permitted" });
        }

        next();
    };
};