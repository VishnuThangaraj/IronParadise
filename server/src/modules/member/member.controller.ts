import type { Request, Response, NextFunction } from "express";

import MemberService from "./member.service.js";
import { sendResponse } from "../../shared/utils/response.js";

class MemberController {
  // create member
  public async createMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const member = await MemberService.createMember(req.body);
      sendResponse(res, 201, "Member created successfully", member);
    } catch (error) {
      next(error);
    }
  }

  // fetch all members
  public async getAllMembers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const members = await MemberService.getAllMembers();
      sendResponse(res, 200, "Members fetched successfully", members);
    } catch (error) {
      next(error);
    }
  }

  // fetch member by id
  public async getMemberById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const member = await MemberService.getMemberById(id as string);
      sendResponse(res, 200, "Member details fetched successfully", member);
    } catch (error) {
      next(error);
    }
  }

  // update member
  public async updateMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updatedMember = await MemberService.updateMember(
        id as string,
        req.body,
      );
      sendResponse(res, 200, "Member updated successfully", updatedMember);
    } catch (error) {
      next(error);
    }
  }

  // delete member (soft delete)
  public async deleteMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deletedMember = await MemberService.deleteMember(id as string);
      sendResponse(
        res,
        200,
        "Member deactivated successfully",
        deletedMember,
      );
    } catch (error) {
      next(error);
    }
  }

  // delete member (permanent delete)
  public async hardDeleteMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const deletedMember = await MemberService.hardDeleteMember(
        id as string,
      );
      sendResponse(res, 200, "Member permanently deleted", deletedMember);
    } catch (error) {
      next(error);
    }
  }
}

export default new MemberController();
