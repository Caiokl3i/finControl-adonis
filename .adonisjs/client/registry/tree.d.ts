/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  categories: {
    categories: {
      index: typeof routes['categories.categories.index']
      show: typeof routes['categories.categories.show']
      store: typeof routes['categories.categories.store']
      update: typeof routes['categories.categories.update']
      destroy: typeof routes['categories.categories.destroy']
    }
  }
  dashboard: {
    index: typeof routes['dashboard.index']
  }
}
