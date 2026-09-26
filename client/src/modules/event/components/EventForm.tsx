import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Modal } from "@mui/material";
import {
  LuCalendar,
  LuClock,
  LuEye,
  LuText,
  LuUsers,
  LuUserCheck,
  LuShieldCheck,
  LuActivity,
  LuCircleCheck,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Input from "@/shared/components/ui/forms/Input";
import SelectDropdown, {
  type SelectOption,
} from "@/shared/components/ui/dropdown/SelectDropdown";
import { useToast } from "@/shared/components/ui/toast";

import { useEventCreate } from "../hooks/use-event.create";
import { useEventUpdate } from "../hooks/use-event.update";
import { useEvent } from "../hooks/use-event";
import {
  initialEventState,
  type EventFormState,
} from "../state/initial-event.state";
import type { Event, EventFormData, EventVisibility } from "../types/event.types";

export interface EventFormProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  eventId?: string;
  currentEvent?: Event | Partial<Event> | Record<string, unknown> | null;
  eventData?: EventFormState;
  setEventData?: Dispatch<SetStateAction<EventFormState>>;
  onSuccess?: () => void;
}

const VISIBILITY_OPTIONS: SelectOption[] = [
  {
    value: "all",
    label: "Everyone (Public)",
    icon: <LuUsers size={14} className="text-indigo-500" />,
  },
  {
    value: "member",
    label: "Members Only",
    icon: <LuUserCheck size={14} className="text-emerald-500" />,
  },
  {
    value: "trainer",
    label: "Trainers Only",
    icon: <LuShieldCheck size={14} className="text-purple-500" />,
  },
];

const STATUS_OPTIONS: SelectOption[] = [
  {
    value: "true",
    label: "Active Event",
    icon: <LuCircleCheck size={14} className="text-emerald-500" />,
  },
  {
    value: "false",
    label: "Inactive",
    icon: <LuActivity size={14} className="text-amber-500" />,
  },
];

const formatToDateInput = (val?: string | Date | null): string => {
  if (!val) return "";
  try {
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return val;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

interface FormContentProps {
  initialValues: EventFormState;
  isEdit: boolean;
  targetId: string;
  onClose: () => void;
  setParentEventData?: Dispatch<SetStateAction<EventFormState>>;
  onSuccess?: () => void;
}

const EventFormContent = ({
  initialValues,
  isEdit,
  targetId,
  onClose,
  setParentEventData,
  onSuccess,
}: FormContentProps) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<EventFormState>(initialValues);

  // Create mutation
  const { mutate: createEventMutate, isPending: isCreating } = useEventCreate({
    onSuccess: () => {
      addToast({
        type: "success",
        message: "Event scheduled and published successfully.",
      });
      setFormData(initialEventState);
      setParentEventData?.(initialEventState);
      onClose();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to create event. Please try again.";
      addToast({
        type: "error",
        message: errorMsg,
      });
    },
  });

  // Update mutation
  const { mutate: updateEventMutate, isPending: isUpdating } = useEventUpdate({
    onSuccess: () => {
      addToast({
        type: "success",
        message: "Event updated successfully.",
      });
      onClose();
      onSuccess?.();
    },
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Failed to update event. Please try again.";
      addToast({
        type: "error",
        message: errorMsg,
      });
    },
  });

  const isSubmitting = isCreating || isUpdating;

  // Handle text input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setParentEventData?.(updated);
      return updated;
    });
  };

  // Handle dropdown value changes
  const handleSelectChange = (
    name: keyof EventFormState,
    value: string | boolean,
  ) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setParentEventData?.(updated);
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast({
        type: "warning",
        message: "Please enter an event title.",
      });
      return;
    }

    if (!formData.date) {
      addToast({
        type: "warning",
        message: "Please select an event date.",
      });
      return;
    }

    if (!formData.time.trim()) {
      addToast({
        type: "warning",
        message: "Please specify the event time.",
      });
      return;
    }

    const payload: EventFormData = {
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time.trim(),
      visibility: formData.visibility as EventVisibility,
      description: formData.description?.trim() || undefined,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
    };

    if (isEdit) {
      const idToUpdate = targetId || formData.eventId;

      if (!idToUpdate) {
        addToast({
          type: "error",
          message: "Unable to identify event for update.",
        });
        return;
      }

      updateEventMutate({ id: idToUpdate, data: payload });
    } else {
      createEventMutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-5">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Event Title */}
        <div className="sm:col-span-12">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            Event Title *
          </span>
          <Input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. CrossFit Summer Open 2026"
            required
          />
        </div>

        {/* Event Date */}
        <div className="sm:col-span-6">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <LuCalendar size={13} className="text-indigo-500" />
            Date *
          </span>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Event Time */}
        <div className="sm:col-span-6">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <LuClock size={13} className="text-indigo-500" />
            Time *
          </span>
          <Input
            name="time"
            type="time"
            value={formData.time}
            onChange={handleInputChange}
            placeholder="e.g. 10:00"
            required
          />
        </div>

        {/* Visibility */}
        <div
          className={`relative z-30 ${isEdit ? "sm:col-span-6" : "sm:col-span-12"}`}
        >
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <LuEye size={13} className="text-indigo-500" />
            Visibility *
          </span>
          <SelectDropdown
            options={VISIBILITY_OPTIONS}
            value={formData.visibility}
            onChange={(val) => handleSelectChange("visibility", val)}
            className="w-full py-2.5"
          />
        </div>

        {/* Status (shown in Edit mode) */}
        {isEdit && (
          <div className="sm:col-span-6 relative z-20">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <LuActivity size={13} className="text-indigo-500" />
              Status *
            </span>
            <SelectDropdown
              options={STATUS_OPTIONS}
              value={String(Boolean(formData.isActive))}
              onChange={(val) =>
                handleSelectChange("isActive", val === "true")
              }
              className="w-full py-2.5"
            />
          </div>
        )}

        {/* Description */}
        <div className="sm:col-span-12 relative z-10">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <LuText size={13} className="text-indigo-500" />
            Description (Optional)
          </span>
          <Input
            name="description"
            type="text-box"
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter event details, prerequisites, location or instructions..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {isEdit ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </form>
  );
};

