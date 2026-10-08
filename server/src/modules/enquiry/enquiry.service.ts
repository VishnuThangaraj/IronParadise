import mongoose, { type HydratedDocument } from "mongoose";

import type {
  CreateEnquiryInput,
  ReplyEnquiryInput,
  UpdateEnquiryInput,
} from "./enquiry.validator.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";
import EnquiryModel, { type Enquiry } from "./enquiry.model.js";
import {
  sendEnquiryReceivedEmail,
  sendEnquiryReplyEmail,
} from "../../shared/utils/mail.js";

export interface GetAllEnquiriesFilter {
  replied?: boolean;
  role?: string;
  search?: string;
}

class EnquiryService {
  // Create new enquiry
  public async createEnquiry(
    data: CreateEnquiryInput,
  ): Promise<HydratedDocument<Enquiry>> {
    const enquiryId: string = await generateId("enquiry");

    const enquiry = await EnquiryModel.create({
      enquiryId,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() ?? "",
      role: data.role ?? "visitor",
      subject: data.subject.trim(),
      message: data.message.trim(),
      replied: false,
    });

    if (!enquiry) {
      throw new AppError("Failed to submit enquiry — please try again", 500);
    }

    // Send confirmation email to user if email is provided
    if (enquiry.email) {
      sendEnquiryReceivedEmail({
        to: enquiry.email,
        fullName: enquiry.fullName,
        enquiryId: enquiry.enquiryId,
        subject: enquiry.subject,
        message: enquiry.message,
      }).catch((err) => {
        console.error(
          `[MailService] Failed to send enquiry receipt to ${enquiry.email}:`,
          err,
        );
      });
    }

    return enquiry;
  }

  // Get all enquiries (with optional filters)
  public async getAllEnquiries(
    filter?: GetAllEnquiriesFilter,
  ): Promise<HydratedDocument<Enquiry>[]> {
    const query: Record<string, any> = {};

    if (filter?.replied !== undefined) {
      query.replied = filter.replied;
    }

    if (filter?.role) {
      query.role = filter.role.toLowerCase().trim();
    }

    if (filter?.search) {
      const escapedSearch = filter.search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");
      query.$or = [
        { enquiryId: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
      ];
    }

    return await EnquiryModel.find(query).sort({ createdAt: -1 });
  }

  // Get single enquiry by ID (enquiryId or _id)
  public async getEnquiryById(
    id: string,
  ): Promise<HydratedDocument<Enquiry>> {
    const trimmedId = id.trim();
    const enquiry = await EnquiryModel.findOne({
      $or: [
        { enquiryId: trimmedId.toUpperCase() },
        ...(mongoose.Types.ObjectId.isValid(trimmedId)
          ? [{ _id: trimmedId }]
          : []),
      ],
    });

    if (!enquiry) {
      throw new AppError("Enquiry not found", 404);
    }

    return enquiry;
  }

  // Reply to enquiry and send email to user
  public async replyToEnquiry(
    id: string,
    replyData: ReplyEnquiryInput,
  ): Promise<HydratedDocument<Enquiry>> {
    const enquiry = await this.getEnquiryById(id);

    enquiry.replied = true;
    enquiry.replyMessage = {
      subject: replyData.subject.trim(),
      message: replyData.message.trim(),
      repliedAt: new Date(),
    };

    await enquiry.save();

    // Send reply email to recipient if email is provided
    if (enquiry.email) {
      await sendEnquiryReplyEmail({
        to: enquiry.email,
        fullName: enquiry.fullName,
        enquiryId: enquiry.enquiryId,
        replySubject: replyData.subject.trim(),
        replyMessage: replyData.message.trim(),
        originalSubject: enquiry.subject,
        originalMessage: enquiry.message,
      }).catch((err) => {
        console.error(
          `[MailService] Failed to send enquiry reply email to ${enquiry.email}:`,
          err,
        );
      });
    }

    return enquiry;
  }

  // Update enquiry details
  public async updateEnquiry(
    id: string,
    data: UpdateEnquiryInput,
  ): Promise<HydratedDocument<Enquiry>> {
    const existingEnquiry = await this.getEnquiryById(id);

    const updatePayload: Record<string, any> = {};

    if (data.fullName !== undefined) {
      updatePayload.fullName = data.fullName.trim();
    }
    if (data.email !== undefined) {
      updatePayload.email = data.email.trim().toLowerCase();
    }
    if (data.phone !== undefined) {
      updatePayload.phone = data.phone?.trim() ?? "";
    }
    if (data.role !== undefined) {
      updatePayload.role = data.role;
    }
    if (data.subject !== undefined) {
      updatePayload.subject = data.subject.trim();
    }
    if (data.message !== undefined) {
      updatePayload.message = data.message.trim();
    }
    if (data.replied !== undefined) {
      updatePayload.replied = data.replied;
    }
    if (data.replyMessage !== undefined) {
      updatePayload.replyMessage = {
        subject: data.replyMessage.subject.trim(),
        message: data.replyMessage.message.trim(),
        repliedAt: new Date(),
      };
    }

    const updated = await EnquiryModel.findByIdAndUpdate(
      existingEnquiry._id,
      { $set: updatePayload },
      { returnDocument: "after", runValidators: true },
    );

    if (!updated) {
      throw new AppError("Failed to update enquiry", 500);
    }

    return updated;
  }

  // Delete enquiry
  public async deleteEnquiry(
    id: string,
  ): Promise<HydratedDocument<Enquiry>> {
    const trimmedId = id.trim();
    const enquiry = await EnquiryModel.findOneAndDelete({
      $or: [
        { enquiryId: trimmedId.toUpperCase() },
        ...(mongoose.Types.ObjectId.isValid(trimmedId)
          ? [{ _id: trimmedId }]
          : []),
      ],
    });

    if (!enquiry) {
      throw new AppError("Enquiry not found", 404);
    }

    return enquiry;
  }
}

export default new EnquiryService();
