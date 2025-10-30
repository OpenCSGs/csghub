import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProfileEdit from '@/components/user_settings/ProfileEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Mock dependencies
vi.mock('@/packs/csrfFetch.js', () => ({
  default: vi.fn((url, options) => {
    if (url === '/internal_api/users/sms') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    }
    if (url === '/internal_api/upload') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: 'https://example.com/avatar.jpg' })
      })
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    })
  })
}))

// by using vi.hoisted to hoist the mock functionality
let { useFetchApiMock } = vi.hoisted(() => {
  return { useFetchApiMock: vi.fn((url, options) => ({
    put: () => ({
      json: () => Promise.resolve({ error: { value: null } })
    })
  }))
}})

const updateInitalized = vi.fn((value) => {
  mockUserStore.isInitialized = value
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}));

vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  ElMessageBox: {
    confirm: vi.fn((message, title, options) => Promise.resolve())
  }
}))

// Mock user store
let mockUserStore = {
  uuid: 'test-uuid',
  email: 'test@example.com',
  username: 'testuser',
  nickname: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  phone: '13800138000',
  homepage: 'https://example.com',
  bio: 'Test bio',
  updateInitalized: updateInitalized,
  refreshCanChangeUsernameCookie: vi.fn(),
  canChangeUsername: false,
  isInitialized: true,
}

vi.mock('@/stores/UserStore.js', () => ({
  default: vi.fn(() => mockUserStore)
}))

// Mock storeToRefs
vi.mock('pinia', () => ({
  storeToRefs: (store) => {
    // Create a ref object for each property in the store
    const refs = {}
    Object.keys(store).forEach(key => {
      if (typeof store[key] !== 'function') {
        refs[key] = { value: store[key] }
      }
    })
    return refs
  }
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      set: vi.fn()
    }
  })
}))

vi.mock('@/packs/utils', () => ({
  isBlank: (value) => !value || value.trim() === ''
}))

vi.mock('@/packs/refreshJWT.js', () => ({
  default: vi.fn()
}))

// Mock global properties and methods
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true
  })
)

// Create test wrapper
const createWrapper = () => {
  // const saveProfile = vi.fn()
  return mount(ProfileEdit, {
    global: {
      stubs: {
        'el-avatar': true,
        'el-input': true,
        'el-form': true,
        'el-form-item': true,
        'CsgButton': true
      },
      mocks: {
        $t: (key) => key
      }
    }
  })
}

