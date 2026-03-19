// shared/ipcChannels.ts — Single source of truth for IPC channel names
export const IPC = {
  OPEN_FOLDER_DIALOG: 'dialog:openFolder',
  OPEN_FILE_DIALOG: 'dialog:openFile',
  JOB_START: 'job:start',
  JOB_CANCEL: 'job:cancel',
  JOB_OUTPUT: 'job:output',
  JOB_PROGRESS: 'job:progress',
  JOB_COMPLETE: 'job:complete',
  JOB_ERROR: 'job:error',
  PROFILE_GETALL: 'profile:getAll',
  PROFILE_SAVE: 'profile:save',
  PROFILE_DELETE: 'profile:delete',
  HISTORY_GETALL: 'history:getAll',
  HISTORY_CLEAR: 'history:clear',
  SCHEDULER_CREATE: 'scheduler:create',
  SCHEDULER_DELETE: 'scheduler:delete',
  SCHEDULER_LIST: 'scheduler:list',
  PATH_VALIDATE: 'path:validate',
  APP_VERSION: 'app:version',
  MINIMIZE_WINDOW: 'window:minimize',
  MAXIMIZE_WINDOW: 'window:maximize',
  CLOSE_WINDOW: 'window:close',
  SAVE_LOG_FILE: 'log:saveFile',
} as const

export type IPCChannels = typeof IPC
