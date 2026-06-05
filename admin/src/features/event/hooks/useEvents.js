import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";

const useEvents = () => {
  const token = useSelector(selectToken);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Track currently fetched range to ease refetching
  const [currentRange, setCurrentRange] = useState({ start: null, end: null });

  const fetchEvents = useCallback(async (startDate, endDate) => {
    if (!startDate || !endDate) return;
    setIsLoading(true);
    setCurrentRange({ start: startDate, end: endDate });
    try {
      const response = await api.get("event/all", {
        params: { start_date: startDate, end_date: endDate },
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data || []);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const triggerRefetch = useCallback(() => {
    if (currentRange.start && currentRange.end) {
      fetchEvents(currentRange.start, currentRange.end);
    }
  }, [currentRange, fetchEvents]);

  const addEvent = async (eventData) => {
    try {
      const response = await api.post("event/create", eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event created successfully");
      triggerRefetch();
      return response.data?.event;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create event");
      return null;
    }
  };

  const editEvent = async (eventId, eventData) => {
    try {
      const response = await api.put(`event/update/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event updated successfully");
      triggerRefetch();
      return response.data?.event;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update event");
      return null;
    }
  };

  const removeEvent = async (eventId) => {
    try {
      await api.delete(`event/delete/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event deleted successfully");
      triggerRefetch();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete event");
      return false;
    }
  };

  return {
    events,
    isLoading,
    fetchEvents,
    addEvent,
    editEvent,
    removeEvent
  };
};

export default useEvents;
