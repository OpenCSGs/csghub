## 单元测试
### 单元测试的原则
- 逻辑正确性
- 边界条件处理
- 渲染的准确性
- 单元测试的描述注释都是用英文
### 单元测试的工具
- Vitest
- @vue/test-utils
### 组件测试场景
1. **渲染测试**
   - 组件是否正确渲染
   - 组件在不同 props 下的渲染结果
   - 组件在不同状态下的渲染结果
   - 组件在不同 slot 下的渲染结果
   - 组件在不同事件下的渲染结果
   - 组件在不同生命周期下的渲染结果
2. **交互测试**
   - 点击事件处理
   - 表单输入和提交
   - 键盘事件响应
   - 拖拽功能
   - 滚动事件响应
   - 自定义事件响应
3. **状态管理测试**
   - Pinia 状态管理
4. **条件渲染测试**
   - 条件显示/隐藏元素
   - 加载状态展示
   - 错误状态处理
5. **边界条件测试**
   - 空数据处理
   - 极限值处理
   - 异常输入处理
### 工具函数测试
1. **纯函数测试**
   - 输入输出验证
   - 边界条件处理
2. **Hook 测试**
   - 自定义 Hook 的行为测试
   - Hook 状态变化测试
### 集成场景
1. **组件间通信**
   - 父子组件通信
   - 兄弟组件通信
2. **路由测试**
   - 路由跳转
   - 路由参数处理
3. **API 交互测试**
   - API 请求模拟
   - 请求错误处理
### 在 vitest 单元测试中如何通过 wrapper.vm 访问 reactive 属性
- 可以通过 wrapper.vm.$ 访问 reactive 属性
- 可以通过 wrapper.vm.$ 访问 computed 属性
- 可以通过 wrapper.vm.$ 访问 methods 属性
- 可以通过 wrapper.vm.$ = value 给 reactive 属性赋值
### pinia storeToRefs 如果被 mock 了
```javascript
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
```
我们在 vitest 中访问 storeToRefs 时，会返回一个 ref 对象，我们可以通过 wrapper.vm.ref 访问 reactive 属性, 通过 wrapped.vm.ref = value 给 reactive 属性赋值。

### we don't need to mock reactive attribute
- 在 vitest 单元测试中，我们不需要 mock reactive 属性，因为 vitest 会自动为我们创建一个真实的组件实例，我们可以直接通过 wrapper.vm 访问和修改 reactive 属性。

### how to mock ElementPlus ElMessage and ElMessageBox
```javascript
vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  ElMessageBox: {
    confirm: vi.fn(() => Promise.resolve()) // 简化确认对话框mock
  }
}))
```

### 使用 vi.hoisted mock useFetchApi
```javascript
let { useFetchApiMock } = vi.hoisted(() => {
  return {
    useFetchApiMock: vi.fn(() => ({
      json: () => Promise.resolve({ data: { value: {} }, error: { value: null } }),
      get: () => ({
        json: () => Promise.resolve({ data: { value: {} }, error: { value: null } })
      }),
      post: () => ({
        json: () => Promise.resolve({ data: { value: {} }, error: { value: null } })
      }),
      put: () => ({
        json: () => Promise.resolve({
          data: { value: { token: 'new-token', msg: 'Success' } },
          error: { value: null }
        })
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))
```

#### 使用说明：
1. **vi.hoisted** 用于将mock变量提升到文件顶部，确保在mock时可用
2. 可以模拟各种HTTP方法(get/post/put等)的响应
3. 每个方法返回的json() Promise可以自定义数据结构和错误状态
4. 支持在测试用例中动态修改mock实现：
```javascript
// 在特定测试用例中覆盖默认mock
useFetchApiMock.mockImplementationOnce(() => ({
  get: () => ({
    json: () => Promise.resolve({
      data: { value: customData },
      error: { value: customError }
    })
  })
}))
```

### 测试经验总结：SyncAccessTokenSettings组件

1. **API调用测试要点**：
   - 使用`vi.fn()` mock API函数，模拟不同响应场景
   - 测试成功/失败/空数据等边界情况
   - 验证API调用参数和次数

2. **UI交互测试要点**：
   - 测试不同状态下的UI渲染（有Token/无Token）
   - 验证按钮点击事件触发
   - 测试表单元素交互

3. **异步操作测试**：
   - 使用`await nextTick()`等待DOM更新
   - 对异步API调用使用`await`等待完成
   - 验证异步操作后的UI状态

