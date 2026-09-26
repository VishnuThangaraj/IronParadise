import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import Button from "@/shared/components/ui/buttons/Button";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import EventForm from "../components/EventForm";
import { initialEventState } from "../state/initial-event.state";

const EventsCalendar = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  // const [openDelete, setOpenDelete] = useState(false);

  const [eventData, setEventData] = useState(initialEventState);
  const [currentEvent, setCurrentEvent] = useState({});

  // handle close event form
  const handleCloseEventForm = () => {
    setIsEdit(false);
    setCurrentEvent({});
    setEventData(initialEventState);
    setOpenForm(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions Bar */}{" "}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Event Management"
            description="Plan, schedule, and track fitness activities and gym workshops."
          />
        </div>
        <div>
          <Button
            variant="primary"
            className="font-semibold text-sm px-4!"
            aria-label="Add Event"
            onClick={() => setOpenForm(true)}
          >
            <div className="flex justify-between items-center gap-2">
              <FiPlus /> <span>Add Event</span>
            </div>
          </Button>
        </div>
      </div>
      <div className="flex justify-between gap-6"></div>
      {/* Create Event Modal */}
      <EventForm
        open={openForm}
        onClose={handleCloseEventForm}
        isEdit={isEdit}
        currentEvent={currentEvent}
        eventData={eventData}
        setEventData={setEventData}
        onSuccess={() => {
          setEventData(initialEventState);
        }}
      />
    </div>
  );
};

export default EventsCalendar;
