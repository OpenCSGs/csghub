import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SpaceRelationsCard from '@/components/application_spaces/SpaceRelationsCard.vue'
import ApplicationSpaceItem from '@/components/application_spaces/ApplicationSpaceItem.vue'

const createWrapper = (props) => {
  return mount(SpaceRelationsCard, {
    props: {
      namespacePath: 'test/namespace',
      spaces: [],
      ...props
    },
    global: {
      stubs: {
        ApplicationSpaceItem: {
          template: '<div class="application-space-item">{{ repo.path }}</div>',
          props: ['repo']
        }
      }
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
    const items = wrapper.findAllComponents(ApplicationSpaceItem)
    expect(items.length).toBe(spaces.length)
    
    // 验证每个 ApplicationSpaceItem 接收到正确的 repo prop
    items.forEach((item, index) => {
      expect(item.props('repo')).toEqual(spaces[index])
      expect(item.text()).toContain(spaces[index].path)
    })
  })
})