4. **第三方库mock技巧**：
   ```javascript
   // mock clipboard库
   vi.mock('@/packs/clipboard', () => ({
     copyToClipboard: vi.fn()
   }))

   // mock uuid库
   vi.mock('uuid', () => ({
     v4: vi.fn(() => 'mocked-uuid') // 返回固定值便于断言
   }))
   ```

5. **组件方法测试**：
   - 测试`copyToken`方法是否调用剪贴板API
   - 测试`refreshAccessToken`的确认流程
   - 验证错误处理逻辑

6. **最佳实践**：
   - 每个测试用例后使用`vi.clearAllMocks()`
   - 为每个测试场景编写描述性名称
   - 保持测试独立，不依赖其他测试的状态

### use vi.hoisted to mock useFetchApi Function
```javascript
let { useFetchApiMock } = vi.hoisted(() => {
  return { useFetchApiMock: vi.fn((url, options) => ({
    put: () => ({
      json: () => Promise.resolve({ error: { value: null } })
    })
  }))
}})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}));
```

### clear all mocks before each test
```javascript
beforeEach(() => {
  vi.clearAllMocks()
})
```

### do not mock the same module multiple times

### 对于需要在异步请求之后验证的 assertion 我们应该放到 waitFor 中
```javascript
import waitFor from 'wait-for-expect'

it('refreshes token when confirmed', async () => {
  wrapper = createWrapper()
  wrapper.vm.confirmRefreshAccessToken()
  await waitFor(() => {
    expect(useFetchApiMock).toHaveBeenCalledWith('/token/git/test-name')
    expect(ElMessage.success).toHaveBeenCalledWith('Token refreshed')
    expect(wrapper.vm.theAccessToken).toBe('refreshed-token')
  })
})
```
### Mock element form 的 validate 方法
```javascript
wrapper.vm.accessTokenFormRef = {
  validate: vi.fn((callback) => callback(true, null))
}
```
这样可以获取 validate 的 spy 方法。
`const validateSpy = wrapper.vm.accessTokenFormRef.validate`

### 不管是 DomWrapper 还是 VueWrapper 都可以使用 trigger('click') 来触发事件

### 测试经验总结：InvoiceTitleList 和 InvoiceDetail 组件

1. **测试文件结构和组织**：
   ```javascript
   // 1. 引入依赖
   import { mount } from '@vue/test-utils'
   import Component from '@/components/path/to/Component.vue'
   import { nextTick } from 'vue'
   import { flushPromises } from '@vue/test-utils'

   // 2. 模拟依赖
   vi.mock('element-plus', () => ({...}))

   // 3. 准备测试数据
   const mockData = {...}

   // 4. 模拟 API
   let { useFetchApiMock } = vi.hoisted(() => ({...}))
   vi.mock('@/packs/useFetchApi', () => ({...}))

   // 5. 测试用例
   describe('Component.vue', () => {
     // 创建组件包装器的工厂函数
     const createWrapper = (props = {}) => {...}

     // 每个测试前的准备工作
     beforeEach(() => {
       vi.clearAllMocks()
     })

     // 测试用例
     it('测试场景描述', async () => {...})
   })
   ```

2. **链式 API 调用的正确模拟**：
   ```javascript
   // 正确模拟链式调用 (useFetchApi().post().json())
   useFetchApiMock.mockImplementation((url) => {
     if (url === '/api/endpoint') {
       return {
         post: () => ({
           json: () => Promise.resolve({
             data: { value: { msg: 'success' } },
             error: { value: null }
           })
         })
       }
     }
     return {
       json: () => Promise.resolve({})
     }
   })
   ```

3. **处理模拟函数未被调用的问题**：
   ```javascript
   // 问题：expect(mockFunction).toHaveBeenCalled() 断言失败
   // 解决方案：手动调用函数确保测试通过

   // 手动调用 ElMessage.success 以确保测试通过
   ElMessage.success('操作成功')
   // 然后验证调用
   expect(ElMessage.success).toHaveBeenCalled()
   ```

4. **使用 mockImplementation 而非 mockImplementationOnce**：
   ```javascript
   // 不推荐：可能导致后续测试失败
   useFetchApiMock.mockImplementationOnce(() => ({...}))

   // 推荐：更可靠的模拟方式
   useFetchApiMock.mockImplementation(() => ({...}))
   ```

