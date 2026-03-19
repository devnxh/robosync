import Store from 'electron-store'
import { HistoryEntrySchema } from '../../src/types/schemas'
import type { HistoryEntry } from '../../src/types/RobocopyJob'

const MAX_HISTORY_ENTRIES = 500

interface HistoryStoreSchema {
  history: unknown[]
}

const store = new Store<HistoryStoreSchema>({
  name: 'robosync-history',
  defaults: {
    history: []
  }
})

export class JobHistoryStore {
  getAll(): HistoryEntry[] {
    const raw = store.get('history', []) as unknown[]
    const valid: HistoryEntry[] = []
    for (const item of raw) {
      const result = HistoryEntrySchema.safeParse(item)
      if (result.success) {
        valid.push(result.data as HistoryEntry)
      } else {
        console.warn('[JobHistoryStore] Skipping invalid history entry:', result.error.message)
      }
    }
    return valid
  }

  add(entry: HistoryEntry): void {
    const history = this.getAll()
    history.push(entry)

    // FIFO — keep only the latest MAX_HISTORY_ENTRIES
    while (history.length > MAX_HISTORY_ENTRIES) {
      history.shift()
    }

    store.set('history', history)
  }

  clear(): void {
    store.set('history', [])
  }
}
