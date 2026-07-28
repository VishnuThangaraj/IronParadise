import AdminModel from "../models/admin.model.js";
import CredentialModel from "../models/credential.model.js";
import mongoose from "mongoose";

import AppError from "../errors/AppError.js";

import { generateId } from "../utils/id-generator.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import type { Role } from "../types/roles.js";

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  phone?: string;
  profileImage?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

class AuthService {
  async register(data: RegisterInput) {
    const exists = await AdminModel.exists({
      email: data.email,
    });

    if (exists) {
      throw new AppError("Email already exists", 409);
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const adminId = await generateId("admin");

      const passwordHash = await hashPassword(data.password);

      const [admin] = await AdminModel.create(
        [
          {
            adminId,
            fullName: data.fullName,
            email: data.email,
            gender: data.gender,
            ...(data.phone ? { phone: data.phone } : {}),
            ...(data.profileImage ? { profileImage: data.profileImage } : {}),
          },
        ],
        { session },
      );

      if (!admin) {
        throw new AppError("Failed to create admin account", 500);
      }

      await CredentialModel.create(
        [
          {
            userId: adminId,
            userType: "admin",
            passwordHash,
          },
        ],
        { session },
      );

      await session.commitTransaction();

      return admin;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async login(data: LoginInput) {
    const admin = await AdminModel.findOne({
      email: data.email,
    });

    if (!admin) {
      throw new AppError("Invalid email or password", 401);
    }

    const credential = await CredentialModel.findOne({
      userId: admin.adminId,
    });

    if (!credential) {
      throw new AppError("Invalid email or password", 401);
    }

    const validPassword = await comparePassword(
      data.password,
      credential.passwordHash,
    );

    if (!validPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!admin.isActive) {
      throw new AppError("Account is disabled", 403);
    }

    const token = generateToken({
      userId: admin.adminId,
      role: admin.role as Role,
    });

    return {
      token,
      user: admin,
    };
  }
}

export default new AuthService();