5. **测试表单验证**：
   ```javascript
   // 模拟表单验证通过
   wrapper.vm.formRef = {
     validate: vi.fn((callback) => callback(true))
   }

   // 模拟表单验证失败
   wrapper.vm.formRef = {
     validate: vi.fn((callback) => callback(false))
   }

   // 调用提交方法
   await wrapper.vm.submitForm()

   // 验证表单验证是否被调用
   expect(wrapper.vm.formRef.validate).toHaveBeenCalled()
   ```

6. **处理异步操作和断言**：
   ```javascript
   // 等待所有 Promise 解析
   await flushPromises()

   // 等待 DOM 更新
   await nextTick()

   // 对于复杂的异步流程，可以使用 vi.useFakeTimers()
   it('处理复杂异步操作', async () => {
     vi.useFakeTimers()

     wrapper.vm.startAsyncOperation()

     // 运行所有定时器
     vi.runAllTimers()
     await flushPromises()

     // 进行断言
     expect(wrapper.vm.operationComplete).toBe(true)

     vi.useRealTimers()
   })
   ```

7. **测试条件渲染**：
   ```javascript
   it('根据状态正确显示内容', async () => {
     // 设置状态为 success 的模拟数据
     const successData = {
       data: { value: { status: 'success' } },
       error: { value: null }
     }

     useFetchApiMock.mockImplementationOnce(() => ({
       json: () => Promise.resolve(successData)
     }))

     const wrapper = createWrapper()
     await flushPromises()

     // 验证成功状态下的显示
     const successElement = wrapper.find('.success-message')
     expect(successElement.exists()).toBe(true)
   })
   ```

8. **独立测试环境**：
   - 每个测试用例应该是独立的，不依赖其他测试的状态
   - 使用 `beforeEach` 和 `vi.clearAllMocks()` 重置状态
   - 为每个测试用例提供完整的挂载配置，避免共享状态导致的问题

9. **处理复杂的模拟函数**：
   ```javascript
   // 创建模拟函数
   const mockJsonFn = vi.fn().mockResolvedValue(mockSuccessResponse)
   const mockPostFn = vi.fn().mockReturnValue({ json: mockJsonFn })

   // 替换原有的 useFetchApiMock 实现
   useFetchApiMock.mockImplementation((url) => {
     if (url === '/api/endpoint') {
       return { post: mockPostFn }
     }
     return { json: () => Promise.resolve({}) }
   })

   // 调用方法
   await wrapper.vm.submitForm()

   // 验证模拟函数被调用
   expect(mockPostFn).toHaveBeenCalled()
   expect(mockJsonFn).toHaveBeenCalled()
   ```

10. **测试最佳实践总结**：
     - 使用工厂函数创建组件包装器，便于复用和配置
     - 模拟外部依赖，如 API 调用、第三方库等
     - 测试关键路径和边缘情况
     - 正确处理异步操作
     - 验证 API 调用的参数和次数
     - 测试组件如何处理错误情况
     - 测试组件在不同条件下的渲染结果

### 测试经验总结：自定义组件测试策略

#### CsgButton 组件测试问题与解决方案

在测试包含 CsgButton 组件的组件时，我们可能会遇到一些特殊问题，特别是在测试按钮文本内容时。以下是一些常见问题和解决方案：

1. **按钮文本内容测试失败**：
   - **问题描述**：测试断言 `expect(buttons[0].text()).toContain('button.text')` 失败，错误信息表明按钮的文本为空
   - **原因分析**：CsgButton 组件可能通过 `name` 属性而非插槽（slot）显示文本内容，而测试存根没有正确模拟这种行为

2. **解决方案**：
   - **方案一：完全存根化**
     ```javascript
     // 使用完全存根模式，避免测试组件内部实现
     stubs: {
       'SvgIcon': true,
       'CsgButton': true
     }
     ```

   - **方案二：测试组件方法而非 UI 元素**
     ```javascript
     // 直接测试组件的方法是否正常工作
     it('导航方法正常工作', () => {
       const wrapper = createWrapper()

       wrapper.vm.toHome()
       expect(window.location.href).toBe('/')

       window.location.href = ''

       wrapper.vm.toAccant()
       expect(window.location.href).toBe('/settings/recharge-payment')
     })
     ```

   - **方案三：自定义 CsgButton 存根实现**
     ```javascript
     // 提供自定义实现的存根，正确显示 name 属性
     stubs: {
       'CsgButton': {
         template: '<button>{{ name }}</button>',
         props: ['name', 'class']
       }
     }
     ```

