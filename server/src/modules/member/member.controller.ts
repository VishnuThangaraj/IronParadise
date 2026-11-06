import type { Request, Response, NextFunction } from "express";

import MemberService from "./member.service.js";
import MemberPaymentReceiptService from "./member-payment-receipt/member-payment-receipt.service.js";
import MemberAssignmentModel from "./member-assignment/member-assignment.model.js";
import AppError from "../../shared/errors/AppError.js";
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
      const targetUserId = (id as string).trim().toUpperCase();
      const currentRole = req.user?.role;
      const currentUserId = req.user?.userId?.trim()?.toUpperCase();

      if (currentRole === "member" && currentUserId !== targetUserId) {
        throw new AppError(
          "Access denied: You can only view your own profile",
          403,
        );
      }

      if (currentRole === "trainer" && currentUserId !== targetUserId) {
        const isAssigned = await MemberAssignmentModel.exists({
          trainerId: currentUserId,
          userId: targetUserId,
        });
        if (!isAssigned) {
          throw new AppError(
            "Access denied: Member is not assigned to you",
            403,
          );
        }
      }

      const member = await MemberService.getMemberById(targetUserId);
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

  // record member payment receipt (fee payment)
  public async recordPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const receipt =
        await MemberPaymentReceiptService.createMemberPaymentReceipt(req.body);
      sendResponse(res, 201, "Member payment recorded successfully", receipt);
    } catch (error) {
      next(error);
    }
  }

  // fetch all payment receipts (optional ?userId=...)
  public async getPaymentReceipts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, paymentId } = req.query;
      const receipts = await MemberService.getAllMemberPaymentReceipts({
        userId: userId as string | undefined,
        paymentId: paymentId as string | undefined,
      });
      sendResponse(res, 200, "Payment receipts fetched successfully", receipts);
    } catch (error) {
      next(error);
    }
  }

  // fetch all member payments (enriched with member & plan details)
  public async getAllPayments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { paymentStatus, membershipPlanId, search } = req.query;
      const payments = await MemberService.getAllMemberPayments({
        paymentStatus: paymentStatus as string | undefined,
        membershipPlanId: membershipPlanId as string | undefined,
        search: search as string | undefined,
      });
      sendResponse(res, 200, "Member payments fetched successfully", payments);
    } catch (error) {
      next(error);
    }
  }

  // fetch payment receipts for a specific member
  public async getMemberReceipts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const targetUserId = (id as string).trim().toUpperCase();
      const currentRole = req.user?.role;
      const currentUserId = req.user?.userId?.trim()?.toUpperCase();

      if (currentRole === "member" && currentUserId !== targetUserId) {
        throw new AppError(
          "Access denied: You can only view your own receipts",
          403,
        );
      }

      if (currentRole === "trainer" && currentUserId !== targetUserId) {
        const isAssigned = await MemberAssignmentModel.exists({
          trainerId: currentUserId,
          userId: targetUserId,
        });
        if (!isAssigned) {
          throw new AppError(
            "Access denied: Member is not assigned to you",
            403,
          );
        }
      }

      const receipts = await MemberService.getAllMemberPaymentReceipts({
        userId: targetUserId,
      });
      sendResponse(
        res,
        200,
        "Member payment receipts fetched successfully",
        receipts,
      );
    } catch (error) {
      next(error);
    }
  }

  // Fetch logged-in member's profile & assignment details
  public async getMyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const memberId = req.user?.userId;
      if (!memberId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const result = await MemberService.getMyDetails(memberId);
      sendResponse(res, 200, "Member details fetched successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Fetch logged-in member's own attendance
  public async getMyAttendance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const memberId = req.user?.userId;
      if (!memberId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const month = req.query.month !== undefined ? Number(req.query.month) : undefined;
      const year = req.query.year ? Number(req.query.year) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await MemberService.getMyAttendance(memberId, {
        month,
        year,
        limit,
      });
      sendResponse(res, 200, "Member attendance fetched successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Fetch assigned trainer details for logged-in member
  public async getMyTrainer(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const memberId = req.user?.userId;
      if (!memberId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const result = await MemberService.getMyTrainer(memberId);
      sendResponse(res, 200, "Assigned trainer details fetched successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Fetch assigned fitness plans (workout + diet) for logged-in member
  public async getMyPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const memberId = req.user?.userId;
      if (!memberId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const result = await MemberService.getMyPlans(memberId);
      sendResponse(res, 200, "Fitness plans fetched successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // Fetch payment records and receipts for logged-in member
  public async getMyPayments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const memberId = req.user?.userId;
      if (!memberId) {
        return sendResponse(res, 401, "Authentication required");
      }
      const result = await MemberService.getMyPayments(memberId);
      sendResponse(res, 200, "Member payment history fetched successfully", result);
    } catch (error) {
      next(error);
    }
  }
}

export default new MemberController();
