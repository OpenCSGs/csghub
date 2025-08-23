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