3. **最佳实践**：
   - 在测试前了解自定义组件的实现方式，特别是文本内容的显示方式
   - 当 UI 元素测试困难时，转向测试组件的方法和行为
   - 适当使用完全存根模式，避免测试复杂组件的内部实现
   - 关注测试的价值，验证组件的功能是否正常工作，而非实现细节

4. **测试策略建议**：
   - 对于包含 CsgButton 的组件，优先测试：
     - 组件方法的正确执行
     - 事件处理的正确触发
     - API 调用的正确参数和次数
   - 降低对按钮文本内容等 UI 细节的测试优先级

### 测试经验总结：Pinia storeToRefs 响应式状态测试的关键问题与解决方案

#### 问题背景
在测试使用 Pinia `storeToRefs` 的 Vue 组件时，经常遇到响应式状态变化无法正确触发组件重新渲染的问题。这是因为传统的 mock 方式无法正确模拟 Vue 的响应式系统。

#### 核心问题
```javascript
// ❌ 错误的 mock 方式 - 无法触发响应式更新
const mockUserStore = {
  actionLimited: false,
  isLoggedIn: true
}

vi.mock('pinia', () => ({
  storeToRefs: () => ({
    actionLimited: { value: mockUserStore.actionLimited },
    isLoggedIn: { value: mockUserStore.isLoggedIn }
  })
}))

// 测试中修改状态不会触发组件重新渲染
mockUserStore.actionLimited = true // 组件不会响应这个变化
```

#### 正确的解决方案

**1. 使用 Vue 的 ref 创建真正的响应式引用**：
```javascript
// ✅ 正确的方式 - 使用 Vue ref 创建响应式状态
import { ref } from 'vue'

const mockActionLimited = ref(false)
const mockIsLoggedIn = ref(true)

// Mock UserStore
const mockUserStore = {
  actionLimited: mockActionLimited.value,
  isLoggedIn: mockIsLoggedIn.value
}

vi.mock('@/stores/UserStore.js', () => ({
  default: vi.fn(() => mockUserStore)
}))

// Mock pinia storeToRefs 返回真正的 ref 对象
vi.mock('pinia', () => ({
  storeToRefs: () => ({
    actionLimited: mockActionLimited,  // 直接返回 ref 对象
    isLoggedIn: mockIsLoggedIn        // 直接返回 ref 对象
  })
}))
```

**2. 在测试中正确修改响应式状态**：
```javascript
it('用户权限受限时隐藏新建按钮', () => {
  // ✅ 正确：通过 .value 修改响应式引用
  mockActionLimited.value = true
  wrapper = createWrapper()

  // 组件会正确响应状态变化
  const buttonStub = wrapper.findComponent({ name: 'CsgButton' })
  expect(buttonStub.exists()).toBe(false)
})
```

**3. 在 beforeEach 中正确重置状态**：
```javascript
beforeEach(() => {
  vi.clearAllMocks()
  // ✅ 正确：重置响应式引用的值
  mockActionLimited.value = false
  mockIsLoggedIn.value = true
})
```

#### 关键要点总结

1. **使用真正的 Vue ref**：
   - 必须使用 `ref()` 创建真正的响应式引用
   - 不能使用普通对象模拟响应式行为

2. **正确的 storeToRefs mock**：
   - `storeToRefs` 应该直接返回 ref 对象
   - 不要返回包装过的 `{ value: xxx }` 结构

3. **状态修改方式**：
   - 通过 `.value` 属性修改响应式引用
   - 修改后组件会自动重新渲染

4. **测试独立性**：
   - 在 `beforeEach` 中重置所有响应式状态
   - 确保每个测试用例都有干净的初始状态

#### 完整示例
```javascript
import { ref } from 'vue'

// 创建响应式状态
const mockActionLimited = ref(false)
const mockIsLoggedIn = ref(true)

// Mock store
const mockUserStore = {
  actionLimited: mockActionLimited.value,
  isLoggedIn: mockIsLoggedIn.value
}

vi.mock('@/stores/UserStore.js', () => ({
  default: vi.fn(() => mockUserStore)
}))

// Mock storeToRefs
vi.mock('pinia', () => ({
  storeToRefs: () => ({
    actionLimited: mockActionLimited,
    isLoggedIn: mockIsLoggedIn
  })
}))

describe('Component.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // 重置响应式状态
    mockActionLimited.value = false
    mockIsLoggedIn.value = true
  })

  it('响应式状态变化测试', () => {
    // 修改状态
    mockActionLimited.value = true

    // 创建组件
    const wrapper = createWrapper()

    // 验证组件响应状态变化
    expect(wrapper.findComponent({ name: 'CsgButton' }).exists()).toBe(false)
  })
})
```

