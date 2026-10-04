import type { Request, Response, NextFunction } from "express";
import UserModel from "../user/user.model.js";
import userService from "../user/user.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class MessageController {
  // fetch User Details
  public async fetchAllUserDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await userService.getUserDetails();
      sendResponse(res, 200, "User Details fetched successfully", users);
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
