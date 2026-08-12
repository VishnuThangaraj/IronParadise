import type mongoose from "mongoose";

import UserService, {
  type CreateUserData,
  type UpdateUserData,
} from "../user/user.service.js";
import AppError from "../../shared/errors/AppError.js";

class AdminService {
  // create admin
  public async createAdmin(
    data: CreateUserData,
    session?: mongoose.ClientSession,
  ) {
    return UserService.createUser({ ...data, role: "admin" }, session);
  }

  // fetch all admin
  public async getAllAdmins() {
    return UserService.getAllUsers("admin");
  }

  // fetch admin by id
  public async getAdminById(id: string) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "admin") {
      throw new AppError("Admin not found", 404);
    }
    return user;
  }

  // update admin
  public async updateAdmin(
    id: string,
    data: UpdateUserData,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "admin") {
      throw new AppError("Admin not found", 404);
    }
    return UserService.updateUser(id, data, session);
  }

  // delete admin (soft delete)
  public async deleteAdmin(id: string, session?: mongoose.ClientSession) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "admin") {
      throw new AppError("Admin not found", 404);
    }
    return UserService.deleteUser(id, session);
  }

  // hard delete admin (completely delete from DB)
  public async hardDeleteAdmin(id: string, session?: mongoose.ClientSession) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "admin") {
      throw new AppError("Admin not found", 404);
    }
    return UserService.hardDeleteUser(id, session);
  }
}

export default new AdminService();
