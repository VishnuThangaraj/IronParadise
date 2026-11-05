import { Schema, model, type InferSchemaType, type Model } from "mongoose";

export type CronJobStatus = "IDLE" | "RUNNING" | "COMPLETED" | "FAILED";
export type CronTriggerType = "SCHEDULE" | "STARTUP_CATCHUP" | "MANUAL";

export interface CronJobStateAttrs {
  jobName: string;
  schedule: string;
  timezone: string;
  status: CronJobStatus;
  lastStartedAt?: Date | null;
  lastCompletedAt?: Date | null;
  lastExecutionDurationMs?: number | null;
  lastError?: string | null;
  lastSummary?: Record<string, unknown> | null;
  lockedAt?: Date | null;
}

const cronJobStateSchema = new Schema(
  {
    jobName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    schedule: {
      type: String,
      required: true,
      trim: true,
    },
    timezone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
    },
    status: {
      type: String,
      enum: ["IDLE", "RUNNING", "COMPLETED", "FAILED"],
      default: "IDLE",
      required: true,
    },
    lastStartedAt: {
      type: Date,
      default: null,
    },
    lastCompletedAt: {
      type: Date,
      default: null,
    },
    lastExecutionDurationMs: {
      type: Number,
      default: null,
    },
    lastError: {
      type: String,
      default: null,
    },
    lastSummary: {
      type: Schema.Types.Mixed,
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "cron_job_states",
    timestamps: true,
  },
);

export type CronJobStateDoc = InferSchemaType<typeof cronJobStateSchema>;

export const CronJobStateModel = model<CronJobStateDoc>(
  "CronJobState",
  cronJobStateSchema,
);

const cronJobHistorySchema = new Schema(
  {
    jobName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    triggerType: {
      type: String,
      enum: ["SCHEDULE", "STARTUP_CATCHUP", "MANUAL"],
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "FAILED"],
      required: true,
    },
    durationMs: {
      type: Number,
      required: true,
    },
    summary: {
      type: Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
  },
  {
    collection: "cron_job_history",
    timestamps: { createdAt: true, updatedAt: false },
  },
);

cronJobHistorySchema.index({ jobName: 1, createdAt: -1 });

export type CronJobHistoryDoc = InferSchemaType<typeof cronJobHistorySchema>;

export const CronJobHistoryModel = model<CronJobHistoryDoc>(
  "CronJobHistory",
  cronJobHistorySchema,
);
