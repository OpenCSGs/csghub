<template>
  <div class="workflow-editor" :style="props.viewMode === 'view' ? 'height: calc(100vh - 370px)' : ''">
    <div class="main-content" :style="props.viewMode === 'view' ? 'grid-template-columns: auto' : ''">
      <div class="sidebar" :style="{'padding-right': isLoading ? '15px' : '0'}" v-if="props.viewMode === 'edit'">
          <el-input
            v-model="searchValue"
            :placeholder="t('dataPipelines.search')"
            prefix-icon="Search"
            class="mb-[12px]"
            @clear="searchValue = ''"
            clearable
          />
          <el-collapse v-model="activeNames" expand-icon-position="left">
            <!-- 骨架屏状态 -->
            <template v-if="isLoading">
              <el-collapse-item :title="`${t('dataPipelines.loading')}...`" name="Deduplicator">
                <div class="node-list">
                  <div 
                    v-for="j in 6" 
                    :key="`node-skeleton-${j}`"
                    class="node-item" 
                  >
                    <el-skeleton 
                      animated
                      :loading="true"
                      :count="1"
                    >
                      <template #template>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px">
                          <el-skeleton-item variant="image" style="width: 40px; height: 40px; border-radius: 8px" />
                          <el-skeleton-item variant="text" style="width: 80%" />
                        </div>
                      </template>
                    </el-skeleton>
                  </div>
                </div>
              </el-collapse-item>
            </template>

            <template v-else>
              <el-collapse-item 
                v-for="nodeType in filteredNodeCategories" 
                :key="nodeType.typeName"
                :title="`${nodeType.typeName} (${nodeType.list.length})`" 
                :name="nodeType.typeName"
              >
                <div class="node-list">
                  <div 
                    v-for="node in nodeType.list"
                    :key="node.id"
                    class="node-item"
                    draggable="true"
                    @dragstart="onDragStart($event, node)"
                  >
                    <img :src="`data:image/png;base64,${node.pic_base64}`" class="node-preview">
                    <el-tooltip
                      :content="node.display_name"
                      placement="bottom-start"
                    >
                      <div class="node-name" v-html="highlightMatch(node.display_name)"/>
                    </el-tooltip>
                  </div>
                </div>
              </el-collapse-item>
            </template>
          </el-collapse>

          <el-empty 
            v-if="filteredNodeCategories.length === 0 && searchValue" 
            :description="t('dataPipelines.noMatchingNodeFound')" 
            :image-size="80"
          />
      </div>
      
      <div 
        class="graph-container" 
        @dragover.prevent 
        @drop="onDrop"
        ref="graphContainer"
      >
        <div id="graph" ref="graphElement"></div>
        <div class="toolbar" v-if="props.viewMode === 'edit'">
          <el-tooltip :content="t('dataPipelines.zoomIn')" placement="right">
              <div class="toolbar-btn" @click="zoomIn">
                  <el-icon class="toolbar-btn"><ZoomIn /></el-icon>
              </div>
          </el-tooltip>
          <el-tooltip :content="t('dataPipelines.zoomOut')" placement="right">
              <div class="toolbar-btn" @click="zoomOut">
                  <el-icon class="toolbar-btn"><ZoomOut /></el-icon>
              </div>
          </el-tooltip>
          <el-tooltip :content="t('dataPipelines.resetView')" placement="right">
              <div class="toolbar-btn" @click="resetView">
                  <el-icon class="toolbar-btn"><Refresh /></el-icon>
              </div>
          </el-tooltip>
          <el-tooltip :content="t('dataPipelines.clearCanvas')" placement="right">
              <div class="toolbar-btn" @click="clearCanvas">
                  <el-icon class="toolbar-btn"><Delete /></el-icon>
              </div>
          </el-tooltip>
          
          <el-popover
            :title="t('dataPipelines.operationGuide')"
            placement="left-start"
            :width="400"
          >
            <template #reference>
              <div class="toolbar-btn">
                <el-icon class="toolbar-btn"><Guide /></el-icon>
              </div>
            </template>
            <div class="instructions">
              <ul>
                <li>{{ t('dataPipelines.operationGuide1') }}</li>
                <li>{{ t('dataPipelines.operationGuide2') }}</li>
                <li>{{ t('dataPipelines.operationGuide3') }}</li>
                <li>{{ t('dataPipelines.operationGuide4') }}</li>
                <li>{{ t('dataPipelines.operationGuide5') }}</li>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>
    </div>

    <el-drawer
      v-model="configsDrawer"
      :title="selectedNode ? selectedNode.display_name : t('dataPipelines.nodeConfig')"
      direction="rtl"
      :before-close="handleBeforeClose"
      :size="drawerWidth"
      style="height: calc(100% - 81px);"
    >
      <div v-if="props.viewMode === 'view'" class="mb-[16px] flex justify-between items-center">
        <el-segmented v-model="tabsValue" :options="options" size="large" />
        <!-- <el-select
          v-model="logLevelval"
          v-if="tabsValue === 'log'"
          @change="handleLogLevelChange"
          style="width: 100px">
          <el-option
            v-for="item in logLevel"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </div>

      <div v-show="tabsValue === 'config'">
        <div v-if="selectedNode" class="node-config">
          <div class="config-section">
            <el-form label-position="top">
              <el-form-item :label="t('dataPipelines.nodeName')">
                <el-input v-model="selectedNode.display_name" disabled />
              </el-form-item>
              <el-form-item :label="t('dataPipelines.nodeType')">
                <el-input v-model="selectedNode.operator_type" disabled />
              </el-form-item>
            </el-form>
          </div>

          <DynamicForm 
            ref="dynamicFormRefs"
            :configs="selectedNode.configs"
            :viewMode="props.viewMode"
            @save="(data, formRef) => handleSave(data, formRef)"
          />
        </div>
        <div v-else>
          {{ t('dataPipelines.nodeNotSelected') }}
        </div>
      </div>
      <div v-show="tabsValue === 'log'" style="position: relative;">
        <el-tooltip
          :content="drawerWidth === '410px' ? t('prompts.openUp') : t('prompts.closeUp')"
          placement="top"
        >
          <el-button
            :icon="drawerWidth === '410px' ? 'ArrowLeft' : 'ArrowRight'"
            circle
            class="expand-but"
            @click="drawerWidth === '410px' ? drawerWidth = '1200px' : drawerWidth = '410px'"
          />
        </el-tooltip>
        <div class="resultBox">
          <pre v-for="(log, index) in logData" :key="index" class="text-gray-50 text-base font-normal"
            >{{ log }}
          </pre>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
  
