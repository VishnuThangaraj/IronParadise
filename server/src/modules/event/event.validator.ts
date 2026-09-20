import { z } from "zod";

export const eventVisibilityEnum = z.enum(
  ["all", "member", "trainer", "private"],
  { message: "Visibility looks off — pick all, member, trainer, or private" },
);

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Event title's missing — add one")
    .max(100, "Event title's too long — shorten it a bit"),
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .optional(),
  date: z.coerce.date({
    message: "Event date's missing — add a valid date",
  }),
  time: z
    .string()
    .trim()
    .min(1, "Event time's missing — add one")
    .max(50, "Event time's too long — shorten it a bit"),
  visibility: eventVisibilityEnum.default("all"),
});

export const eventUpdateSchema = eventSchema.partial().extend({
  visibility: eventVisibilityEnum.optional(),
  isActive: z
    .boolean({ message: "Status looks off — pick active or inactive" })
    .optional(),
});

export type CreateEventInput = z.infer<typeof eventSchema>;
export type UpdateEventInput = z.infer<typeof eventUpdateSchema>;
