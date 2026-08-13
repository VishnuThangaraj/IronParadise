import type mongoose from "mongoose";

import UserService, {
  type CreateUserData,
  type UpdateUserData,
} from "../user/user.service.js";

import AppError from "../../shared/errors/AppError.js";

class TrainerService {
  // create trainer
  public async createTrainer(
    data: CreateUserData,
    session?: mongoose.ClientSession,
  ) {
    return UserService.createUser({ ...data, role: "trainer" }, session);
  }

  // fetch all trainers
  public async getAllTrainers() {
    return UserService.getAllUsers("trainer");
  }

  // fetch trainer by id
  public async getTrainerById(id: string) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    return user;
  }

  // update trainer
  public async updateTrainer(
    id: string,
    data: UpdateUserData,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    return UserService.updateUser(id, data, session);
  }

  // delete trainer (soft delete)
  public async deleteTrainer(id: string, session?: mongoose.ClientSession) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    return UserService.deleteUser(id, session);
  }

  // hard delete trainer
  public async hardDeleteTrainer(
    id: string,
    session?: mongoose.ClientSession,
  ) {
    const user = await UserService.getUserByUserId(id);
    if (user.role !== "trainer") {
      throw new AppError("Trainer not found", 404);
    }
    return UserService.hardDeleteUser(id, session);
  }
}

export default new TrainerService();
