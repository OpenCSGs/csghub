## 单元测试
### 单元测试的原则
- 逻辑正确性
- 边界条件处理
- 渲染的准确性
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
    confirm: vi.fn((message, title, options) => Promise.resolve())
  }
}))
```

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