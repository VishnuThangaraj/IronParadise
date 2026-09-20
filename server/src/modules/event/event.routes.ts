import { Router } from "express";

import EventController from "./event.controller.js";
import { eventSchema, eventUpdateSchema } from "./event.validator.js";

import { validate } from "../../shared/middlewares/validate.middleware.js";
import { authenticate } from "../../shared/middlewares/auth.middleware.js";
import { authorize } from "../../shared/middlewares/authorize.middleware.js";

const router: Router = Router();

// Create Event
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(eventSchema),
  EventController.createEvent,
);

// Fetch all Events
router.get(
  "/",
  authenticate,
  authorize("admin", "trainer", "member"),
  EventController.fetchAllEvents,
);

// Fetch Event with Id
router.get(
  "/:eventId",
  authenticate,
  authorize("admin", "trainer", "member"),
  EventController.getEventById,
);

// Update Event
router.patch(
  "/:eventId",
  authenticate,
  authorize("admin", "trainer"),
  validate(eventUpdateSchema),
  EventController.updateEvent,
);

// Delete Event (soft delete)
router.delete(
  "/:eventId",
  authenticate,
  authorize("admin", "trainer"),
  EventController.deleteEvent,
);

// Delete Event (hard delete)
router.delete(
  "/:eventId/permanent",
  authenticate,
  authorize("admin", "trainer"),
  EventController.deleteEventPermanently,
);

export default router;

