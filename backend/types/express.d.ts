import type { Model } from "sequelize";

interface AuthenticatedUser extends Model {
  id: number;
  role: string;
  banned: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      file?: Multer.File;
    }
  }
}

export {};
