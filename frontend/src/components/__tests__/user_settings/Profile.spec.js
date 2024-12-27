import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import Profile from '../../user_settings/Profile.vue'

let userStoreData = {
  username: 'current_user',
  nickname: 'current_user',
  email: 'current_user@test.com',
  avatar: 'current_user.com',
  roles: ['admin'],
  orgs: [
    {
      path: 'org_one',
      logo: 'org_one.png'
    }
  ],
  lastLoginTime: '2023-09-11',
  phone: '123456'
}
vi.mock('../../../stores/UserStore', () => ({
  default: () => (userStoreData)
}))