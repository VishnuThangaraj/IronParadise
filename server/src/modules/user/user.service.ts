import mongoose, { type HydratedDocument } from "mongoose";

import UserModel, { type User } from "./user.model.js";
import CredentialModel from "../../shared/models/credential.model.js";

import type { CreateUserInput, UpdateUserInput, UserDetailsSchema } from "./user.validator.js";

import AuthService from "../auth/auth.service.js";

import AppError from "../../shared/errors/AppError.js";
import type { Role } from "../../shared/types/roles.js";
import { generateId } from "../../shared/utils/id-generator.js";

export type CreateUserData = CreateUserInput & {
  userId?: string;
  password?: string;
  isActive?: boolean;
};

export type UpdateUserData = UpdateUserInput;

class UserService {
  // create user
  public async createUser(
    data: CreateUserData,
    session?: mongoose.ClientSession,
  ): Promise<any> {
    const emailLower = data.email.toLowerCase().trim();
    const duplicateCheck: any[] = [{ email: emailLower }];

    if (data.phone) {
      duplicateCheck.push({ phone: data.phone.trim() });
    }

    const existingUser = await UserModel.findOne({
      $or: duplicateCheck,
    }).session(session || null);

    if (existingUser) {
      if (existingUser.email.toLowerCase() === emailLower) {
        throw new AppError("Email's already in use — try another one", 409);
      }
      if (data.phone && existingUser.phone === data.phone.trim()) {
        throw new AppError(
          "Phone number's already in use — try another one",
          409,
        );
      }
    }

    const role = data.role || "member";
    const userId = data.userId || (await generateId(role));

    const createOptions = session ? { session } : {};
    const [user] = await UserModel.create(
      [
        {
          userId,
          fullName: data.fullName,
          email: emailLower,
          gender: data.gender,
          role,
          ...(data.phone ? { phone: data.phone.trim() } : {}),
          ...(data.dob ? { dob: data.dob } : {}),
          ...(data.profileImage ? { profileImage: data.profileImage } : {}),
          ...(data.address ? { address: data.address } : {}),
          ...(data.permissions ? { permissions: data.permissions } : {}),
          ...(data.emergencyContact
            ? { emergencyContact: data.emergencyContact }
            : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
      ],
      createOptions,
    );

    if (!user) {
      throw new AppError("Couldn't create user record", 500);
    }

    const random3Number = Math.floor(100 + Math.random() * 900);
    const password = data.password || `${userId}@${random3Number}`;

    try {
      await AuthService.register(
        {
          userId,
          userType: role,
          password,
        },
        session || null,
      );
    } catch (error) {
      if (!session) {
        await UserModel.findByIdAndDelete(user._id);
      }
      throw error;
    }

    return {
      ...user.toObject(),
      password,
    };
  }

  // fetch all user
  public async getAllUsers(
    role?: Role | string,
  ): Promise<HydratedDocument<User>[]> {
    if (role) {
      return UserModel.find({ role: role as any });
    }
    return UserModel.find();
  }

  // fetch user details
  public async getUserDetails(): Promise<HydratedDocument<UserDetailsSchema>[]> {
    return UserModel.find().select(
      "__id userId fullName profileImage email role",
    );
  }

  // fetch user by id
  public async getUserByUserId(
    userId: string,
  ): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({
      $or: [
        { userId },
        { userId: userId.toUpperCase() },
        { userId: userId.toLowerCase() },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
      ],
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  // update user
  public async updateUser(
    userId: string,
    data: UpdateUserData,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<User>> {
    const existingUser = await UserModel.findOne({
      $or: [
        { userId },
        { userId: userId.toUpperCase() },
        { userId: userId.toLowerCase() },
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
      ],
    }).session(session || null);

    if (!existingUser) {
      throw new AppError("User not found", 404);
    }

    const checks: any[] = [];
    if (data.email) {
      const newEmail = data.email.toLowerCase().trim();
      if (newEmail !== existingUser.email.toLowerCase()) {
        checks.push({ email: newEmail });
      }
    }
    if (data.phone) {
      const newPhone = data.phone.trim();
      if (newPhone !== existingUser.phone) {
        checks.push({ phone: newPhone });
      }
    }

    if (checks.length > 0) {
      const duplicate = await UserModel.findOne({
        _id: { $ne: existingUser._id },
        $or: checks,
      }).session(session || null);

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

    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const updatedUser = await UserModel.findByIdAndUpdate(
      existingUser._id,
      { $set: data },
      updateOptions,
    );

    if (!updatedUser) {
      throw new AppError("Failed to update user", 500);
    }

    return updatedUser;
  }

  // delete user (soft delete)
  public async deleteUser(
    userId: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<User>> {
    const updateOptions = {
      returnDocument: "after" as const,
      runValidators: true,
      ...(session ? { session } : {}),
    };

    const user = await UserModel.findOneAndUpdate(
      {
        $or: [
          { userId },
          { userId: userId.toUpperCase() },
          { userId: userId.toLowerCase() },
          ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
        ],
      },
      { $set: { isActive: false } },
      updateOptions,
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  // hard delete user (completely delete from DB)
  public async hardDeleteUser(
    userId: string,
    session?: mongoose.ClientSession,
  ): Promise<HydratedDocument<User>> {
    const deleteOptions = session ? { session } : {};
    const user = await UserModel.findOneAndDelete(
      {
        $or: [
          { userId },
          { userId: userId.toUpperCase() },
          { userId: userId.toLowerCase() },
          ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: userId }] : []),
        ],
      },
      deleteOptions,
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await CredentialModel.findOneAndDelete(
      { userId: user.userId },
      deleteOptions,
    );

    return user;
  }
}

export default new UserService();
