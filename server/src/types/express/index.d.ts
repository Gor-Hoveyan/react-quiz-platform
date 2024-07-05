import { UserJWTPayload } from "../../services/userService";

declare global {
    namespace Express {
        interface Request {
            user?: UserJWTPayload;
        }
    }
}