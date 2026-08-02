import mongoose, { type HydratedDocument } from "mongoose";

import AdminModel, { type Admin } from "./admin.model.js";
import { generateId } from "../../shared/utils/id-generator.js";
import AppError from "../../shared/errors/AppError.js";
import type { CreateAdminInput, UpdateAdminInput } from "./admin.validator.js";
import AuthService from "../auth/auth.service.js";
import CredentialModel from "../../shared/models/credential.model.js";

class AdminService {
  // Create Admin
  public async createAdmin(
    data: CreateAdminInput,
  ): Promise<HydratedDocument<Admin>> {
    const emailLower = data.email.toLowerCase().trim();
    const duplicateCheck: any[] = [{ email: emailLower }];
    if (data.phone) {
      duplicateCheck.push({ phone: data.phone.trim() });
    }

    const existingDoc = await AdminModel.findOne({ $or: duplicateCheck });
    if (existingDoc) {
      if (existingDoc.email.toLowerCase() === emailLower) {
        throw new AppError("Email's already in use — try another one", 409);
      }
      if (data.phone && existingDoc.phone === data.phone.trim()) {
        throw new AppError(
          "Phone number's already in use — try another one",
          409,
        );
      }
    }

    const session: mongoose.ClientSession = await mongoose.startSession();

    try {
      session.startTransaction();

      const adminId: string = await generateId("admin");

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
        throw new AppError("Couldn't create admin account — try again", 500);
      }

      await AuthService.register(
        {
          userId: adminId,
          userType: "admin",
          password: data.password,
        },
        session,
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

  // Update Admin
  public async updateAdmin(
    adminId: string,
    data: UpdateAdminInput,
  ): Promise<HydratedDocument<Admin>> {
    const existingAdmin = await AdminModel.findOne({
      $or: [
        { adminId },
        ...(mongoose.Types.ObjectId.isValid(adminId) ? [{ _id: adminId }] : []),
      ],
    });

    if (!existingAdmin) {
      throw new AppError("Admin not found", 404);
    }

    const checks: any[] = [];
    if (data.email) {
      const newEmail = data.email.toLowerCase().trim();
      if (newEmail !== existingAdmin.email.toLowerCase()) {
        checks.push({ email: newEmail });
      }
    }
    if (data.phone) {
      const newPhone = data.phone.trim();
      if (newPhone !== existingAdmin.phone) {
        checks.push({ phone: newPhone });
      }
    }

    if (checks.length > 0) {
      const duplicate = await AdminModel.findOne({
        _id: { $ne: existingAdmin._id },
        $or: checks,
      });

      if (duplicate) {
        if (
          data.email &&
          duplicate.email.toLowerCase() === data.email.toLowerCase().trim()
        ) {
          throw new AppError("Email already exists", 409);
        }
        if (data.phone && duplicate.phone === data.phone.trim()) {
          throw new AppError("Phone number already exists", 409);
        }
      }
    }

    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      existingAdmin._id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedAdmin) {
      throw new AppError("Failed to update admin", 500);
    }

    return updatedAdmin;
  }

  // Delete Admin
  public async deleteAdmin(adminId: string): Promise<HydratedDocument<Admin>> {
    const session: mongoose.ClientSession = await mongoose.startSession();

    try {
      session.startTransaction();

      const adminCount = await AdminModel.countDocuments().session(session);

      if (adminCount <= 1) {
        throw new AppError("Cannot delete the only admin account", 400);
      }

      const admin = await AdminModel.findOneAndDelete(
        {
          $or: [
            { adminId },
            ...(mongoose.Types.ObjectId.isValid(adminId)
              ? [{ _id: adminId }]
              : []),
          ],
        },
        { session },
      );

      if (!admin) {
        throw new AppError("Admin not found", 404);
      }

      await CredentialModel.findOneAndDelete(
        { userId: admin.adminId },
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
}

export default new AdminService();