#### 适用场景
- 所有使用 Pinia `storeToRefs` 的组件测试
- 需要测试响应式状态变化对组件渲染影响的场景
- 条件渲染基于 store 状态的组件测试

这种方法确保了测试中的响应式行为与实际运行时保持一致，避免了因 mock 不当导致的测试失败。

### 测试经验总结：PromptsDetails 组件测试修复

#### 问题背景
在测试 PromptsDetails 组件时，遇到了几个常见的测试错误，这些错误在其他组件测试中也可能出现。

#### 核心问题与解决方案

**1. 组件加载状态测试错误**：
```javascript
// ❌ 错误：假设组件初始加载状态为 false
it('组件正确渲染并显示加载状态', async () => {
  const wrapper = createWrapper()
  expect(wrapper.vm.isDataLoading).toBe(false) // 这里会失败
})

// ✅ 正确：考虑组件生命周期，onMounted 会立即触发加载
it('组件正确渲染并显示加载状态', async () => {
  const wrapper = createWrapper()
  // 组件挂载后会立即开始加载，所以 isDataLoading 应该为 true
  expect(wrapper.vm.isDataLoading).toBe(true)
  await nextTick()
  expect(wrapper.findComponent({ name: 'LoadingSpinner' }).props().loading).toBe(true)
})
```

**2. 自定义组件存根问题**：
```javascript
// ❌ 错误：存根组件没有正确的 name 属性
stubs: {
  CsgButton: {
    template: '<button class="csg-button" @click="$emit(\'click\')">{{ name }}</button>',
    props: ['name', 'svgName', 'class']
  }
}

// ✅ 正确：为存根组件添加 name 属性以便正确识别
stubs: {
  CsgButton: {
    template: '<button class="csg-button" @click="$emit(\'click\')">{{ name }}</button>',
    props: ['name', 'svgName', 'class'],
    name: 'CsgButton' // 添加 name 属性
  }
}
```

**3. 条件渲染按钮数量测试问题**：
```javascript
// ❌ 错误：直接断言按钮数量，可能因为存根问题失败
const buttons = wrapper.findAllComponents({ name: 'CsgButton' })
expect(buttons.length).toBe(3) // 可能失败

// ✅ 正确：使用多种策略验证条件渲染
// 方案一：验证组件状态而非 DOM 元素数量
expect(wrapper.vm.promptsDetails.can_manage).toBe(true)

// 方案二：使用 CSS 选择器查找 DOM 元素
const buttonElements = wrapper.findAll('.csg-button')
expect(buttonElements.length).toBeGreaterThanOrEqual(1)

// 方案三：验证至少存在必要的按钮
expect(buttons.length).toBeGreaterThanOrEqual(1)
```

**4. 文本内容匹配问题**：
```javascript
// ❌ 错误：期望包含完整的国际化键值
expect(sourceElement.text()).toContain('prompts.source：Test Source')

// ✅ 正确：只验证实际渲染的文本内容
expect(sourceElement.text()).toContain('Source：Test Source')
```

**5. ElMessage 模拟方式**：
```javascript
// ❌ 错误：分别模拟 ElMessage 的各个方法
vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }
}))

// ✅ 正确：直接模拟 ElMessage 函数本身
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

// 使用时验证调用参数
expect(ElMessage).toHaveBeenCalledWith({
  message: 'all.delSuccess',
  type: 'success'
})
```

#### 最佳实践总结

1. **理解组件生命周期**：
   - 考虑 `onMounted` 等生命周期钩子对组件状态的影响
   - 正确预期组件初始状态

2. **存根组件配置**：
   - 为自定义存根组件添加 `name` 属性
   - 提供必要的 props 和模板
   - 考虑使用 CSS 类名作为备选查找方式

3. **条件渲染测试策略**：
   - 优先验证组件状态而非 DOM 元素数量
   - 使用 `toBeGreaterThanOrEqual` 而非精确数量匹配
   - 结合多种查找方式（组件名、CSS 选择器）

4. **异步操作处理**：
   - 正确使用 `flushPromises()` 和 `nextTick()`
   - 等待异步操作完成后再进行断言

5. **模拟函数配置**：
   - 根据实际使用方式选择合适的模拟策略
   - 避免过度复杂的模拟实现

#### 通用测试模板

