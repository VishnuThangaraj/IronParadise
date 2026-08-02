import AdminModel from "../admin/admin.model.js";
import CredentialModel from "../../shared/models/credential.model.js";

import AppError from "../../shared/errors/AppError.js";

import { hashPassword, comparePassword } from "../../shared/utils/password.js";
import {
  generateAuthTokens,
  verifyRefreshToken,
  type JwtPayload,
} from "../../shared/utils/jwt.js";
import type { Role } from "../../shared/types/roles.js";
import type mongoose from "mongoose";
import type {
  LoginInput,
  RegisterInput,
  RefreshTokenInput,
} from "./auth.validator.js";

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

    const tokens = generateAuthTokens({
      userId: credential.userId,
      role: role as Role,
    });

    return {
      tokens,
      user,
    };
  }

  // Refresh Token
  async refreshToken(data: RefreshTokenInput) {
    let payload: JwtPayload;

    try {
      payload = verifyRefreshToken(data.refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const credential = await CredentialModel.findOne({
      userId: payload.userId,
    });

    if (!credential) {
      throw new AppError("User not found", 401);
    }

    let role = "";

    if (credential.userType === "admin") {
      const user = await AdminModel.findOne({ adminId: payload.userId });

      if (!user || !user.isActive) {
        throw new AppError("Account is disabled or no longer exists", 403);
      }

      role = user.role;
    }

    const tokens = generateAuthTokens({
      userId: credential.userId,
      role: role as Role,
    });

    return {
      tokens,
    };
  }

  // Get Profile
  async getProfile(userId: string) {
    const credential = await CredentialModel.findOne({ userId });

    if (!credential) {
      throw new AppError("User not found", 404);
    }

    let user: any = null;

    if (credential.userType === "admin") {
      user = await AdminModel.findOne({ adminId: userId });
    }

    if (!user) {
      throw new AppError("User profile not found", 404);
    }

    return user;
  }
}

export default new AuthService();