const EventForm = ({
  open,
  onClose,
  isEdit = false,
  eventId,
  currentEvent,
  eventData,
  setEventData,
  onSuccess,
}: EventFormProps) => {
  // Extract event ID for edit
  const targetId =
    eventId ||
    (currentEvent as { _id?: string; eventId?: string } | null | undefined)?._id ||
    (currentEvent as { _id?: string; eventId?: string } | null | undefined)?.eventId ||
    (eventData as { _id?: string; eventId?: string } | null | undefined)?.eventId ||
    (eventData as { _id?: string; eventId?: string } | null | undefined)?._id ||
    "";

  // Check if currentEvent already has populated details
  const hasFullEventDetails = Boolean(
    (currentEvent as { title?: string } | null | undefined)?.title,
  );

  // Fetch full event details from API if editing and not already loaded
  const { data: fetchedResponse, isLoading: isFetching } = useEvent(targetId, {
    enabled: Boolean(open && isEdit && targetId && !hasFullEventDetails),
  });

  // Determine initial values for form
  const rawSource = (fetchedResponse?.data ||
    (currentEvent && Object.keys(currentEvent).length > 0
      ? currentEvent
      : null) ||
    (eventData && (eventData.title || eventData.date)
      ? eventData
      : null)) as
    | (Event & { _id?: string; eventId?: string })
    | null
    | undefined;

  const initialValues: EventFormState = isEdit && rawSource
    ? {
        ...initialEventState,
        eventId: rawSource.eventId || rawSource._id || targetId || undefined,
        title: rawSource.title || "",
        date: formatToDateInput(rawSource.date),
        time: rawSource.time || "",
        visibility:
          (rawSource.visibility as EventVisibility) || "all",
        description: rawSource.description || "",
        isActive: rawSource.isActive !== undefined ? rawSource.isActive : true,
      }
    : {
        ...initialEventState,
        title: eventData?.title || "",
        date: formatToDateInput(eventData?.date),
        time: eventData?.time || "",
        visibility: eventData?.visibility || "all",
        description: eventData?.description || "",
        isActive: eventData?.isActive !== undefined ? eventData.isActive : true,
      };

  return (
    <Modal
      open={Boolean(open)}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[85%] max-w-xl md:max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-2xl outline-none p-6 md:p-7 text-slate-800 dark:text-slate-100 transition-all duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-xs shrink-0">
              <LuCalendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {isEdit ? "Edit Event" : "Create New Event"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isEdit
                  ? "Update event schedule, details, and visibility settings."
                  : "Plan and publish a new event to the community calendar."}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        {isFetching ? (
          <div className="py-14 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Loading event details...
            </span>
          </div>
        ) : (
          <EventFormContent
            key={`${open}-${isEdit}-${targetId || "new"}`}
            initialValues={initialValues}
            isEdit={isEdit}
            targetId={targetId}
            onClose={onClose}
            setParentEventData={setEventData}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </Modal>
  );
};

export default EventForm;
