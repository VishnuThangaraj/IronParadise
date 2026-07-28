import AdminModel from "../admin/admin.model.js";
import CredentialModel from "../../shared/models/credential.model.js";

import AppError from "../../shared/errors/AppError.js";

import { hashPassword, comparePassword } from "../../shared/utils/password.js";
import { generateToken } from "../../shared/utils/jwt.js";
import type { Role } from "../../shared/types/roles.js";
import type mongoose from "mongoose";
import type { LoginInput, RegisterInput } from "./auth.types.js";

class AuthService {
  // Register credentials
  async register(data: RegisterInput, session?: mongoose.ClientSession | null) {
    const credentialExists = await CredentialModel.exists({
      userId: data.userId,
    });

    if (credentialExists) {
      throw new AppError("User already registered", 409);
    }

    const passwordHash = await hashPassword(data.password);

    const doc = {
      userId: data.userId,
      userType: data.userType,
      passwordHash,
    };

    const created = session 
      ? await CredentialModel.create([doc], { session })
      : await CredentialModel.create([doc]);

    return Array.isArray(created) ? created[0] : created;
  }

  // Login
  async login(data: LoginInput) {
    const credential = await CredentialModel.findOne({
      userId: data.userId,
    });

    if (!credential) {
      throw new AppError("Invalid credentials", 401);
    }

    const validPassword = await comparePassword(
      data.password,
      credential.passwordHash,
    );

    if (!validPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    let user: any = null;
    let role = "";

    if (credential.userType === "admin") {
      user = await AdminModel.findOne({ adminId: data.userId });

      if (!user) {
        throw new AppError("User not found", 404);
      }
      if (!user.isActive) {
        throw new AppError("Account is disabled", 403);
      }

      role = user.role;
    }

    const token = generateToken({
      userId: credential.userId,
      role: role as Role,
    });

    return {
      token,
      user,
    };
  }
}

export default new AuthService();
