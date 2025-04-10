import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload & {
                id: string;
                role?: string;
                email?: string;
            };
        }
    }
}

export { }; // Important to treat this as a module