describe('ProfileEdit.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts component correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays correct account settings title', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('profile.accountSetting')
  })

  it('triggers file input click when upload avatar button is clicked', async () => {
    const wrapper = createWrapper()
    // Mock fileInput ref
    wrapper.vm.fileInput = { click: vi.fn() }
    const clickSpy = vi.spyOn(wrapper.vm.fileInput, 'click')

    // Find and click the upload avatar button
    await wrapper.find('.btn.btn-secondary-gray.btn-sm').trigger('click')

    expect(clickSpy).toHaveBeenCalled()
  })

  it('clears avatar when remove avatar button is clicked', async () => {
    const wrapper = createWrapper()

    wrapper.vm.profileData.avatar.value = 'https://example.com/avatar.jpg'

    await wrapper.find('.btn.btn-outline-danger.btn-sm').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.profileData.avatar.value).toBe('')
    expect(wrapper.vm.fileInput.value).toBe('')
  })

  it('validates email format correctly', () => {
    const wrapper = createWrapper()
    const validator = wrapper.vm.validator

    // Test empty email
    const emptyCallback = vi.fn()
    validator({}, '', emptyCallback)
    expect(emptyCallback).toHaveBeenCalledWith(expect.any(Error))

    // Test invalid email
    const invalidCallback = vi.fn()
    validator({}, 'invalid-email', invalidCallback)
    expect(invalidCallback).toHaveBeenCalledWith(expect.any(Error))

    // Test valid email
    const validCallback = vi.fn()
    validator({}, 'valid@example.com', validCallback)
    expect(validCallback).toHaveBeenCalledWith()
  })

  it('shows warning when saving profile with empty username', async () => {
    const wrapper = createWrapper()
    wrapper.vm.profileData.username = ''

    await wrapper.vm.saveProfile()

    expect(ElMessage.warning).toHaveBeenCalledWith('Please provide username')
  })

  it('shows confirmation dialog when updating profile if username can be changed', async () => {
    mockUserStore.canChangeUsername = true
    const wrapper = createWrapper()
    await wrapper.vm.confirmUpdateProfile()

    expect(ElMessageBox.confirm).toHaveBeenCalled()
  })

  it('saves profile directly when updating profile if username cannot be changed', async () => {
    mockUserStore.canChangeUsername = false
    const wrapper = createWrapper()
    wrapper.vm.formRef = {
      validate: (callback) => callback(true, null)
    }
    await wrapper.vm.confirmUpdateProfile()

    expect(ElMessageBox.confirm).not.toHaveBeenCalled()
  })

  it('shows success message after updating profile successfully', async () => {
    const wrapper = createWrapper()

    // Set necessary properties
    wrapper.vm.profileData = {
      value: {
        username: 'testuser',
        email: 'test@example.com',
        phone: '13800138000',
        avatar: 'https://example.com/avatar.jpg',
        nickname: 'Test User',
        homepage: 'https://example.com',
        bio: 'Test bio'
      }
    }
    wrapper.vm.form = { email: 'test@example.com' }

    // Mock form validation
    wrapper.vm.formRef = {
      validate: (callback) => callback(true, null)
    }

    await wrapper.vm.saveProfile()
    await flushPromises()

    expect(ElMessage.success).toHaveBeenCalled()
  })

  it('triggers updateHasSave event when input changes', async () => {
    const wrapper = createWrapper()

    await wrapper.vm.handleInputChange()

    expect(wrapper.emitted('updateHasSave')).toBeTruthy()
    expect(wrapper.emitted('updateHasSave')[0]).toEqual([false])
  })

  it('updates avatar URL after successful upload', async () => {
    const wrapper = createWrapper()

    // Set necessary properties
    wrapper.vm.profileData.avatar.value = ''

    // Mock file input
    wrapper.vm.fileInput = {
      files: [new File([''], 'avatar.jpg', { type: 'image/jpeg' })]
    }

    await wrapper.vm.uploadAvatar()
    await flushPromises()

    expect(wrapper.vm.profileData.avatar.value).toBe('https://example.com/avatar.jpg')
  })

  it('removes empty or undefined values from params', async () => {
    mockUserStore.avatar = ''
    mockUserStore.nickname = undefined
    mockUserStore.homepage = ''

    const wrapper = createWrapper()

    wrapper.vm.formRef = {
      validate: (callback) => callback(true, null)
    }

    await wrapper.vm.saveProfile()
    await flushPromises()

    expect(useFetchApiMock).toHaveBeenCalled()
    const options = useFetchApiMock.mock.calls[0][1]
    const params = JSON.parse(options.body)

    expect(params).not.toHaveProperty('avatar')
    expect(params).not.toHaveProperty('nickname')
    expect(params).not.toHaveProperty('homepage')

    expect(params).toHaveProperty('username', 'testuser')
    expect(params).toHaveProperty('email', 'test@example.com')
    expect(params).toHaveProperty('phone', '13800138000')
    expect(params).toHaveProperty('bio', 'Test bio')
  })

  it('adds new_username to params when canChangeUsername is true', async () => {
    mockUserStore.canChangeUsername = true

    const wrapper = createWrapper()

    wrapper.vm.formRef = {
      validate: (callback) => callback(true, null)
    }

    await wrapper.vm.saveProfile()
    await flushPromises()

    expect(useFetchApiMock).toHaveBeenCalled()
    const options = useFetchApiMock.mock.calls[0][1]
    const params = JSON.parse(options.body)
    expect(params).toHaveProperty('new_username', 'testuser')
  })

  it('reset userstore initialize status after data changed', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.userStore.isInitialized).toBe(true)

    wrapper.vm.userStore.updateInitalized(false)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.userStore.isInitialized).toBe(false)
  })
})