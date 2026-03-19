import { z } from 'zod'

export const CopyFlagsSchema = z.object({
  data: z.boolean(),
  attributes: z.boolean(),
  timestamps: z.boolean(),
  security: z.boolean(),
  owner: z.boolean(),
  auditing: z.boolean(),
})

export const DirCopyFlagsSchema = z.object({
  data: z.boolean(),
  attributes: z.boolean(),
  timestamps: z.boolean(),
})

export const JobConfigSchema = z.object({
  source: z.string(),
  destination: z.string(),
  uiMode: z.enum(['basic', 'advanced', 'expert']),
  copyMode: z.enum(['copy', 'mirror', 'move', 'moveFiles']),
  includeFiles: z.array(z.string()),
  excludeFiles: z.array(z.string()),
  excludeDirs: z.array(z.string()),
  threads: z.number().int().min(1).max(128),
  retryCount: z.number().int().min(0),
  retryWait: z.number().int().min(0),
  restartable: z.boolean(),
  backupMode: z.boolean(),
  unbufferedIO: z.boolean(),
  ipg: z.number().int().min(0),
  copyFlags: CopyFlagsSchema,
  dirCopyFlags: DirCopyFlagsSchema,
  excludeNewer: z.boolean(),
  excludeOlder: z.boolean(),
  excludeChanged: z.boolean(),
  excludeLonely: z.boolean(),
  excludeJunctions: z.boolean(),
  fatTimes: z.boolean(),
  compensateDst: z.boolean(),
  verbose: z.boolean(),
  showEta: z.boolean(),
  logFile: z.string(),
  appendLog: z.boolean(),
  noProgress: z.boolean(),
  noJobHeader: z.boolean(),
  noJobSummary: z.boolean(),
  expertFlags: z.string(),
  scheduleEnabled: z.boolean(),
  scheduleType: z.enum(['daily', 'weekly', 'once']),
  scheduleTime: z.string().regex(/^\d{2}:\d{2}$/),
  scheduleDays: z.array(z.number().int().min(0).max(6)),
})

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  icon: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  config: JobConfigSchema,
})

export const HistoryEntrySchema = z.object({
  id: z.string(),
  profileName: z.string(),
  source: z.string(),
  destination: z.string(),
  command: z.string(),
  startedAt: z.string(),
  finishedAt: z.string(),
  exitCode: z.number().int(),
  exitMessage: z.string(),
  filesCopied: z.number().int().min(0),
  bytesCopied: z.number().min(0),
  errors: z.number().int().min(0),
  duration: z.number().min(0),
})

export type ValidatedProfile = z.infer<typeof ProfileSchema>
export type ValidatedHistoryEntry = z.infer<typeof HistoryEntrySchema>
