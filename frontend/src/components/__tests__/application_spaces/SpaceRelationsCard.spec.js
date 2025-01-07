import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SpaceRelationsCard from '@/components/application_spaces/SpaceRelationsCard.vue'

const createWrapper = (props) => {
  return mount(SpaceRelationsCard, {
    props: {
      namespacePath: 'test/namespace',
      spaces: [],
      ...props
    }
  })
}

describe('SpaceRelationsCard', () => {
  it('mounts correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('renders correctly with props', () => {
    const spaces = [
      {
        id: 1,
        name: 'Space 1',
        path: 'user/space-1',
        updated_at: '2024-03-20 10:00:00'
      },
      {
        id: 2,
        name: 'Space 2',
        path: 'user/space-2',
        updated_at: '2024-03-20 10:00:00'
      }
    ]
    const wrapper = createWrapper({ spaces })
    const items = wrapper.findAll('[data-test="space-item"]')
    expect(items.length).toBe(spaces.length)
    expect(items[0].text()).toContain('user/space-1')
    expect(items[1].text()).toContain('user/space-2')
  })
})