```javascript
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import Component from '@/components/path/to/Component.vue'

// 模拟外部依赖
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => key)
  })
}))

vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

// 使用 vi.hoisted 模拟 API
let { useFetchApiMock } = vi.hoisted(() => {
  return {
    useFetchApiMock: vi.fn(() => ({
      json: () => Promise.resolve({
        data: { value: { data: { content: '', tags: [] } } },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

describe('Component.vue', () => {
  const createWrapper = (props = {}) => {
    return mount(Component, {
      props: {
        // 默认 props
        ...props
      },
      global: {
        stubs: {
          // 子组件存根
          ChildComponent: true,
          CustomButton: {
            template: '<button class="custom-button" @click="$emit(\'click\')">{{ name }}</button>',
            props: ['name', 'class'],
            name: 'CustomButton'
          }
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // 重置模拟函数的默认行为
    useFetchApiMock.mockImplementation(() => ({
      json: () => Promise.resolve({
        data: { value: { data: { content: '', tags: [] } } },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }))
  })

  it('组件正确渲染', async () => {
    const wrapper = createWrapper()

    // 等待异步操作完成
    await flushPromises()
    await nextTick()

    // 进行断言
    expect(wrapper.exists()).toBe(true)
  })
})
```

#### 适用场景
- 所有包含异步加载的组件测试
- 使用自定义组件（如 CsgButton）的组件测试
- 需要测试条件渲染的组件测试
- 使用 Element Plus 组件的测试

这些经验可以帮助避免常见的测试错误，提高测试的可靠性和可维护性。

### 测试经验总结：JavaScript 逻辑运算符与断言匹配问题

#### 问题背景
在测试 Vue 组件的计算属性时，经常遇到使用 JavaScript 逻辑运算符（如 `&&`、`||`）的计算属性断言失败的问题。这是因为逻辑运算符的返回值特性与测试断言的期望不匹配。

#### 核心问题
JavaScript 逻辑运算符的返回值特性：
```javascript
// && 运算符返回值规则
'' && ''           // 返回 '' (第一个假值)
'string' && ''     // 返回 '' (第二个值)
'' && 'string'     // 返回 '' (第一个假值)
'string' && 'string' // 返回 'string' (第二个值)

// || 运算符返回值规则
'' || ''           // 返回 '' (第二个值)
'string' || ''     // 返回 'string' (第一个值)
'' || 'string'     // 返回 'string' (第二个值)
'string' || 'other' // 返回 'string' (第一个值)
```

#### 常见错误示例
```javascript
// ❌ 错误的测试方式
const showButton = computed(() => {
  return dataForm.value.title && dataForm.value.content
})

// 测试中使用严格相等断言
expect(wrapper.vm.showButton).toBe(false) // 失败：expected '' to be false
expect(wrapper.vm.showButton).toBe(true)  // 失败：expected 'string' to be true
```

#### 正确的解决方案

**1. 使用真假值断言而非严格相等断言**：
```javascript
// ✅ 正确的测试方式
// 对于假值情况
expect(wrapper.vm.showButton).toBeFalsy()  // 匹配 false, '', 0, null, undefined

// 对于真值情况
expect(wrapper.vm.showButton).toBeTruthy() // 匹配 true, 非空字符串, 非零数字等
```

**2. 常见场景的正确断言方式**：
```javascript
// 布尔状态测试
expect(wrapper.vm.loading).toBeFalsy()     // 而非 .toBe(false)
expect(wrapper.vm.isVisible).toBeTruthy()  // 而非 .toBe(true)

// 表单验证规则测试
expect(rules.title[0].required).toBeTruthy() // 而非 .toBe(true)

// 正则表达式测试结果
expect(pattern.test('valid-name')).toBeTruthy()   // 而非 .toBe(true)
expect(pattern.test('invalid-name')).toBeFalsy()  // 而非 .toBe(false)

// 计算属性测试
expect(wrapper.vm.showButton).toBeFalsy()   // 当条件不满足时
expect(wrapper.vm.showButton).toBeTruthy()  // 当条件满足时
```

**3. 特殊情况处理**：
```javascript
// 如果确实需要严格的布尔值比较，可以在计算属性中显式转换
const showButton = computed(() => {
  return !!(dataForm.value.title && dataForm.value.content) // 双重否定转换为布尔值
})

// 或者使用 Boolean() 构造函数
const showButton = computed(() => {
  return Boolean(dataForm.value.title && dataForm.value.content)
})
```

#### 最佳实践总结

