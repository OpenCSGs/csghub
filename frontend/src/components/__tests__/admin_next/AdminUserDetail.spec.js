import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminUserDetail from '@/components/admin_next/users/AdminUserDetail.vue'

const { deleteUser, fetchUser, routerPush, useFetchApiMock } = vi.hoisted(() => ({
  deleteUser: vi.fn(),
  fetchUser: vi.fn(),
  routerPush: vi.fn(),
  useFetchApiMock: vi.fn()
}))

vi.mock('element-plus', () => ({
  ElMessage: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn()
  }),
  ElMessageBox: {
    confirm: vi.fn()
  }
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: 'user-uuid' } }),
  useRouter: () => ({ push: routerPush })
}))

vi.mock('@/components/admin_next/router', () => ({
  BASE_URL: '/admin_panel'
}))

vi.mock('@/stores/UserStore', () => ({
  default: () => ({ username: 'admin-user' })
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

const createWrapper = () => mount(AdminUserDetail, {
  global: {
    stubs: {
      Container: { template: '<section><slot /></section>' },
      Card: { template: '<article><slot /><footer><slot name="footer" /></footer></article>' },
      CsgButton: {
        inheritAttrs: false,
        props: ['name'],
        template: '<button :class="$attrs.class" @click="$emit(\'click\')">{{ name }}</button>'
      }
    }
  }
})

describe('AdminUserDetail', () => {
  it('deletes the user after confirmation and returns to the user list', async () => {
    fetchUser.mockResolvedValue({
      data: {
        value: {
          data: {
            uuid: 'user-uuid',
            username: 'target-user',
            roles: []
          }
        }
      }
    })
    deleteUser.mockResolvedValue({ data: { value: true }, error: { value: null } })
    ElMessageBox.confirm.mockResolvedValue()
    useFetchApiMock.mockImplementation((url) => {
      if (url === '/user/user-uuid') {
        return { json: fetchUser }
      }

      return { delete: () => ({ json: deleteUser }) }
    })

    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.find('.btn-danger').trigger('click')
    await flushPromises()

    expect(ElMessageBox.confirm).toHaveBeenCalledOnce()
    expect(useFetchApiMock).toHaveBeenCalledWith('/user/target-user?current_user=admin-user')
    expect(deleteUser).toHaveBeenCalledOnce()
    expect(ElMessage.success).toHaveBeenCalled()
    expect(routerPush).toHaveBeenCalledWith('/admin_panel/users')
  })
})
