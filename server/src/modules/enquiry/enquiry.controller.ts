import type { HydratedDocument } from "mongoose";
import type { Request, Response, NextFunction } from "express";

import EnquiryService from "./enquiry.service.js";
import type { Enquiry } from "./enquiry.model.js";
import { sendResponse } from "../../shared/utils/response.js";

class EnquiryController {
  // Create new enquiry
  public async createEnquiry(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const enquiry: HydratedDocument<Enquiry> =
        await EnquiryService.createEnquiry(req.body);
      sendResponse(res, 201, "Enquiry submitted successfully", enquiry);
    } catch (error) {
      next(error);
    }
  }

  // Fetch all enquiries (with optional filter query parameters)
  public async fetchAllEnquiries(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { replied, role, search } = req.query;

      let repliedFilter: boolean | undefined = undefined;
      if (replied === "true") {
        repliedFilter = true;
      } else if (replied === "false") {
        repliedFilter = false;
      }

      const enquiries: HydratedDocument<Enquiry>[] =
        await EnquiryService.getAllEnquiries({
          ...(repliedFilter !== undefined ? { replied: repliedFilter } : {}),
          ...(typeof role === "string" && role ? { role } : {}),
          ...(typeof search === "string" && search ? { search } : {}),
        });

      sendResponse(res, 200, "Enquiries fetched successfully", enquiries);
    } catch (error) {
      next(error);
    }
  }

  // Fetch enquiry by ID
  public async getEnquiryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry: HydratedDocument<Enquiry> =
        await EnquiryService.getEnquiryById(id as string);
      sendResponse(res, 200, "Enquiry fetched successfully", enquiry);
    } catch (error) {
      next(error);
    }
  }

  // Reply to enquiry
  public async replyToEnquiry(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry: HydratedDocument<Enquiry> =
        await EnquiryService.replyToEnquiry(id as string, req.body);
      sendResponse(res, 200, "Reply recorded successfully", enquiry);
    } catch (error) {
      next(error);
    }
  }

  // Update enquiry
  public async updateEnquiry(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry: HydratedDocument<Enquiry> =
        await EnquiryService.updateEnquiry(id as string, req.body);
      sendResponse(res, 200, "Enquiry updated successfully", enquiry);
    } catch (error) {
      next(error);
    }
  }

  // Delete enquiry
  public async deleteEnquiry(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const enquiry: HydratedDocument<Enquiry> =
        await EnquiryService.deleteEnquiry(id as string);
      sendResponse(res, 200, "Enquiry deleted successfully", enquiry);
    } catch (error) {
      next(error);
    }
  }
}

export default new EnquiryController();
