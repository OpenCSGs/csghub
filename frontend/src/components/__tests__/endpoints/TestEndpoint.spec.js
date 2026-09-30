import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TestEndpoint from '@/components/endpoints/playground/TestEndpoint.vue'
import { copyToClipboard } from '@/packs/clipboard'

vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: vi.fn()
}))

vi.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: vi.fn()
}))

vi.mock('@/stores/UserStore', () => ({
  default: vi.fn(() => ({
    isLoggedIn: true,
    userToken: 'mock-token'
  }))
}))

vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn((key) => (key === 'user_token' ? 'mock-token' : 'en'))
    }
  })
}))

const createWrapper = (props = {}) => {
  return mount(TestEndpoint, {
    props: {
      appEndpoint: 'https://test-endpoint.opencsg.com',
      modelId: 'test-model-id',
      form: {
        temperature: 0.7,
        max_tokens: 500
      },
      ...props
    },
    global: {
      stubs: {
        SvgIcon: true,
        MarkdownViewer: true,
        CsgButton: true,
        'el-tooltip': true,
        'el-input': true
      },
      mocks: {
        $t: (key) => {
          const map = {
            'endpoints.playground.test': 'Inference API',
            'endpoints.playground.generation': 'Text Generation',
            'endpoints.playground.send': 'Send',
            'endpoints.playground.retry': 'Retry',
            'endpoints.playground.undo': 'Undo',
            'endpoints.playground.clear': 'Clear',
            'endpoints.playground.selectPromptOrType': 'Select a prompt template or type your message below to test the endpoint:',
            'endpoints.playground.explainConcept': 'Concept Explanation',
            'endpoints.playground.explainConceptPrompt': 'Explain how neural networks learn in simple terms',
            'endpoints.playground.codeGen': 'Code Generation',
            'endpoints.playground.codeGenPrompt': 'Write a Python function to compute cosine similarity between two vectors',
            'endpoints.playground.summarize': 'Summarize',
            'endpoints.playground.summarizePrompt': 'Summarize the key differences between fine-tuning and prompt engineering',
            'endpoints.playground.creativeTask': 'Creative Task',
            'endpoints.playground.creativeTaskPrompt': 'Draft a concise release announcement for an open-source AI model',
            'endpoints.playground.copyAnswer': 'Copy response',
            'endpoints.playground.copySuccess': 'Response copied to clipboard',
            'endpoints.playground.characters': 'chars',
            'all.copy': 'Copy',
            'widgets.liabilityExemption': 'Disclaimer note'
          }
          return map[key] || key
        }
      }
    }
  })
}

describe('TestEndpoint.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts correctly and displays Inference API title', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Inference API')
    expect(wrapper.text()).toContain('Text Generation')
  })

  it('renders empty chat state with 4 sample prompt preset cards', () => {
    const wrapper = createWrapper()
    const emptyState = wrapper.find('[data-testid="empty-chat-state"]')
    expect(emptyState.exists()).toBe(true)

    const promptCards = wrapper.findAll('[data-testid="sample-prompt-btn"]')
    expect(promptCards.length).toBe(4)
    expect(promptCards[0].text()).toContain('Concept Explanation')
    expect(promptCards[1].text()).toContain('Code Generation')
    expect(promptCards[2].text()).toContain('Summarize')
    expect(promptCards[3].text()).toContain('Creative Task')
  })

  it('clicking a sample prompt button populates the message input', async () => {
    const wrapper = createWrapper()
    const promptCards = wrapper.findAll('[data-testid="sample-prompt-btn"]')
    expect(promptCards.length).toBeGreaterThan(0)

    await promptCards[0].trigger('click')
    expect(wrapper.vm.message).toBe('Explain how neural networks learn in simple terms')

    await promptCards[1].trigger('click')
    expect(wrapper.vm.message).toBe('Write a Python function to compute cosine similarity between two vectors')
  })

  it('useSamplePrompt method updates message ref directly', () => {
    const wrapper = createWrapper()
    wrapper.vm.useSamplePrompt({ text: 'Custom test prompt message' })
    expect(wrapper.vm.message).toBe('Custom test prompt message')
  })

  it('displays dynamic character count', async () => {
    const wrapper = createWrapper()
    const charCounter = wrapper.find('[data-testid="char-counter"]')
    expect(charCounter.exists()).toBe(true)
    expect(charCounter.text()).toContain('0 chars')

    wrapper.vm.message = 'Hello CSGHub inference endpoint!'
    await wrapper.vm.$nextTick()
    expect(charCounter.text()).toContain('32 chars')
  })

  it('renders chat message bubbles and hides prompt presets when chatMessages is populated', async () => {
    const wrapper = createWrapper()
    wrapper.vm.chatMessages = [
      {
        question: 'What is deep learning?',
        answer: 'Deep learning is a subset of machine learning.'
      }
    ]
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="empty-chat-state"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="user-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="ai-message"]').exists()).toBe(true)
  })

  it('copyAnswer calls copyToClipboard with provided text', async () => {
    const wrapper = createWrapper()
    wrapper.vm.copyAnswer('Generated response from model')
    expect(copyToClipboard).toHaveBeenCalledWith('Generated response from model')
  })

  it('clicking copy button on AI answer bubble invokes copyToClipboard', async () => {
    const wrapper = createWrapper()
    wrapper.vm.chatMessages = [
      {
        question: 'What is deep learning?',
        answer: 'Deep learning is a subset of machine learning.'
      }
    ]
    await wrapper.vm.$nextTick()

    const copyBtn = wrapper.find('[data-testid="copy-answer-btn"]')
    expect(copyBtn.exists()).toBe(true)
    await copyBtn.trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith('Deep learning is a subset of machine learning.')
  })

  it('handleClear empties chatMessages', async () => {
    const wrapper = createWrapper()
    wrapper.vm.chatMessages = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' }
    ]
    expect(wrapper.vm.chatMessages.length).toBe(2)

    wrapper.vm.handleClear()
    expect(wrapper.vm.chatMessages.length).toBe(0)
  })

  it('handleUndo removes the last message from chatMessages', async () => {
    const wrapper = createWrapper()
    wrapper.vm.chatMessages = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' }
    ]

    wrapper.vm.handleUndo()
    expect(wrapper.vm.chatMessages.length).toBe(1)
    expect(wrapper.vm.chatMessages[0].question).toBe('Q1')
  })

  it('handleRetry resets input message to previous question and does nothing if messages is empty', () => {
    const wrapper = createWrapper()
    wrapper.vm.chatMessages = []
    wrapper.vm.handleRetry()
    expect(wrapper.vm.message).toBe('')

    wrapper.vm.chatMessages = [{ question: 'Previous prompt to retry', answer: 'Old answer' }]
    wrapper.vm.handleRetry()
    expect(wrapper.vm.message).toBe('Previous prompt to retry')
  })
})
