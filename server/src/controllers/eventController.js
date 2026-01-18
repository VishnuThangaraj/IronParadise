const Event = require("../models/Event");

// Create New Event
const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
    });

    await event.save();

    const eventResponse = event.toObject();

    res.status(201).json({
      message: `Event Added successfully`,
      event: eventResponse,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch All Events
const fetchAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// Fetch Event by Id
const fetchEventById = async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event: event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createEvent, fetchAllEvents, fetchEventById };
