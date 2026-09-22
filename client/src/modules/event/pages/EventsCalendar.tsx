import Button from "@/shared/components/ui/buttons/Button";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import { FiPlus } from "react-icons/fi";

const EventsCalendar = () => {
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
            aria-label="Add Member"
          >
            <div className="flex justify-between items-center gap-2">
              <FiPlus /> <span>Add Event</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-6">

      </div>
    </div>
  );
};

export default EventsCalendar;
