import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from 'pinia';
import RepoClone from "@/components/shared/RepoClone.vue";
import useRepoDetailStore from '@/stores/RepoDetailStore';

// Mock CSGHUB_SERVER 全局变量
global.CSGHUB_SERVER = 'https://hub.opencsg.com';

vi.mock('@/packs/useFetchApi', () => ({
  default: vi.fn(() => ({
    json: () => Promise.resolve({
      data: { value: { data: [] } }
    }),
    post: () => ({
      json: () => Promise.resolve({ error: { value: null } })
    })
  }))
}));

vi.mock('@/packs/config', () => ({
  isEE: () => false
}));

vi.mock('@/packs/utils', () => ({
  ToLoginPage: vi.fn()
}));

const createWrapper = (props = {}) => {
  const pinia = createPinia();
  setActivePinia(pinia);
  
  const repoDetailStore = useRepoDetailStore();
  repoDetailStore.repository = {
    http_clone_url: 'https://hub.opencsg.com/models/test/repo.git',
    ssh_clone_url: 'git@hub.opencsg.com:test/repo.git'
  };
  repoDetailStore.defaultBranch = 'main';

  return mount(RepoClone, {
    props: {
      repoType: 'model',
      namespacePath: 'test/repo',
      repo: {
        source: 'local',
        syncStatus: 'completed',
        mirrorTaskStatus: 'idle'
      },
      enableEndpoint: false,
      enableFinetune: false,
      enableEvaluation: false,
      showAddToCollections: false,
      canManage: false,
      syncStatus: 'completed',
      commitId: 'abc123',
      ...props
    },
    global: {
      stubs: {
        'svg-icon': true,
        'el-tooltip': true,
        'el-dialog': true,
        'el-tabs': true,
        'el-tab-pane': true,
        'el-checkbox': true,
        'markdown-viewer': true,
        'AddToCollections': true,
        'SyncDropdown': true,
        'UseModelDropdown': true,
        'CsgButton': true
      }
    }
  });
};

describe("RepoClone - httpCloneProtocolHostname", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("应该正确解析不带端口的域名", () => {
    global.CSGHUB_SERVER = 'https://hub.opencsg.com';
    const wrapper = createWrapper();
    
    expect(wrapper.vm.httpCloneProtocolHostname).toBe('https://hub.opencsg.com');
  });

  it("应该正确解析带有端口的域名", () => {
    global.CSGHUB_SERVER = 'https://hub.opencsg.com:8080';
    const wrapper = createWrapper();
    
    expect(wrapper.vm.httpCloneProtocolHostname).toBe('https://hub.opencsg.com:8080');
  });

  it("应该正确解析带有非标准端口的域名", () => {
    global.CSGHUB_SERVER = 'http://localhost:3000';
    const wrapper = createWrapper();
    
    expect(wrapper.vm.httpCloneProtocolHostname).toBe('http://localhost:3000');
  });

  it("应该正确解析带有端口的IP地址", () => {
    global.CSGHUB_SERVER = 'http://192.168.1.100:8080';
    const wrapper = createWrapper();
    
    expect(wrapper.vm.httpCloneProtocolHostname).toBe('http://192.168.1.100:8080');
  });

  it("应该正确处理https协议带端口的情况", () => {
    global.CSGHUB_SERVER = 'https://example.com:9443';
    const wrapper = createWrapper();
    
    expect(wrapper.vm.httpCloneProtocolHostname).toBe('https://example.com:9443');
  });
});

describe("RepoClone - quickstartCodeMarkdown", () => {
  it("generates transformers code snippet for model repos", () => {
    const wrapper = createWrapper({
      repoType: 'model',
      namespacePath: 'opencsg/test-model'
    });

    expect(wrapper.vm.quickstartCodeMarkdown).toContain('from transformers import AutoTokenizer, AutoModelForCausalLM');
    expect(wrapper.vm.quickstartCodeMarkdown).toContain('model_id = "opencsg/test-model"');
    expect(wrapper.vm.quickstartCodeMarkdown).toContain('AutoTokenizer.from_pretrained(model_id)');
    expect(wrapper.vm.quickstartCodeMarkdown).not.toContain('trust_remote_code=True');
    expect(wrapper.vm.quickstartCodeMarkdown).toContain('```python');
  });

  it("generates datasets library code snippet for dataset repos", () => {
    const wrapper = createWrapper({
      repoType: 'dataset',
      namespacePath: 'opencsg/test-dataset'
    });

    expect(wrapper.vm.quickstartCodeMarkdown).toContain('from datasets import load_dataset');
    expect(wrapper.vm.quickstartCodeMarkdown).toContain('dataset = load_dataset("opencsg/test-dataset")');
    expect(wrapper.vm.quickstartCodeMarkdown).toContain('```python');
  });
});