<script setup>
  import { ref, onMounted, onUnmounted, computed, defineProps, defineExpose, watch } from 'vue'
  import * as G6 from '@antv/g6'
  import { ElMessage } from 'element-plus'
  import useUserStore from "@/stores/UserStore";
  import useFetchApi from "@/packs/useFetchApi";
  import DynamicForm from './components/dynamicForm.vue'
  import jsYaml from 'js-yaml';
  import zhOps from "../../../locales/zh_js/operator_zh.json";
  import enOps from "../../../locales/en_js/operator_en.json";
  import zhHantOps from '../../../locales/zh_hant_js/operator_zhHant.json'
  import { useI18n } from "vue-i18n";
  const { t, locale } = useI18n();
  const operatorI18n = {
    zh: zhOps,
    en: enOps,
    zhHant: zhHantOps
  };
  const userStore = useUserStore();
  const origin = window.location.origin + '/'; 
  const configsDrawer = ref(false)
  const drawerWidth = ref('410px')
  const dynamicFormRefs = ref({})

  const tabsValue = ref('config')
  const options = [
    { label: t('dataPipelines.configInfo'), value: 'config' },
    { label: t('dataPipelines.taskLog'), value: 'log' },
  ]

  const logLevelval = ref('all')

  const logLevel = [
    {
      value: 'all',
      label: '全部',
    },
    {
      value: 'info',
      label: '信息',
    },
    {
      value: 'warning',
      label: '警告',
    },
    {
      value: 'error',
      label: '错误',
    },
    {
      value: 'debug',
      label: '调试',
    },
  ]

  const handleLogLevelChange = (value) => {
    getPiplineJobLog()
  }
  
  const props = defineProps({
    workflowData: {
      type: [Object, String],
      default: () => ({
        nodes: [],
        edges: []
      })
    },
    jobOperatorsStatus: {
      type: Array,
      default: () => ([])
    },
    form: {
      type: Object,
      default: () => ({})
    },
    viewMode: {
      type: String,
      default: 'edit'
    },
    infoId: {
      type: String,
      default: ''
    }
  })

  // 监听 workflowData 变化
  watch(() => props.workflowData, async (newVal) => {
    if (!isGraphInitialized.value || !graph.value) {
      console.log('图尚未初始化，延迟处理数据更新')
      return
    }
    
    try {
      const parsedData = parseWorkflowData(newVal)
      console.log('监听到数据变化:', parsedData)
      
      if (parsedData.nodes?.length > 0) {
        await loadDataToGraph(parsedData)
      } else {
        clearCanvas()
      }
    } catch (error) {
      console.error('处理工作流数据变化失败:', error)
    }
  }, { deep: true })

  // 监听语言变化
  watch(locale, () => {
    getUserInfo();
  });

  const searchValue = ref('')
  const activeNames = ref(['Deduplicator', 'Filter', 'Mapper', 'Selector', 'Formatter'])
  const nodeCategories = ref([])
  const isLoading = ref(true)

  // 查询当前用户所在的组织
  const getUserInfo = async () => {
    try {
      const { data } = await useFetchApi(`/user/${userStore.username}`).get().json()
      const { orgs } = data.value.data
      if (orgs) {
         const orgPaths = orgs.map(org => org.path).join(',') || ''
         await getOperatorList(orgPaths)
      } else {
        await getOperatorList()
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 获取节点列表
  const getOperatorList = async (orgPaths = '') => {
    try {
      isLoading.value = true
      const full_path = orgPaths ? `?full_path=${orgPaths}` : ''
      const { data } = await useFetchApi(
        `/dataflow/operator/types/grouped-by-condition${full_path}`
      )
        .get()
        .json()

      if (data.value.code === 200) {
        nodeCategories.value = data.value.data.map((operator) => {
          return {
            ...operator,
            list: operator.list.map((item) => {
              const i18nData = operatorI18n[locale.value]?.[item.operator_name];
              
              const newItem = {
                ...item,
                display_name: i18nData?.name || item.operator_name,
                configs: item.configs.map((config, index) => {
                  const i18nParam = i18nData?.params?.[index];
                  
                  // 处理select_options的国际化
                  let selectOptions = config.select_options;
                  if (i18nParam?.option_values && config.config_type === 'select') {
                    selectOptions = config.select_options.map(option => {
                      // 在i18nParam.option_values中找到对应的选项
                      const matchedOption = i18nParam.option_values.find(
                        opt => opt.key === option.label || opt.key === option.value
                      );
                      return {
                        ...option,
                        label: matchedOption?.label || option.label
                      };
                    });
                  }
                  
                  return {
                    ...config,
                    display_name: i18nParam?.name || config.config_name,
                    display_description: i18nParam?.description,
                    select_options: selectOptions
                  };
                })
              };
              
              return newItem;
            })
          }
        });
      }
    } catch (error) {
      console.error('获取节点列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 搜索
  const filteredNodeCategories = computed(() => {
    if (!searchValue.value.trim()) return nodeCategories.value;
    
    const keyword = searchValue.value.trim().toLowerCase();
    return nodeCategories.value
      .map(category => ({
        ...category,
        list: category.list.filter(node => 
          node.operator_name.toLowerCase().includes(keyword) || 
          node.display_name.toLowerCase().includes(keyword) || 
          node.operator_type.toLowerCase().includes(keyword)
        )
      }))
      .filter(category => category.list.length > 0); // 只保留有结果的分类
  })

  // 高亮匹配文本方法
  const highlightMatch = (text) => {
    if (!searchValue.value.trim()) return text
    
    const keyword = searchValue.value.trim()
    const regex = new RegExp(`(${escapeRegExp(keyword)})`, 'gi')
    
    return text.replace(regex, '<span class="highlight">$1</span>')
  }

  // 转义正则特殊字符
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // 数据按照 operator_type 进行分类
  const classifyOperators = (data = []) => {
    const result = []
    const typeMap = {}

    // 遍历原始数据
    data.forEach(item => {
      const type = item.operator_type
      // 如果该类型还未创建，则初始化
      if (!typeMap[type]) {
        typeMap[type] = {
          typeName: type,
          list: []
        }
        result.push(typeMap[type])
      }
      
      // 将当前项添加到对应类型的列表中
      typeMap[type].list.push(item)
    })
    return result
  }
  
  // 图实例和DOM引用
  const graph = ref(null)
  const graphContainer = ref(null)
  const graphElement = ref(null)
  
  // 数据状态
  const nodes = ref([])
  const edges = ref([])
  const selectedNode = ref(null)
  const draggingNode = ref(null)

  const logData = ref([])
  const operatorName = ref('')

  // 添加一个标志位跟踪图是否已初始化
  const isGraphInitialized = ref(false)
  
  // 初始化G6图
  const initGraph = async () => {
    // 注册自定义图片节点
    G6.registerNode('image-node', {
      draw(cfg, group) {
        const width = 60
        const height = 60
        const color = cfg.color || '#ffffff'
        
        // 主背景矩形
        const imageBg = group.addShape('rect', {
          attrs: {
            x: -width/2,
            y: -height/2,
            width,
            height,
            fill: '#ffffff',
            // stroke: color,
            lineWidth: 0,
            radius: 12,
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowBlur: 4,
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            draggable: true,
            pointerEvents: 'visiblePainted',
          },
          name: 'image-bg',
          draggable: true
        })
        
        // 图片
        group.addShape('image', {
          attrs: {
            x: -width/2 + 10,
            y: -height/2 + 10,
            width: 40,
            height: 40,
            img: cfg.icon,
            cursor: 'move',
            radius: 12,
            // crossorigin: 'anonymous',
          },
          name: 'node-image',
          draggable: true
        })

        // 节点标签
        group.addShape('text', {
          attrs: {
            text: cfg.display_name || cfg.operator_name,
            x: 0,
            y: 40,
            fontSize: 12,
            textAlign: 'center',
            textBaseline: 'top',
            fill: '#333',
            width: 60,  // 与图片同宽
            wordWrap: true,     // 启用自动折行
            wordWrapWidth: 60,  // 折行宽度
            lineHeight: 16,      // 行高
            ellipsis: true,
            cursor: 'move'
          },
          name: 'node-label',
          draggable: true
        })

        // 节点状态
        // group.addShape('text', {
        //   attrs: {
        //     text: '执行完成',
        //     x: 0,
        //     y: 60,
        //     fontSize: 12,
        //     textAlign: 'center',
        //     textBaseline: 'top',
        //     fill: '#333',
        //     width: 60,  // 与图片同宽
        //     wordWrap: true,     // 启用自动折行
        //     wordWrapWidth: 60,  // 折行宽度
        //     lineHeight: 16,      // 行高
        //     ellipsis: true,
        //     cursor: 'move'
        //   },
        //   name: 'node-status',
        //   draggable: true
        // })

        // 查看详情
        if (props.viewMode === 'view') {
          // 节点状态
          const jobOperatorsInfo = props.jobOperatorsStatus[cfg.index] || {}
          const status_icon = `/images/task_status_${
                                jobOperatorsInfo.status === 'success' ? 2 : 
                                jobOperatorsInfo.status === 'error' ? 3 : 
                                jobOperatorsInfo.status === 'processing' ? 1 : 
                                jobOperatorsInfo.status === 'wainting' ? 5 : 4
                              }.png`
          // 节点状态
          group.addShape('dom', {
            attrs: {
              x: -width,
              y: 65,
              width: 180,
              height: 50,
              wordWrapWidth: 260,  // 折行宽度
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'top',
              // cursor: 'move',
              html: `
                <div class="operator-status">
                  <div class="status-item">
                    <img src="${status_icon}" class="status-icon" />
                    <div>
                      <div>${jobOperatorsInfo.status ? t(`dataPipelines.executionStatus.${jobOperatorsInfo.status}`) : t("dataPipelines.unknown")}</div>
                      <div class="status-time">${t("dataPipelines.startTime")}：${formatTimestamp(jobOperatorsInfo.start_time) || "-"}</div>
                      <div class="status-time">${t("dataPipelines.endTime")}：${formatTimestamp(jobOperatorsInfo.end_time) || "-"}</div>
                    </div>
                  </div>
                </div>
              `,
            },
            name: 'node-status',
            draggable: true
          });
        }

        if (props.viewMode === 'edit') {
          // 输入连接点
          group.addShape('circle', {
            attrs: {
              x: -width/2,
              y: 0,
              r: 4,  // 增大半径
              fill: '#fff',
              stroke: '#c5c5c5',
              lineWidth: 1,
              cursor: 'crosshair',
              opacity: 0.7  // 默认半透明
            },
            name: 'input-point',
            draggable: true  // 允许拖拽
          })
          
          // 输出连接点
          group.addShape('circle', {
            attrs: {
              x: width/2,
              y: 0,
              r: 4,
              fill: '#fff',
              stroke: '#c5c5c5',
              lineWidth: 1,
              cursor: 'crosshair',
              opacity: 0.7
            },
            name: 'output-point',
            draggable: true
          })
          
          // 删除按钮 (默认隐藏)
          group.addShape('text', {
            attrs: {
              text: '×',
              x: width/2,
              y: -height/2 - 10,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
              textBaseline: 'middle',
              fill: '#333',
              cursor: 'pointer',
              opacity: 0
            },
            name: 'delete-icon'
          })
        }
        return imageBg
      },
      // 定义锚点
      getAnchorPoints() {
        return [
          [0, 0.5],  // 左侧中点
          [1, 0.5],  // 右侧中点
        ]
      },
      // 设置状态样式
      setState(name, value, item) {
        const group = item.getContainer()
        const path = group.find(ele => ele.get('name') === 'edge-path')
        const deleteIcon = group.find(ele => ele.get('name') === 'delete-icon')
        const inputPoint = group.find(ele => ele.get('name') === 'input-point')
        const outputPoint = group.find(ele => ele.get('name') === 'output-point')

        // 检查该节点是否有输出连接
        const hasOutputEdge = edges.value.some(edge => edge.source === item.getID())
        // 检查该节点是否有输入连接
        const hasInputEdge = edges.value.some(edge => edge.target === item.getID())

        if (name === 'hover') {
          if (path) path.attr('stroke', value ? '#1890ff' : '#aab7c3')
          if (deleteIcon) deleteIcon.attr('opacity', value ? 1 : 0)
          
          // 重置连接点颜色
          if (inputPoint) {
            inputPoint.attr('fill', '#eee') // 重置为默认颜色
          }
          if (outputPoint) {
            outputPoint.attr('fill', '#eee') // 重置为默认颜色
          }
          
          // 如果节点有输出连接，悬停时不显示任何连接点
          if (hasOutputEdge) {
            if (inputPoint) inputPoint.attr('opacity', 0)
            if (outputPoint) outputPoint.attr('opacity', 0)
          } 
          // 如果节点没有输出连接但有输入连接，悬停时不显示输入连接点
          else if (hasInputEdge) {
            if (inputPoint) inputPoint.attr('opacity', 0)
            if (outputPoint) outputPoint.attr('opacity', value ? 1 : 0.7)
          }
          // 如果节点既没有输出连接也没有输入连接，正常显示连接点
          else {
            if (inputPoint) inputPoint.attr('opacity', value ? 1 : 0.7)
            if (outputPoint) outputPoint.attr('opacity', value ? 1 : 0.7)
          }
        } else if (name === 'selected') {
          const bg = group.find(ele => ele.get('name') === 'node-bg')
          if (bg) {
              bg.attr('shadowColor', value ? '#F56C6C' : 'rgba(0,0,0,0.1)')
              bg.attr('shadowBlur', value ? 15 : 8)
          }
        } else if (name === 'source') {
          // 作为连线源节点时的状态
          if (outputPoint) outputPoint.attr('fill', value ? '#52c41a' : '#eee')
        } else if (name === 'target') {
          // 作为连线目标节点时的状态
          if (inputPoint) inputPoint.attr('fill', value ? '#52c41a' : '#eee')
        } else if (name === 'has-output') {
          // 自定义状态：是否有输出连接
          if (outputPoint) outputPoint.attr('opacity', value ? 0 : 0.7)
        } else if (name === 'has-input') {
          // 自定义状态：是否有输入连接
          if (inputPoint) inputPoint.attr('opacity', value ? 0 : 0.7)
        } else if (name === 'highlight') {
          // 自定义状态：高亮节点
          const group = item.getContainer()
          const bg = group.find(ele => ele.get('name') === 'image-bg')
          if (bg) {
            bg.attr('shadowColor', value ? '#1890ff' : 'rgba(0,0,0,0.1)')
            bg.attr('shadowBlur', value ? 15 : 4)
          }
        }
      },

      // 更新
      update(cfg, node) {
        const group = node.getContainer();
        // 更新节点内容
        const label = group.find(ele => ele.get('name') === 'node-label' || ele.get('name') === 'node-status')
        if (label) {
          label.attr('text', cfg.label)
        }
        
        const image = group.find(ele => ele.get('name') === 'node-image')
        if (image && cfg.icon) {
          image.attr('img', cfg.icon)
        }
      }
    })
    
    // 注册自定义边
    G6.registerEdge('custom-edge', {
      draw(cfg, group) {
        const { startPoint, endPoint } = cfg
        const midPoint = {
          x: (startPoint.x + endPoint.x) / 2,
          y: (startPoint.y + endPoint.y) / 2
        }
        
        const line = group.addShape('path', {
          attrs: {
            path: [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, endPoint.y]
            ],
            stroke: '#8996b1',
            fill: '#8996b1',
            lineWidth: 2,
            endArrow: {
              path: 'M 0,0 L -6,3 L -6,-3 Z', // 实心箭头路径
              d: 0, // 调整箭头位置
            },
            cursor: 'pointer'
          },
          name: 'edge-path'
        })

        if (props.viewMode === 'edit') {
          // 删除按钮 (默认隐藏)
          group.addShape('text', {
            attrs: {
              text: '×',
              x: midPoint.x,
              y: midPoint.y,
              fontSize: 14,
              textAlign: 'center',
              textBaseline: 'middle',
              fill: '#ff4d4f', // 红色
              cursor: 'pointer',
              opacity: 0
            },
            name: 'delete-icon'
          });
        }
        return line
      },
      // 添加状态样式
      setState(name, value, item) {
        const group = item.getContainer()
        const path = group.find(ele => ele.get('name') === 'edge-path')
        const deleteIcon = group.find(ele => ele.get('name') === 'delete-icon')

        if (name === 'hover' && props.viewMode === 'edit') {
          if (path) path.attr('stroke', value ? '#b9b9b9' : '#8996b1')
          if (deleteIcon) deleteIcon.attr('opacity', value ? 1 : 0)
        }
      }
    })
    
    // 创建图实例
    graph.value = new G6.Graph({
      container: graphElement.value,
      width: graphContainer.value.clientWidth,
      height: graphContainer.value.clientHeight,
      renderer: 'svg',
      modes: {
        default: [
          {
            type: 'drag-node', 
            enableDelegate: false, // 启用拖拽代理
            delegateStyle: {
              fill: '#f3f9ff',
              stroke: '#1890ff',
              lineDash: [5, 5]
            },
            // 指定可拖拽目标
            shouldBegin: (e) => {
              const name = e.target?.get('name')
              // 允许从节点背景、图片或文本区域开始拖拽
              const allowedNames = ['image-bg', 'node-image', 'node-label', 'node-status']
              return !name || allowedNames.includes(name) || 
                  !['input-point', 'output-point', 'delete-icon'].includes(name)
            }
          }, 
          'drag-canvas',
          'zoom-canvas',
          {
            type: 'create-edge',
            trigger: 'drag',
            edgeConfig: {
              type: 'custom-edge',
              style: {
                stroke: '#aab7c3',
                lineWidth: 2
              }
            },
            shouldBegin: (e) => {
              return e.target?.get('name') === 'output-point'
            },
            shouldEnd: (e) => {
              // 扩大可连接区域
              const shape = e.target;
              const name = shape?.get('name');
              return name === 'input-point' || 
                    (shape.get('type') === 'circle' && shape.cfg.name === 'input-point') ||
                    (e.item && e.item.getType() === 'node')
            },
            // 添加吸附配置
            shouldUpdate: (e) => {
              // 如果正在创建边，检查鼠标是否接近目标节点
              if (creatingEdge && edgeStartNode) {
                const point = graph.value.getPointByClient(e.clientX, e.clientY)
                const nodes = graph.value.getNodes()
                
                // 寻找最近的节点
                let closestNode = null
                let minDistance = Infinity
                let closestPoint = null
                
                nodes.forEach(node => {
                  if (node.getID() !== edgeStartNode.getID()) { // 排除源节点
                    const model = node.getModel()
                    const nodeX = model.x
                    const nodeY = model.y
                    
                    // 计算鼠标位置与节点中心的距离
                    const distance = Math.sqrt(
                      Math.pow(point.x - nodeX, 2) + 
                      Math.pow(point.y - nodeY, 2)
                    )
                    
                    // 如果距离小于阈值（50px），则认为是候选节点
                    if (distance < 50 && distance < minDistance) {
                      minDistance = distance;
                      closestNode = node;
                      closestPoint = { x: nodeX, y: nodeY };
                    }
                  }
                })
                
                // 如果有最近的节点，调整临时连线的目标点
                if (closestNode) {
                  const tempEdge = graph.value.findById('temp-edge')
                  if (tempEdge) {
                    graph.value.updateItem(tempEdge, {
                      targetPoint: closestPoint
                    })
                  }
                  return false // 阻止默认的连线更新
                }
              }
              return true
            }
          }
        ]
      },
      // 添加网格配置
      grid: {
        forceAlign: true, // 是否强制对齐网格
        cell: 20, // 网格大小（像素）
        line: {
          stroke: 'red', // 网格线颜色
          lineWidth: 1, // 网格线宽度
        },
      },
      defaultNode: {
        type: 'image-node',
        style: {
          cursor: 'move'
        }
      },
      defaultEdge: {
        type: 'custom-edge'
      },
      nodeStateStyles: {
        hover: {
          shadowColor: '#ffffff',
          shadowBlur: 12
        },
        selected: {
          shadowColor: '#F56C6C',
          shadowBlur: 15
        }
      },
      edgeStateStyles: {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2
        }
      }
    })

    // 解析传入的工作流数据
    const parsedData = parseWorkflowData(props.workflowData)
    console.log('解析后的数据:', parsedData) // 调试用
    
    // 如果有数据，则渲染到画布
    if (parsedData.nodes && parsedData.nodes.length > 0) {
      await loadDataToGraph(parsedData)
    }

    // 添加拖拽连线的事件处理
    let creatingEdge = false
    let edgeStartNode = null
    let edgeStartPoint = null

    // 添加关键事件监听
    // 在initGraph函数中添加更完善的事件处理
    graph.value.on('node:dragstart', (e) => {
      const shape = e.target
      const name = shape.get('name')
      
      // 如果是输出连接点，开始创建连线
      if (name === 'output-point') {
        creatingEdge = true
        edgeStartNode = e.item
        edgeStartPoint = {
          x: e.x,
          y: e.y
        }
        
        // 设置源节点状态
        graph.value.setItemState(e.item, 'source', true)
        
        // 阻止默认拖拽行为
        e.preventDefault()
        e.stopPropagation()
      }
    })

    graph.value.on('node:drag', (e) => {
      if (!creatingEdge) return
      // 更新临时连线
      const point = graph.value.getPointByClient(e.clientX, e.clientY)
      
      // 如果有临时连线，更新它
      if (!graph.value.findById('temp-edge')) {
        graph.value.addItem('edge', {
          id: 'temp-edge',
          source: edgeStartNode.getModel().id,
          targetPoint: point,
          type: 'custom-edge',
          style: {
            stroke: '#1890ff',
            lineDash: [3, 3]
          }
        })
      } else {
        graph.value.updateItem('temp-edge', {
          targetPoint: point
        })
      }
    })

    graph.value.on('node:dragend', (e) => {
      if (!creatingEdge || !edgeStartNode) return

      // 移除临时连线
      const tempEdge = graph.value.findById('temp-edge')
      if (tempEdge && !tempEdge.destroyed) {
        graph.value.removeItem(tempEdge)
      }

      // 检查目标节点
      const point = graph.value.getPointByClient(e.clientX, e.clientY)
      const targetNode = graph.value.getNodes().find(node => {
        return node.getID() !== edgeStartNode.getID() && 
              !node.destroyed &&
              Math.sqrt(
                Math.pow(point.x - node.getModel().x, 2) + 
                Math.pow(point.y - node.getModel().y, 2)
              ) < 50
      })

      // 阻止无效连接
      if (!targetNode || targetNode.getID() === edgeStartNode.getID()) {
        if (edgeStartNode) {
          graph.value.setItemState(edgeStartNode, 'source', false)
        }
        creatingEdge = false
        edgeStartNode = null
        return
      }

      // 创建新连接
      const newEdge = {
        source: edgeStartNode.getID(),
        target: targetNode.getID(),
        type: 'custom-edge'
      };
      
      // 检查是否已存在相同连线
      if (!edges.value.some(edge => 
        edge.source === newEdge.source && 
        edge.target === newEdge.target
      )) {
        graph.value.addItem('edge', newEdge)
      }

      // 重置状态
      graph.value.setItemState(edgeStartNode, 'source', false)
      creatingEdge = false
      edgeStartNode = null
    });

    // 添加画布拖拽结束处理（如果连线未完成）
    graph.value.on('canvas:dragend', () => {
      if (creatingEdge) {
        if (graph.value.findById('temp-edge')) {
          graph.value.removeItem('temp-edge')
        }
          
        if (edgeStartNode) {
          graph.value.setItemState(edgeStartNode, 'source', false)
        }
          
        creatingEdge = false
        edgeStartNode = null
        edgeStartPoint = null
      }
    })

    // 连接线悬停状态
    graph.value.on('edge:mouseenter', (e) => {
      graph.value.setItemState(e.item, 'hover', true)
    })

    graph.value.on('edge:mouseleave', (e) => {
      graph.value.setItemState(e.item, 'hover', false)
    })

    // 节点悬停状态
    graph.value.on('node:mouseenter', (e) => {
      const item = e.item
      graph.value.setItemState(item, 'hover', true)
      
      // 如果正在创建连线，添加吸附高亮
      if (creatingEdge && edgeStartNode && item.getID() !== edgeStartNode.getID()) {
        graph.value.setItemState(item, 'highlight', true)
      }
    })
    
    graph.value.on('node:mouseleave', (e) => {
      const item = e.item
      graph.value.setItemState(item, 'hover', false)
      graph.value.setItemState(item, 'highlight', false)
    })

    // 边点击事件
    graph.value.on('edge:click', (e) => {
      const shape = e.target
      const name = shape.get('name')
      
      if (name === 'delete-icon') {
        const edgeId = e.item.getID()
        const edgeModel = e.item.getModel()
        
        // 先获取相关节点
        const sourceNode = graph.value.findById(edgeModel.source)
        const targetNode = graph.value.findById(edgeModel.target)
        
        // 删除边
        graph.value.removeItem(edgeId)
        edges.value = edges.value.filter(edge => edge.id !== edgeId)
        
        // 更新节点状态
        if (sourceNode) {
          graph.value.setItemState(sourceNode, 'source', false)
          const hasOutput = edges.value.some(edge => edge.source === edgeModel.source)
          graph.value.setItemState(sourceNode, 'has-output', hasOutput)
        }
        
        if (targetNode) {
          graph.value.setItemState(targetNode, 'target', false)
          const hasInput = edges.value.some(edge => edge.target === edgeModel.target)
          graph.value.setItemState(targetNode, 'has-input', hasInput)
        }
      }
    })

    
    graph.value.on('node:click', async (evt) => {
      evt.stopPropagation()
      const shape = evt.target
      const name = shape.get('name')
      
      // 如果点击的是删除按钮
      if (name === 'delete-icon') {
        // 模拟一个键盘事件对象
        const mockKeyEvent = {
          key: 'Delete',
          preventDefault: () => {},
          stopPropagation: () => {}
        }
        // 确保当前节点被选中
        if (evt.item) {
          selectedNode.value = evt.item.getModel()
          handleKeyDown(mockKeyEvent)
        }
        return
      }
      
      // 如果点击的是连接点，不处理选择状态
      if (name === 'input-point' || name === 'output-point') {
        return
      }
      
      // 清除之前选中的节点状态
      const selectedNodes = graph.value.findAllByState('node', 'selected')
      selectedNodes.forEach(node => {
        graph.value.setItemState(node, 'selected', false)
      })
      
      // 设置当前节点为选中状态
      graph.value.setItemState(evt.item, 'selected', true)
      selectedNode.value = evt.item.getModel() // 确保 selectedNode 正确更新

      // 打开抽屉
      configsDrawer.value = !configsDrawer.value

      // 查看算子日志
      const { operator_name } = evt.item.getModel()
      operatorName.value = operator_name
      if (props.viewMode === 'view') {
        await getPiplineJobLog()
      }
    })
    
    graph.value.on('aftercreateedge', (e) => {
      try {
        if (!e.edge || e.edge.destroyed) return
        const newEdge = e.edge.getModel()

        e.edge.refresh();

        // 检查是否是自连接
        if (newEdge.source === newEdge.target) {
          graph.value.removeItem(e.edge)
          return
        }
        
        // 添加到 edges 数组
        if (!edges.value.some(edge => edge.id === newEdge.id)) {
          edges.value.push(newEdge)
        }

        // 更新源节点的输出连接状态
        const sourceNode = graph.value.findById(newEdge.source)
        if (sourceNode) {
          graph.value.setItemState(sourceNode, 'has-output', true)
        }
        // 更新目标节点的输入连接状态
        const targetNode = graph.value.findById(newEdge.target)
        if (targetNode) {
          graph.value.setItemState(targetNode, 'has-input', true)
        }
      } catch (error) {
        console.error('边创建错误:', err)
      }
    })
    
    graph.value.on('afterremoveitem', (e) => {
      // 检查 e.item 是否存在
      if (!e.item) return
      const itemType = e.item.getType?.()
      if (itemType === 'node') {
        const nodeId = e.item.getID()
        nodes.value = nodes.value.filter(node => node.id !== nodeId)
        edges.value = edges.value.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        )
        if (selectedNode.value?.id === nodeId) {
          selectedNode.value = null
        }
      } else if (itemType === 'edge') {
        const edgeId = e.item.getID()
        edges.value = edges.value.filter(edge => edge.id !== edgeId)

        // 新增：删除边后更新相关节点的状态
        const edgeModel = e.item.getModel()
        const sourceNode = graph.value.findById(edgeModel.source)
        const targetNode = graph.value.findById(edgeModel.target)
        
        if (sourceNode) {
          graph.value.setItemState(sourceNode, 'source', false)
          // 检查是否还有输出边
          const hasOutput = edges.value.some(edge => edge.source === edgeModel.source)
          graph.value.setItemState(sourceNode, 'has-output', hasOutput)
        }
        
        if (targetNode) {
          graph.value.setItemState(targetNode, 'target', false)
          // 检查是否还有输入边
          const hasInput = edges.value.some(edge => edge.target === edgeModel.target)
          graph.value.setItemState(targetNode, 'has-input', hasInput)
        }
      }
    })

    // 连线验证
    graph.value.on('beforecreateedge', (e) => {
      // 确保源节点和目标节点都存在，确保不是自连接（不能连接自己）
      if (!e.source || !e.target || e.source === e.target) {
        return false // 阻止连线
      }

      // 确保是从 output-point 拖到 input-point
      if (e.sourceAnchor && e.targetAnchor) {
        const isFromOutput = e.sourceAnchor.index === 1 // output-point: index 1
        const isToInput = e.targetAnchor.index === 0 // input-point: index 0
        return isFromOutput && isToInput
      }
      return true // 允许连线
    })
    
    // 初始渲染
    graph.value.data({
      nodes: nodes.value,
      edges: edges.value
    })

    await graph.value.render()
    isGraphInitialized.value = true
  }

  // 加载数据到图中
  const loadDataToGraph = async (data) => {
    if (!graph.value || graph.value.destroyed) return
    try {
      // 先清空现有数据
      graph.value.clear()
      
      // 更新本地状态
      nodes.value = data.nodes || []
      edges.value = data.edges || []

      // 更新节点索引，会根据索引插座对应节点状态
      nodes.value.map((node, index) => {
        node.index = index
      })
      
      // 加载新数据
      await graph.value.data({
        nodes: nodes.value,
        edges: edges.value
      })
      
      setTimeout(() => {
        graph.value.refresh()
      }, 300)
    } catch (error) {
      console.error('加载数据到图中失败:', error)
    }
  }

  // 解析工作流数据
  const parseWorkflowData = (data) => {
    if (!data) return { nodes: [], edges: [] }

    // 如果是字符串，尝试解析为YAML
    if (typeof data === 'string') {
      try {
        const parsed = jsYaml.load(data)
        
        // 转换节点格式为G6所需格式
        const nodes = Object.entries(parsed.process || {}).map(([_, node]) => {
          const i18nData = operatorI18n[locale.value]?.[node.operator_name]
          
          // 处理配置项国际化
          const configs = (node.configs || []).map((config, index) => {
            const i18nParam = i18nData?.params?.[index]
            
            // 处理select_options国际化
            let selectOptions = config.select_options
            if (i18nParam?.option_values && config.config_type === 'select') {
              selectOptions = config.select_options.map(option => {
                // 在i18nParam.option_values中找到对应的选项
                const matchedOption = i18nParam.option_values.find(
                  opt => opt.key === option.label || opt.key === option.value
                )
                return {
                  ...option,
                  label: matchedOption?.label || option.label
                }
              })
            }
            
            return {
              ...config,
              display_name: i18nParam?.name || config.config_name,
              display_description: i18nParam?.description,
              select_options: selectOptions
            }
          })
          
          return {
            id: node.id || `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            operatorId: node.operator_id || node.operatorId,
            type: 'image-node',
            operator_type: node.operator_type,
            operator_name: node.operator_name,
            display_name: i18nData?.name || node.display_name || node.operator_name,
            configs: configs,
            icon: node.icon,
            color: node.color || '#ccc',
            x: node.position?.x || Math.random() * 300,
            y: node.position?.y || Math.random() * 300,
            label: i18nData?.name || node.display_name || node.operator_name // G6 需要label属性
          }
        })
        
        // 转换边格式
        const edges = (parsed.edges || []).map((edge, index) => ({
          id: `edge_${index}`,
          source: edge.source,
          target: edge.target,
          type: 'custom-edge'
        }))

        return { nodes, edges }
      } catch (error) {
        console.error('YAML解析失败:', error)
        return { nodes: [], edges: [] }
      }
    }
    
    // 如果是对象，直接使用
    return data
  };

  // 配置抽屉关闭
  const configsDrawerClose = () => {
    configsDrawer.value = false
    tabsValue.value = 'config'
    logLevelval.value = 'all'
  }

  // 处理抽屉关闭前的事件
  const handleBeforeClose = async (done) => {
    await dynamicFormRefs.value.handleSave()
    done();
    configsDrawer.value = false;
    tabsValue.value = 'config';
    logLevelval.value = 'all';
  }
  
  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selectedNode.value) {
      console.log('selectedNode.value', selectedNode.value)

      // 删除所有与该节点相关的连线
      const edgesToRemove = edges.value.filter(
        edge => edge.source === selectedNode.value.id || edge.target === selectedNode.value.id
      )
      
      edgesToRemove.forEach(edge => {
        graph.value.removeItem(edge.id)
      })

      // 删除节点本身
      graph.value.removeItem(selectedNode.value.id)

      // 更新数据状态
      nodes.value = nodes.value.filter(node => node.id !== selectedNode.value.id)
      edges.value = edges.value.filter(
        edge => edge.source !== selectedNode.value.id && edge.target !== selectedNode.value.id
      )

      // 清除选中状态
      selectedNode.value = null
      configsDrawer.value = false
    }
    // graph.value.removeItem(selectedNode.value.id, true) // true 表示自动删除相关边
  }
  
  // 开始拖拽节点
  const onDragStart = (event, node) => {
    console.log('onDragStart', node)
    event.dataTransfer.setData('text/plain', JSON.stringify({
      id: String(node.id),
      operatorId: String(node.id),
      operator_type: node.operator_type,
      operator_name: node.operator_name,
      display_name: node.display_name,
      configs: node.configs,
      icon: node.pic_base64,
      color: node.color || "#ccc"
    }))
    event.dataTransfer.effectAllowed = 'copy'
  }
  
  // 修改后的放置处理
  const onDrop = (event) => {
    event.preventDefault()
    // 关键检查：确保图实例存在
    if (!graph.value) {
      console.error('图实例未初始化')
      return
    }
    try {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'))
      const point = graph.value.getPointByClient(event.clientX, event.clientY)
      
      // 生成唯一ID（时间戳+随机数）
      const uniqueId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      const newNode = {
        id: uniqueId,
        operatorId: data.id,
        type: 'image-node',
        operator_type: data.operator_type,
        configs: data.configs,
        operator_name: data.operator_name,
        display_name: data.display_name,
        icon: `data:image/png;base64,${data.icon}`,
        color: data.color,
        x: point.x,
        y: point.y
      }

      nodes.value.push(newNode)
      graph.value.addItem('node', newNode)
    } catch (err) {
      console.error('拖放失败:', err)
    }
  };
  
  // 工具栏功能
  const zoomIn = () => {
    if (graph.value) {
      const currentZoom = graph.value.getZoom()
      graph.value.zoomTo(currentZoom * 1.2)
    }
  }
  
  const zoomOut = () => {
    if (graph.value) {
      const currentZoom = graph.value.getZoom()
      graph.value.zoomTo(currentZoom * 0.8)
    }
  }
  
  const resetView = () => {
    if (graph.value) {
      graph.value.fitCenter()
      // graph.value.zoomTo(1) // 重置缩放级别
    }
  }
  
  const clearCanvas = () => {
    if (graph.value) {
      graph.value.clear()
      nodes.value = []
      edges.value = []
      selectedNode.value = null
    }
  }

  const emit = defineEmits(['save'])
  
  // 保存工作流
  const saveWorkflow = async () => {
    try {
      // 检查是否有节点
      if (nodes.value.length === 0) {
        emit('save', {
          success: false,
          error: t('dataPipelines.noNodesError')
        })
        return
      }

      // 检查节点连接性
      if (nodes.value.length > 1) {
        const unconnectedNodes = nodes.value.filter(node => {
          return !edges.value.some(edge => 
            edge.source === node.id || edge.target === node.id
          )
        })

        if (unconnectedNodes.length > 0) {
          const firstUnconnectedNode = unconnectedNodes[0]
          const nodeName = firstUnconnectedNode.operator_name || t('dataPipelines.unnamedNode', { id: firstUnconnectedNode.id })
          emit('save', {
            success: false,
            error: t('dataPipelines.unconnectedNodeError', { nodeName })
          })
          return
        }
      }

      const invalidConfigs = []
      nodes.value.forEach(node => {
        if (!node.configs || !Array.isArray(node.configs)) return
        
        node.configs.forEach(config => {
          // 检查必填项且值为空的情况
          if (config.is_required && 
            (config.final_value === null || 
              config.final_value === undefined || 
              config.final_value === '')) {
            invalidConfigs.push({
              nodeId: node.id,
              nodeName: node.display_name || node.operator_name || t('dataPipelines.unnamedNode', { id: node.id }),
              configName: config.display_name || config.config_name,
              config
            })
          }
        })
      })

      // 如果存在未填写的必填项
      if (invalidConfigs.length > 0) {
        const firstInvalid = invalidConfigs[0]
        emit('save', {
          success: false,
          error: t('dataPipelines.configRequiredError', { nodeName: firstInvalid.nodeName, configName: firstInvalid.configName }),
          invalidConfigs
        })
        
        // 自动聚焦到第一个有问题的节点
        const item = graph.value.findById(firstInvalid.nodeId)
        if (item) {
          configsDrawer.value = true
          graph.value.setItemState(item, 'selected', true)
          selectedNode.value = nodes.value.find(n => n.id === firstInvalid.nodeId)
        }
        return
      }

      // 验证所有节点的表单
      // const validationResults = await Promise.all(
      //   nodes.value.map(async node => {
      //     console.log('节点ID:', node); // 调试信息
      //     const formRef = dynamicFormRefs.value[node.id];
      //     if (!formRef) return { valid: true }; // 如果没有表单引用，假设验证通过
          
      //     try {
      //       await formRef.validate();
      //       return { valid: true, nodeId: node.id };
      //     } catch (error) {
      //       console.log('节点ID:', node.id, '验证失败:', error); // 调试信息
      //       return { 
      //         valid: false, 
      //         nodeId: node.id,
      //         nodeName: node.display_name || node.operator_name,
      //         errors: error
      //       };
      //     }
      //   })
      // )

      // 检查验证结果
      // const invalidNodes = validationResults.filter(result => !result.valid);
      // console.log('验证结果:', validationResults);
      // if (invalidNodes.length > 0) {
      //   // 找出第一个验证失败的节点
      //   const firstInvalid = invalidNodes[0];
      //   emit('save', {
      //     success: false,
      //     error: t('dataPipelines.invalidConfigError', { 
      //       nodeName: firstInvalid.nodeName 
      //     })
      //   });
        
      //   // 可选：自动聚焦到第一个验证失败的节点
      //   const invalidNode = nodes.value.find(n => n.id === firstInvalid.nodeId);
      //   if (invalidNode) {
      //     const item = graph.value.findById(invalidNode.id);
      //     if (item) {
      //       graph.value.setItemState(item, 'selected', true);
      //       selectedNode.value = invalidNode;
      //       configsDrawer.value = true;
      //     }
      //   }
        
      //   return
      // }

      // 全部验证通过，生成工作流数据
      const workflowData = generateWorkflowData()
      console.log('保存工作流:', workflowData)
      emit('save', {
        success: true,
        data: workflowData
      })
    } catch (error) {
      console.error('保存工作流时出错:', error)
      emit('save', {
        success: false,
        error: t('dataPipelines.saveError')
      })
    }
    // alert(`工作流包含 ${nodes.value.length} 个节点和 ${edges.value.length} 条连接。`)
  }

  // 生成工作流数据
  const generateWorkflowData = () => {
    const dsl = {
      name: props.form.name,
      description: props.form.description,
      type: props.form.type,
      process: {},
      edges: edges.value.map(edge => ({
        source: edge.source,
        target: edge.target
      }))
    }

    // 构建图的邻接表（记录每个节点的下游节点）
    const graph = {}
    const inDegree = {} // 记录每个节点的入度（有多少节点指向它）
    nodes.value.forEach(node => {
      graph[node.id] = []
      inDegree[node.id] = 0
    })

    edges.value.forEach(edge => {
      graph[edge.source].push(edge.target) // source -> target
      inDegree[edge.target]++ // target的入度+1
    })

    // 拓扑排序：从入度为0的节点开始（没有依赖的节点）
    const queue = []
    const sortedNodes = []
    
    // 初始时，所有入度为0的节点入队
    nodes.value.forEach(node => {
      if (inDegree[node.id] === 0) {
        queue.push(node.id)
      }
    })

    // 执行拓扑排序
    while (queue.length > 0) {
      const nodeId = queue.shift()
      sortedNodes.push(nodeId)

      // 遍历该节点的所有下游节点
      graph[nodeId].forEach(neighborId => {
        inDegree[neighborId]--
        if (inDegree[neighborId] === 0) {
          queue.push(neighborId)
        }
      })
    }

    // 按拓扑顺序生成YAML节点，使用节点的唯一ID作为键
    sortedNodes.forEach(nodeId => {
      const node = nodes.value.find(n => n.id === nodeId)
      if (node) {
        // 使用节点的唯一ID作为键，避免重复
        const nodeKey = node.id

        // 处理节点配置中的数组字段，转为逗号分隔字符串
        const processedConfigs = (node.configs || []).map(config => {
          if (config.config_type === 'select-v2' && Array.isArray(config.final_value)) {
            const arrayStr = config.final_value
              .map(item => `'${item}'`)
              .join(', ')
            return {
              ...config,
              final_value: `[${arrayStr}]`
            }
          }
          return config
        })

        console.log('processedConfigs=', processedConfigs)
        
        dsl.process[nodeKey] = {
          id: node.id,
          operator_id: node.operatorId,
          operator_type: node.operator_type,
          operator_name: node.operator_name,
          display_name: node.display_name,
          icon: node.icon.includes('data:image/png;base64,') ? node.icon : `data:image/png;base64,${node.icon}`,
          position: { x: node.x, y: node.y },
          configs: processedConfigs
        }
      }
    })

    return {
      yaml: jsYaml.dump(dsl),
      json: dsl
    }
  }

  // 导入工作流
  const loadWorkflowFromYaml = (yamlString) => {
    try {
      // 解析YAML
      const workflowData = jsYaml.load(yamlString)
      
      // 清空当前画布
      clearCanvas()
      
      // 添加节点
      const nodeMap = {}
      Object.entries(workflowData.nodes).forEach(([nodeId, nodeConfig]) => {
        console.log(nodeConfig)
        const newNode = {
          id: nodeConfig.id,
          operatorId: nodeConfig.operatorId,
          type: 'image-node',
          operator_type: nodeConfig.operator_type,
          operator_name: nodeConfig.operator_name,
          display_name: nodeConfig.display_name,
          configs: nodeConfig.configs,
          icon: nodeConfig.icon,
          x: nodeConfig.position.x,
          y: nodeConfig.position.y
        }
        
        nodeMap[nodeId] = newNode
        nodes.value.push(newNode)
        graph.value.addItem('node', newNode)
      })
      
      // 添加边
      workflowData.edges.forEach(edge => {
        const newEdge = {
          source: edge.source,
          target: edge.target,
          type: 'custom-edge'
        }
        
        edges.value.push(newEdge)
        graph.value.addItem('edge', newEdge)
      })
      
      graph.value.fitView() // 自适应视图
      graph.value.refresh() // 强制刷新视图
      
      return true
    } catch (error) {
      console.error('解析YAML失败:', error)
      return false
    }
  }
  
  // 导出工作流
  const exportWorkflow = () => {
    const dataStr = JSON.stringify({
      nodes: nodes.value,
      edges: edges.value
    }, null, 2)
    
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `workflow-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 当前表单数据
  const currentFormData = ref({})

  // 保存配置回调
  const handleSave = (data, formRef) => {
    if (selectedNode.value) {
      selectedNode.value.configs = data
      // 保存 formRef 引用
      if (formRef) {
        dynamicFormRefs.value[selectedNode.value.id] = formRef;
      }
      console.log('更新后的节点配置:', selectedNode.value)
      configsDrawer.value = false
    }
  }

  // 算子日志
  const getPiplineJobLog = async () => {
    const param = `ops_name=${operatorName.value}${logLevelval.value === 'all' ? '' : '&level=' + logLevelval.value}&page=1&page_size=1000000`
    const url = `dataflow/jobs/pipline_job_log/${props.infoId}?${param}`
    const { data } = await useFetchApi(url).get().json()
    if (data.value.code == 200) {
      logData.value = data.value.data.data.map((item) => {
        return `${formatTimestamp(item.create_at)} | ${item.level} | ${
          item.content
        }`;
      });
    }
  }

  const formatTimestamp = (timestamp) => {
    // 检查时间戳是否为 null、undefined 或无效值
    if (timestamp === null || timestamp === undefined || timestamp === '') {
      return '-';
    }
    
    // 检查时间戳是否为有效数字
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      return '-';
    }
    
    // 检查时间戳是否为秒级
    const date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
    
    // 检查日期对象是否有效
    if (isNaN(date.getTime())) {
      return '-';
    }

    // 格式化年、月、日、时、分、秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // 返回格式化后的日期字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  defineExpose({
    saveWorkflow,
    initGraph,
    // loadWorkflowFromYaml,
  })
  
  let resizeObserver
  onMounted(async () => {
    try {
      await getUserInfo()
      // await getOperatorList()
      await initGraph()

      // resize观察器
      if (graphContainer.value) {
        resizeObserver = new ResizeObserver(() => {
          if (graph.value && !graph.value.destroyed) {
            const width = graphContainer.value.clientWidth
            const height = graphContainer.value.clientHeight
            graph.value.changeSize(width, height)
            graph.value.fitCenter()
          }
        })
        resizeObserver.observe(graphContainer.value)
      }
      document.addEventListener('keydown', handleKeyDown)
    } catch (error) {
      console.error('组件挂载失败:', error)
    }
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    if (resizeObserver) {
      resizeObserver.disconnect() // 清理监听
    }
    if (graph.value) {
      graph.value.destroy()
    }
  })
</script>
  
<style scoped lang="scss">
  /* 节点容器 */
  .g6-node-container {
    cursor: move !important;
    pointer-events: all !important;
  }

  .g6-node-container, 
  .g6-node-container * {
    pointer-events: all !important;
    cursor: move !important;
  }

  /* 连接点 */
  .g6-node .input-point,
  .g6-node .output-point {
    opacity: 0.7;
    transition: opacity 0.2s, fill 0.2s;
    cursor: crosshair;
  }

  /* 画布区域接受拖拽 */
  .graph-container {
    user-select: none;
  }

  .g6-node:hover .input-point,
  .g6-node:hover .output-point {
    opacity: 1;
  }

  .g6-node {
    background: transparent !important;
  }

  .g6-node text {
    white-space: pre-wrap !important;
    text-align: center !important;
    background: transparent !important;
  }

  .g6-node .image-bg {
    fill: #fff !important;
    stroke: #dcdfe6 !important;
    stroke-width: 1px !important;
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.1)) !important;
  }

  /* 高亮状态下的节点样式 */
  .g6-node-highlight .image-bg {
    stroke: #1890ff !important;
    stroke-width: 2px !important;
    filter: drop-shadow(0 0 8px rgba(24, 144, 255, 0.3)) !important;
  }

  /* 边悬停样式 */
  .g6-edge-hover .edge-path {
    stroke: #1890ff !important;
  }

  /* 删除按钮样式 */
  .g6-edge-hover .delete-icon {
    opacity: 1 !important;
    pointer-events: all !important;
    transition: opacity 0.2s;
  }

  .workflow-editor {
    overflow: hidden;
    height: calc(100vh - 280px);
    display: flex;
    flex-direction: column;
    border-radius: 6px;

    :deep(.el-drawer__body) {
      padding: 0 20px;
    }

    :deep(.el-overlay) {
      top: 81px !important;
      background-color: transparent;
    }
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 280px 1fr;
    flex: 1;
    overflow: hidden;
    width: 100%;
  }
  
  .sidebar {
    // background: #f5f7fa;
    // border-right: 1px solid #e4e7ed;
    background: #ffffff;
    // padding-right: 20px;
    overflow-y: auto;

    :deep(.el-collapse-item__header) {
        background-color: transparent;
    }
    :deep(.el-collapse-item__header.is-active) {
        background-color: transparent;
        border-bottom: 0;
    }
    :deep(.el-collapse-item__wrap) {
        background-color: transparent;
    }

    :deep(.el-collapse-item__wrap) {
        overflow: inherit;
    }

    :deep(.is-active) {
      font-weight: 500 !important;
      color: #333 !important;
    }

    ::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
    }
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin: 15px 0 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid #3250bd;
    color: #303133;
  }
  
  .node-category {
    margin-bottom: 20px;
  }
  
  .node-list {
    display: flex;
    /* grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); */
    gap: 12px;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .node-item {
    background: white;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    padding: 15px 10px 10px 10px;
    text-align: center;
    cursor: grab;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    user-select: none;
    -webkit-user-drag: element;
    width: calc(50% - 6px);
  }
  
  .node-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(64, 158, 255, 0.2);
    border-color: #3250bd;
  }
  
  .node-preview {
    width: 40px;
    height: 40px;
    // object-fit: contain;
    margin: 0 auto 8px auto;
    border-radius: 6px;
  }
  
  .node-name {
    font-size: 13px;
    font-weight: 500;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .graph-container {
    position: relative;
    background: #fafafa;
    overflow: hidden;
    user-select: none;
    height: 100%;
    width: 100%;
  }

  #graph {
    width: 100%;
    height: 100%;
  }

  .toolbar {
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
  }
  
  .graph-container {
    position: relative;
    background: #fafafa;
    overflow: hidden;
    user-select: none;
  }
  
  #graph {
    width: 100%;
    height: 100%;
  }
  
  .toolbar {
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    display: flex;
    flex-direction: column;
    // gap: 15px;
  }
  
  .toolbar-btn {
    padding: 10px 5px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s;
    color: #606266;
    display: flex;
    align-items: center;
  }
  
  .toolbar-btn:hover {
    background: #ecf5ff;
    color: #3250bd;
  }
  
  .instructions h3 {
    margin-bottom: 10px;
    color: #303133;
    font-size: 16px;
  }
  
  .instructions ul {
    padding-left: 10px;
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
  }
  
  .instructions li {
    margin-bottom: 8px;
  }

  .resultBox {
    border-radius: 12px;
    background: #0c111d;
    padding: 24px;
    height: calc(100vh - 230px);
    overflow-y: auto;
    color: #f9fafb;
    font-family: 'Roboto Mono';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }

  .expand-but {
    position: absolute;
    top: 65px;
    left: -15px;
    background: #0c111d;
    color: #fff !important;
    border: 0;
    border-radius: 50% !important;

    &:hover {
      background: #0c111d;
    }
  }
</style>

<style>
.highlight {
  background-color: #788bcf;
  color: #fff;
  padding: 0 2px;
  border-radius: 2px;
}
.g6-node-dom {
  pointer-events: none;
}

.g6-node-dom > div {
  pointer-events: none;
}

.g6-edge path {
  fill: inherit !important;
}

.operator-status .status-item {
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 12px;
}

.operator-status .status-item .status-icon {
  width: 25px;
  height: 25px;
  margin-right: 5px;
  border-radius: 50%;
}

.operator-status .status-item .status-time {
  font-size: 10px;
  color: #999999;
}
</style>