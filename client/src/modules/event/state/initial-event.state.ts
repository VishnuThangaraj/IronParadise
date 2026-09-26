export interface EventFormState {
  eventId?: string;
  title: string;
  date: string;
  time: string;
  visibility: "all" | "member" | "trainer" | "private";
  description: string;
  isActive?: boolean;
}

export const initialEventState: EventFormState = {
  title: "",
  date: "",
  time: "",
  visibility: "all",
  description: "",
  isActive: true,
};

export default initialEventState;
