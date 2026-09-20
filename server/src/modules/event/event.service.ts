import mongoose, { type HydratedDocument } from "mongoose";

import type {
  CreateEventInput,
  UpdateEventInput,
} from "./event.validator.js";
import AppError from "../../shared/errors/AppError.js";
import { generateId } from "../../shared/utils/id-generator.js";
import EventModal, { type Event } from "./event.modal.js";

class EventService {
  // Create Event
  public async createEvent(
    data: CreateEventInput,
  ): Promise<HydratedDocument<Event>> {
    const titleTrimmed = data.title.trim();
    const escapedTitle = titleTrimmed.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    const existingEvent = await EventModal.findOne({
      title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
      date: data.date,
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

  // Get Event by Id
  public async getEventById(
    eventId: string,
  ): Promise<HydratedDocument<Event>> {
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
      const escapedTitle = targetTitle.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      const duplicate = await EventModal.findOne({
        _id: { $ne: existingEvent._id },
        title: { $regex: new RegExp(`^${escapedTitle}$`, "i") },
        date: targetDate,
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
  public async deleteEvent(
    eventId: string,
  ): Promise<HydratedDocument<Event>> {
    const event = await EventModal.findOneAndUpdate(
      {
        $or: [
          { eventId },
          ...(mongoose.Types.ObjectId.isValid(eventId) ? [{ _id: eventId }] : []),
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