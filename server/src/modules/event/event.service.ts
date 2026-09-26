import mongoose, { type HydratedDocument } from "mongoose";

import type { CreateEventInput, UpdateEventInput } from "./event.validator.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";
import EventModal, { type Event } from "./event.modal.js";
import UserModel from "../user/user.model.js";

export interface BirthdayUser {
  userId: string;
  fullName: string;
  role: "member" | "trainer";
  dob: Date;
  birthdayDate: Date;
  day: number;
  age?: number | undefined;
  profileImage?: string;
  gender?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  title: string;
}

export interface EventsByMonthResult {
  events: HydratedDocument<Event>[];
  birthdays: BirthdayUser[];
  month: number;
  year: number;
  totalEvents: number;
  totalBirthdays: number;
}

class EventService {
  // Create Event
  public async createEvent(
    data: CreateEventInput,
  ): Promise<HydratedDocument<Event>> {
    const titleTrimmed = data.title.trim();
    const escapedTitle = titleTrimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const eventDate = new Date(data.date);
    const startOfDay = new Date(eventDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(eventDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingEvent = await EventModal.findOne({
      title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingEvent) {
      throw new AppError(
        "An event with this title on this date already exists",
        409,
      );
    }

    const session: mongoose.ClientSession = await mongoose.startSession();

    try {
      session.startTransaction();
      const eventId: string = await generateId("event");

      const [event] = await EventModal.create(
        [
          {
            eventId,
            title: data.title,
            ...(data.description ? { description: data.description } : {}),
            date: data.date,
            time: data.time,
            ...(data.visibility ? { visibility: data.visibility } : {}),
          },
        ],
        { session },
      );

      if (!event) {
        throw new AppError("Couldn't create event — try again", 500);
      }

      await session.commitTransaction();

      return event;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // Get All Events
  public async getAllEvents(
    filterActiveOnly = false,
  ): Promise<HydratedDocument<Event>[]> {
    const query = filterActiveOnly ? { isActive: true } : {};
    return await EventModal.find(query).sort({ date: 1, createdAt: -1 });
  }

  // Get members and trainers born in the specified month (regardless of birth year)
  public async getBirthdaysByMonth(
    month?: number | string,
    year?: number | string,
    filterActiveOnly = true,
  ): Promise<BirthdayUser[]> {
    const now = new Date();
    const targetMonth =
      month !== undefined && month !== "" && !isNaN(Number(month))
        ? Number(month)
        : now.getMonth() + 1; // 1-12
    const targetYear =
      year !== undefined && year !== "" && !isNaN(Number(year))
        ? Number(year)
        : now.getFullYear();

    if (targetMonth < 1 || targetMonth > 12) {
      throw new AppError(
        "Invalid month provided — must be between 1 and 12",
        400,
      );
    }

    // Query members and trainers whose DOB falls in the requested month (regardless of year)
    const users = await UserModel.find({
      role: { $in: ["member", "trainer"] },
      dob: { $exists: true, $ne: null },
      ...(filterActiveOnly ? { isActive: true } : {}),
      $expr: {
        $eq: [
          {
            $month: {
              $cond: [
                { $eq: [{ $type: "$dob" }, "date"] },
                "$dob",
                {
                  $dateFromString: {
                    dateString: { $substrCP: [{ $toString: "$dob" }, 0, 10] },
                    onError: null,
                    onNull: null,
                  },
                },
              ],
            },
          },
          targetMonth,
        ],
      },
    })
      .select("userId fullName role dob profileImage gender email phone isActive")
      .lean();

    const birthdays: BirthdayUser[] = (
      users as unknown as Array<{
        userId: string;
        fullName: string;
        role: "member" | "trainer";
        dob: Date | string;
        profileImage?: string;
        gender?: string;
        phone?: string;
        email?: string;
        isActive?: boolean;
      }>
    ).map((user) => {
      let birthDay = 1;
      let birthYear = targetYear;
      let birthDate: Date;

      if (typeof user.dob === "string") {
        const match = user.dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match && match[1] && match[2] && match[3]) {
          birthYear = parseInt(match[1], 10);
          birthDay = parseInt(match[3], 10);
          birthDate = new Date(
            Date.UTC(birthYear, parseInt(match[2], 10) - 1, birthDay),
          );
        } else {
          birthDate = new Date(user.dob);
          if (!isNaN(birthDate.getTime())) {
            birthDay = birthDate.getUTCDate();
            birthYear = birthDate.getUTCFullYear();
          }
        }
      } else {
        birthDate = new Date(user.dob);
        if (!isNaN(birthDate.getTime())) {
          birthDay = birthDate.getUTCDate();
          birthYear = birthDate.getUTCFullYear();
        }
      }

      // Calculate the birthday occurrence in the requested year and month
      let occurrenceDate = new Date(
        Date.UTC(targetYear, targetMonth - 1, birthDay),
      );
      // Handle leap year edge case (e.g. Feb 29 on non-leap year falls back to Feb 28)
      if (occurrenceDate.getUTCMonth() !== targetMonth - 1) {
        occurrenceDate = new Date(Date.UTC(targetYear, targetMonth, 0));
      }

      const age =
        targetYear >= birthYear ? targetYear - birthYear : undefined;

      return {
        userId: user.userId,
        fullName: user.fullName,
        role: user.role,
        dob: birthDate,
        birthdayDate: occurrenceDate,
        day: occurrenceDate.getUTCDate(),
        age,
        profileImage: user.profileImage || "",
        gender: user.gender,
        phone: user.phone,
        email: user.email,
        title: `${user.fullName}'s Birthday`,
      };
    });

    // Sort by day of month, then by full name
    return birthdays.sort(
      (a, b) => a.day - b.day || a.fullName.localeCompare(b.fullName),
    );
  }

  // Get Events by Month and Year (defaults to current month and year, also includes birthdays)
  public async getEventsByMonth(
    month?: number | string,
    year?: number | string,
    filterActiveOnly = false,
  ): Promise<EventsByMonthResult> {
    const now = new Date();

    let targetYear = now.getFullYear();
    let targetMonth = now.getMonth() + 1; // 1-12

    const parsedFirst =
      month !== undefined && month !== "" ? Number(month) : undefined;
    const parsedSecond =
      year !== undefined && year !== "" ? Number(year) : undefined;

    // Support flexible ordering: (month, year) or (year, month)
    if (parsedFirst !== undefined && !isNaN(parsedFirst)) {
      if (parsedFirst > 100) {
        // First parameter is year (e.g. 2026, 9)
        targetYear = parsedFirst;
        if (parsedSecond !== undefined && !isNaN(parsedSecond)) {
          targetMonth = parsedSecond;
        }
      } else {
        // First parameter is month (e.g. 9, 2026)
        targetMonth = parsedFirst;
        if (parsedSecond !== undefined && !isNaN(parsedSecond)) {
          targetYear = parsedSecond;
        }
      }
    } else if (parsedSecond !== undefined && !isNaN(parsedSecond)) {
      if (parsedSecond > 100) {
        targetYear = parsedSecond;
      } else {
        targetMonth = parsedSecond;
      }
    }

    if (isNaN(targetYear) || targetYear < 1970 || targetYear > 3000) {
      throw new AppError("Invalid year provided", 400);
    }

    if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
      throw new AppError(
        "Invalid month provided — must be between 1 and 12",
        400,
      );
    }

    const startDate = new Date(
      Date.UTC(targetYear, targetMonth - 1, 1, 0, 0, 0, 0),
    );
    const endDate = new Date(
      Date.UTC(targetYear, targetMonth, 0, 23, 59, 59, 999),
    );

    const query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
      ...(filterActiveOnly ? { isActive: true } : {}),
    };

    // Concurrently fetch scheduled events and member/trainer birthdays
    const [events, birthdays] = await Promise.all([
      EventModal.find(query).sort({
        date: 1,
        time: 1,
        createdAt: 1,
      }),
      this.getBirthdaysByMonth(targetMonth, targetYear, filterActiveOnly),
    ]);

    return {
      events,
      birthdays,
      month: targetMonth,
      year: targetYear,
      totalEvents: events.length,
      totalBirthdays: birthdays.length,
    };
  }

  // Alias for getEventsByMonth
  public getEventByMonth = this.getEventsByMonth;

  // Get Event by Id
  public async getEventById(eventId: string): Promise<HydratedDocument<Event>> {
    if (!eventId) {
      throw new AppError("Event ID is required", 400);
    }

    const event = await EventModal.findOne({
      $or: [
        { eventId },
        ...(mongoose.Types.ObjectId.isValid(eventId) ? [{ _id: eventId }] : []),
      ],
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    return event;
  }

  // Update Event
  public async updateEvent(
    eventId: string,
    data: UpdateEventInput,
  ): Promise<HydratedDocument<Event>> {
    const existingEvent = await this.getEventById(eventId);

    if (data.title || data.date) {
      const targetTitle = (data.title || existingEvent.title).trim();
      const targetDate = data.date || existingEvent.date;
      const escapedTitle = targetTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const eventDate = new Date(targetDate);
      const startOfDay = new Date(eventDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(eventDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const duplicate = await EventModal.findOne({
        _id: { $ne: existingEvent._id },
        title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      if (duplicate) {
        throw new AppError(
          "An event with this title on this date already exists",
          409,
        );
      }
    }

    const updatedEvent = await EventModal.findByIdAndUpdate(
      existingEvent._id,
      { $set: data },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedEvent) {
      throw new AppError("Failed to update event", 500);
    }

    return updatedEvent;
  }

  // Delete (Deactivate) Event
  public async deleteEvent(eventId: string): Promise<HydratedDocument<Event>> {
    if (!eventId) {
      throw new AppError("Event ID is required", 400);
    }

    const event = await EventModal.findOneAndUpdate(
      {
        $or: [
          { eventId },
          ...(mongoose.Types.ObjectId.isValid(eventId)
            ? [{ _id: eventId }]
            : []),
        ],
      },
      { $set: { isActive: false } },
      { returnDocument: "after" },
    );

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    return event;
  }

  // Delete event permanently (hard delete)
  public async deleteEventPermanently(
    eventId: string,
  ): Promise<HydratedDocument<Event>> {
    if (!eventId) {
      throw new AppError("Event ID is required", 400);
    }

    const event = await EventModal.findOneAndDelete({
      $or: [
        { eventId },
        ...(mongoose.Types.ObjectId.isValid(eventId) ? [{ _id: eventId }] : []),
      ],
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    return event;
  }
}

export default new EventService();
