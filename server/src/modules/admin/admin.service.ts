import AdminModel from "./admin.model.js";
import mongoose from "mongoose";
import { generateId } from "../../shared/utils/id-generator.js";
import AppError from "../../shared/errors/AppError.js";
import type { CreateAdminInput } from "./admin.types.js";
import AuthService from "../auth/auth.service.js";

class AdminService {
  async createAdmin(data: CreateAdminInput) {
    const exists = await AdminModel.exists({ email: data.email });

    if (exists) {
      throw new AppError("Email already exists", 409);
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const adminId = await generateId("admin");

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
        { session }
      );

      if (!admin) {
        throw new AppError("Failed to create admin account", 500);
      }

      await AuthService.register(
        {
          userId: adminId,
          userType: "admin",
          password: data.password,
        },
        session
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
}

export default new AdminService();
