import { Schema, model, type InferSchemaType } from "mongoose";

const attendanceSchema = new Schema(
  {
    attendanceId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["trainer", "member"],
      required: true,
      lowercase: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    checkIn: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "present",
        "absent",
        "checked_in",
        "checked_out",
        "late",
        "half_day",
      ],
      default: "present",
    },
    entryMethod: {
      type: String,
      enum: ["kiosk", "manual", "qr", "rfid", "biometric"],
      default: "kiosk",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

// Compound indexes for optimal querying
attendanceSchema.index({ userId: 1, date: -1 });
attendanceSchema.index({ date: -1, role: 1 });
attendanceSchema.index({ date: -1, status: 1 });

// Automatically compute duration in minutes if checkOut is present
attendanceSchema.pre("save", function () {
  if (this.checkIn && this.checkOut) {
    const diffMs =
      new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime();
    if (diffMs > 0) {
      this.durationMinutes = Math.round(diffMs / (1000 * 60));
    }
  }
});

export type Attendance = InferSchemaType<typeof attendanceSchema>;

const AttendanceModel = model<Attendance>("Attendance", attendanceSchema);

export default AttendanceModel;
