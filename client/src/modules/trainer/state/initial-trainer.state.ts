import {
  UserRole,
  UserGender,
  UserPermission,
  EmergencyContact,
} from "@/shared/types/User.types";
import { ShiftTime } from "../types/trainer.types";

export interface TrainerFormState {
  fullName: string;
  dob: string;
  profileImage: string;
  gender: UserGender;
  email: string;
  phone: string;
  address: string;
  permissions: UserPermission[];
  role: UserRole;
  emergencyContact: EmergencyContact | null;

  joinDate: string;
  experienceYears: number;
  salary: number;
  specialization: string[];
  qualification: string;
  shiftTime: ShiftTime;
  employmentStatus: "active" | "inactive" | "on_leave" | "terminated";
}

export const initialTrainerState: TrainerFormState = {
  fullName: "",
  dob: "",
  profileImage: "",
  gender: "male",
  email: "",
  phone: "",
  address: "",
  permissions: ["members", "dietplans", "workoutplans"],
  role: "trainer",
  emergencyContact: null,

  joinDate: "",
  experienceYears: 0,
  salary: 0,
  specialization: [],
  qualification: "",
  shiftTime: {
    start: "09:00",
    end: "17:00",
  },
  employmentStatus: "active",
};

export default initialTrainerState;
