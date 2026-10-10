import { z } from "zod";

export const attendanceRoleEnum = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.enum(["trainer", "member"], {
    message: "Role looks off — pick trainer or member",
  }),
);

export const attendanceStatusEnum = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.enum(
    [
      "present",
      "absent",
      "checked_in",
      "checked_out",
      "late",
      "half_day",
    ],
    {
      message:
        "Status looks off — pick present, absent, checked_in, checked_out, late, or half_day",
    },
  ),
);

export const attendanceEntryMethodEnum = z.preprocess(
  (val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
  z.enum(["kiosk", "manual", "qr", "rfid", "biometric"], {
    message:
      "Entry method looks off — pick kiosk, manual, qr, rfid, or biometric",
  }),
);

// Schema for Kiosk / Quick Check-In
export const checkInSchema = z.object({
  userId: z
    .string({ message: "User ID is required" })
    .trim()
    .min(3, "User ID is too short — add at least 3 characters")
    .max(20, "User ID is too long — keep it under 20 characters")
    .transform((val) => val.toUpperCase()),
  role: attendanceRoleEnum.optional(),
  date: z.coerce.date().optional(),
  checkIn: z.coerce.date().optional(),
  entryMethod: attendanceEntryMethodEnum.default("kiosk"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

// Schema for Kiosk / Quick Check-Out
export const checkOutSchema = z
  .object({
    userId: z
      .string()
      .trim()
      .min(3, "User ID is too short")
      .max(20, "User ID is too long")
      .transform((val) => val.toUpperCase())
      .optional(),
    attendanceId: z
      .string()
      .trim()
      .toUpperCase()
      .optional(),
    checkOut: z.coerce.date().optional(),
    notes: z
      .string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.userId || data.attendanceId, {
    message: "Either userId or attendanceId is required for check-out",
  });

// Schema for manual creation / admin entry
export const createAttendanceSchema = z.object({
  attendanceId: z.string().trim().toUpperCase().optional(),
  userId: z
    .string({ message: "User ID is required" })
    .trim()
    .min(3, "User ID is too short — add at least 3 characters")
    .max(20, "User ID is too long — keep it under 20 characters")
    .transform((val) => val.toUpperCase()),
  role: attendanceRoleEnum,
  date: z.coerce.date().default(() => new Date()),
  checkIn: z.coerce.date().default(() => new Date()),
  checkOut: z.coerce.date().nullable().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  status: attendanceStatusEnum.default("present"),
  entryMethod: attendanceEntryMethodEnum.default("manual"),
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional()
    .default(""),
});

// Schema for updating an existing attendance record
export const updateAttendanceSchema = z.object({
  date: z.coerce.date().optional(),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().nullable().optional(),
  durationMinutes: z.coerce.number().min(0).optional(),
  status: attendanceStatusEnum.optional(),
  entryMethod: attendanceEntryMethodEnum.optional(),
  notes: z
    .string()
    .trim()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

// Query parameters validation schema
export const attendanceQuerySchema = z.object({
  userId: z.string().trim().toUpperCase().optional(),
  role: attendanceRoleEnum.optional(),
  status: attendanceStatusEnum.optional(),
  date: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  entryMethod: attendanceEntryMethodEnum.optional(),
  search: z.string().trim().optional(),
});

// Aliases matching project conventions
export const attendanceSchema = createAttendanceSchema;
export const attendanceUpdateSchema = updateAttendanceSchema;

// Inferred TypeScript types
export type AttendanceRole = z.infer<typeof attendanceRoleEnum>;
export type AttendanceStatus = z.infer<typeof attendanceStatusEnum>;
export type AttendanceEntryMethod = z.infer<typeof attendanceEntryMethodEnum>;
export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
export type AttendanceQueryInput = z.infer<typeof attendanceQuerySchema>;