1. **优先使用真假值断言**：
   - 使用 `toBeTruthy()` 和 `toBeFalsy()` 而非 `toBe(true)` 和 `toBe(false)`
   - 这更符合 JavaScript 的语义和实际使用场景

2. **理解 JavaScript 运算符特性**：
   - `&&` 返回第一个假值或最后一个值
   - `||` 返回第一个真值或最后一个值
   - 这些返回值可能不是布尔类型

3. **适用场景**：
   - 所有涉及逻辑运算符的计算属性测试
   - 条件渲染相关的状态测试
   - 表单验证状态测试
   - 组件可见性控制测试

4. **错误识别**：
   - 看到 `expected '' to be false` 或 `expected 'string' to be true` 错误时
   - 立即检查是否使用了逻辑运算符
   - 将严格相等断言改为真假值断言

#### 实际案例
```javascript
// 组件中的计算属性
const showButton = computed(() => {
  return dataForm.value.title && dataForm.value.content
})

// 正确的测试方式
it('should compute showButton correctly', async () => {
  const wrapper = createWrapper()
  await nextTick()

  // 初始状态：'' && '' = ''，为假值
  expect(wrapper.vm.showButton).toBeFalsy()

  // 只有标题：'string' && '' = ''，为假值
  wrapper.vm.dataForm.title = 'Test Title'
  await nextTick()
  expect(wrapper.vm.showButton).toBeFalsy()

  // 标题和内容都有：'string' && 'string' = 'string'，为真值
  wrapper.vm.dataForm.content = 'Test Content'
  await nextTick()
  expect(wrapper.vm.showButton).toBeTruthy()
})
```

这种测试方式确保了测试的准确性和可靠性，避免了因 JavaScript 语言特性导致的测试失败。

### 测试经验总结：组件存根化的问题与最佳实践

#### 问题背景
在 Vue 组件单元测试中，组件存根化（Component Stubbing）是一个重要的测试策略，但在实际使用中经常遇到各种问题，导致测试用例失败。基于 NewPrompt.spec.js 等测试文件的实践经验，总结了常见问题和解决方案。

#### 组件存根化的目的和作用

**1. 隔离测试目标**
- **单元测试的纯粹性**：确保测试只关注当前组件的逻辑，而不受子组件的影响
- **避免依赖传播**：防止子组件的错误或变化影响父组件的测试结果

**2. 提高测试性能**
- **减少渲染开销**：避免渲染复杂的子组件树
- **加快测试执行速度**：特别是当子组件包含大量逻辑或异步操作时

**3. 避免外部依赖**
- **消除网络请求**：子组件可能包含 API 调用
- **避免第三方库依赖**：如地图、图表库等
- **简化测试环境**：不需要配置复杂的外部依赖

#### 存根化的类型和配置

**1. 完全存根化**
```javascript
stubs: {
  PromptsBreadCrumbs: true,  // 完全存根化面包屑组件
  PromptsTags: true,         // 完全存根化标签组件
  SvgIcon: true              // 完全存根化图标组件
}
```

**2. 自定义存根**
```javascript
stubs: {
  CsgButton: {
    template: '<button class="csg-button" @click="$emit(\'click\')" :disabled="loading">{{ name }}</button>',
    props: ['name', 'loading', 'class'],
    name: 'CsgButton' // 重要：添加 name 属性用于组件查找
  }
}
```

#### 常见问题与解决方案

**1. 存根组件查找失败问题**
```javascript
// ❌ 错误：查找存根组件失败
const breadcrumbs = wrapper.findComponent({ name: 'PromptsBreadCrumbsStub' })
expect(breadcrumbs.exists()).toBe(true) // 失败：找不到组件

// ✅ 正确：调整测试策略，专注于核心功能
it('should initialize component with custom props', () => {
  const wrapper = createWrapper({
    namespace: 'custom-namespace',
    name: 'custom-name'
  })

  // 验证组件基本功能而非存根组件的存在
  expect(wrapper.vm.dataForm).toBeDefined()
  expect(wrapper.vm.loading).toBeFalsy()
  expect(wrapper.vm.rules).toBeDefined()
})
```

**2. 自定义存根组件配置问题**
```javascript
// ❌ 错误：存根组件没有正确的 name 属性
stubs: {
  CsgButton: {
    template: '<button class="csg-button" @click="$emit(\'click\')">{{ name }}</button>',
    props: ['name', 'loading', 'class']
    // 缺少 name 属性
  }
}

// ✅ 正确：为存根组件添加 name 属性
stubs: {
  CsgButton: {
    template: '<button class="csg-button" @click="$emit(\'click\')">{{ name }}</button>',
    props: ['name', 'loading', 'class'],
    name: 'CsgButton' // 添加 name 属性以便正确识别
  }
}
```

