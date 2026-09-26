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
      const { month, year, activeOnly, filterActiveOnly } = req.query;
      const shouldFilterActive =
        activeOnly === "true" || filterActiveOnly === "true";

      if (month !== undefined || year !== undefined) {
        const result = await EventService.getEventsByMonth(
          month as string | undefined,
          year as string | undefined,
          shouldFilterActive,
        );
        sendResponse(res, 200, "Events fetched successfully", result);
        return;
      }

      const events: HydratedDocument<Event>[] =
        await EventService.getAllEvents(shouldFilterActive);
      sendResponse(res, 200, "Events fetched successfully", events);
    } catch (error) {
      next(error);
    }
  }

  // fetch event by month and year (defaults to current month/year if omitted, includes birthdays)
  public async getEventsByMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const month = req.query.month ?? req.params.month;
      const year = req.query.year ?? req.params.year;
      const activeOnly =
        req.query.activeOnly === "true" || req.query.filterActiveOnly === "true";

      const result = await EventService.getEventsByMonth(
        month as string | undefined,
        year as string | undefined,
        activeOnly,
      );
      sendResponse(res, 200, "Events fetched successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // alias for getEventsByMonth
  public getEventByMonth = this.getEventsByMonth;

  // fetch birthdays by month
  public async getBirthdaysByMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const month = req.query.month ?? req.params.month;
      const year = req.query.year ?? req.params.year;
      const activeOnly =
        req.query.activeOnly !== "false" &&
        req.query.filterActiveOnly !== "false";

      const birthdays = await EventService.getBirthdaysByMonth(
        month as string | undefined,
        year as string | undefined,
        activeOnly,
      );
      sendResponse(res, 200, "Birthdays fetched successfully", birthdays);
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
