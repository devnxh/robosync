import Store from 'electron-store'
import { ProfileSchema } from '../../src/types/schemas'
import type { Profile } from '../../src/types/RobocopyJob'

interface ProfileStoreSchema {
  profiles: unknown[]
}

const store = new Store<ProfileStoreSchema>({
  name: 'robosync-profiles',
  defaults: {
    profiles: []
  }
})

export class ProfileStore {
  getAll(): Profile[] {
    const raw = store.get('profiles', []) as unknown[]
    const valid: Profile[] = []
    for (const item of raw) {
      const result = ProfileSchema.safeParse(item)
      if (result.success) {
        valid.push(result.data as Profile)
      } else {
        console.warn('[ProfileStore] Skipping invalid profile:', result.error.message)
      }
    }
    return valid
  }

  save(profile: Profile): void {
    const profiles = this.getAll()
    const index = profiles.findIndex((p) => p.id === profile.id)

    if (index >= 0) {
      profiles[index] = { ...profile, updatedAt: new Date().toISOString() }
    } else {
      profiles.push({
        ...profile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    store.set('profiles', profiles)
  }

  delete(id: string): void {
    const profiles = this.getAll().filter((p) => p.id !== id)
    store.set('profiles', profiles)
  }

  getById(id: string): Profile | undefined {
    return this.getAll().find((p) => p.id === id)
  }
}
