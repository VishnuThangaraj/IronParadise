import type { HydratedDocument } from "mongoose";
import type { Request, Response, NextFunction } from "express";

import EventService from "./event.service.js";
import type { Event } from "./event.modal.js";

import { sendResponse } from "../../shared/utils/response.js";

class EventController {
  // create event
  public async createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const event: HydratedDocument<Event> =
        await EventService.createEvent(req.body);
      sendResponse(res, 201, "Event created successfully", event);
    } catch (error) {
      next(error);
    }
  }

  // fetch all events
  public async fetchAllEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const events: HydratedDocument<Event>[] =
        await EventService.getAllEvents();
      sendResponse(res, 200, "Events fetched successfully", events);
    } catch (error) {
      next(error);
    }
  }

  // fetch event by id
  public async getEventById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { eventId } = req.params;
      const event: HydratedDocument<Event> =
        await EventService.getEventById(eventId as string);

      sendResponse(res, 200, "Event fetched successfully", event);
    } catch (error) {
      next(error);
    }
  }

  // update event
  public async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { eventId } = req.params;
      const event: HydratedDocument<Event> =
        await EventService.updateEvent(eventId as string, req.body);
      sendResponse(res, 200, "Event updated successfully", event);
    } catch (error) {
      next(error);
    }
  }

  // delete event (soft delete)
  public async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { eventId } = req.params;
      const event: HydratedDocument<Event> =
        await EventService.deleteEvent(eventId as string);
      sendResponse(res, 200, "Event deleted successfully", event);
    } catch (error) {
      next(error);
    }
  }

  // delete event permanently (hard delete)
  public async deleteEventPermanently(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { eventId } = req.params;
      const event: HydratedDocument<Event> =
        await EventService.deleteEventPermanently(eventId as string);
      sendResponse(res, 200, "Event deleted successfully", event);
    } catch (error) {
      next(error);
    }
  }
}

export default new EventController();