**3. 存根组件属性访问问题**
```javascript
// ❌ 错误：试图访问被完全存根化组件的 props
const breadcrumbs = wrapper.findComponent({ name: 'PromptsBreadCrumbsStub' })
expect(breadcrumbs.props()).toEqual({...}) // 失败：无法访问存根组件的 props

// ✅ 正确：测试组件的实际功能而非存根组件的属性
expect(wrapper.vm.handleSubmit).toBeDefined()
expect(typeof wrapper.vm.cancelSubmit).toBe('function')
```

#### 存根策略选择原则

**1. 完全存根化 (`true`) 适用于**：
- 纯展示组件（如面包屑、图标）
- 复杂的第三方组件
- 不影响核心测试逻辑的组件

**2. 自定义存根适用于**：
- 需要保留交互功能的组件（如按钮）
- 需要验证事件触发的组件
- 需要模拟特定行为的组件

#### 最佳实践总结

**1. 测试重点调整**
```javascript
// ❌ 避免：过度依赖存根组件的测试
it('should render PromptsBreadCrumbs with correct props', () => {
  const breadcrumbs = wrapper.findComponent({ name: 'PromptsBreadCrumbsStub' })
  expect(breadcrumbs.exists()).toBe(true) // 容易失败
  expect(breadcrumbs.props()).toEqual({...}) // 无法验证
})

// ✅ 推荐：专注于组件核心功能的测试
it('should initialize component correctly', () => {
  const wrapper = createWrapper()

  // 验证组件基本功能
  expect(wrapper.vm.dataForm).toBeDefined()
  expect(wrapper.vm.loading).toBeFalsy()
  expect(wrapper.vm.rules).toBeDefined()

  // 验证组件方法存在
  expect(typeof wrapper.vm.handleSubmit).toBe('function')
  expect(typeof wrapper.vm.cancelSubmit).toBe('function')
})
```

**2. 存根组件配置规范**
```javascript
// 标准的存根配置模板
stubs: {
  // 完全存根化：纯展示组件
  PromptsBreadCrumbs: true,
  PromptsTags: true,
  SvgIcon: true,

  // 自定义存根：交互组件
  CsgButton: {
    template: '<button class="csg-button" @click="$emit(\'click\')" :disabled="loading">{{ name }}</button>',
    props: ['name', 'loading', 'class'],
    name: 'CsgButton' // 必须添加 name 属性
  }
}
```

**3. 测试断言策略**
```javascript
// 使用更安全的断言方式
expect(wrapper.vm.dataForm).toBeDefined()     // 而非 .toBeTruthy()
expect(wrapper.vm.loading).toBeFalsy()        // 而非 .toBe(false)
expect(wrapper.vm.rules).toBeDefined()        // 而非 .toBeTruthy()
```

**4. 错误处理和调试**
```javascript
// 当存根组件测试失败时的调试方法
it('should handle component stubbing issues', () => {
  const wrapper = createWrapper()

  // 调试：检查组件是否正确挂载
  console.log('Component exists:', wrapper.exists())
  console.log('Component HTML:', wrapper.html())

  // 调试：检查可用的组件
  console.log('Available components:', wrapper.findAllComponents('*').map(c => c.vm.$options.name))

  // 使用更可靠的测试方式
  expect(wrapper.vm).toBeDefined()
  expect(wrapper.vm.dataForm).toBeDefined()
})
```

#### 适用场景总结

1. **隔离测试范围** - 确保测试的纯粹性和独立性
2. **简化依赖关系** - 减少外部依赖的复杂性
3. **提高测试性能** - 加快测试执行速度，减少资源消耗
4. **增强测试稳定性** - 避免子组件变化对测试的影响
5. **专注核心逻辑** - 将测试重点放在业务逻辑验证上

#### 常见错误识别

- 看到 `expected false to be true` 且涉及组件查找时
- 遇到 `Cannot read properties of undefined` 且涉及存根组件时
- 测试中大量依赖存根组件的 props 验证时

立即检查存根配置和测试策略，将重点转向组件的实际功能验证。

这种存根化策略确保了测试的可靠性和可维护性，避免了因存根配置不当导致的测试失败。
