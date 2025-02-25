export const endpoints = {
  title: "专属实例",
  resourceType: '资源类型',
  replica: "弹性副本",
  summary: '概览',
  detail: {
    endpointUrl: '专属实例 URL',
    modelId: '模型 ID',
    parameters: '参数项',
    currentEndpointReplica: '当前弹性实例',
    cloudResource: '资源配置',
    endpointStatus: '实例状态'
  },
  new: {
    title: "新建专属实例",
    desc: "将模型部署到专属实例",
    name: "实例名称",
    modelId: "模型 ID",
    modelIdTip: "请输入模型ID",
    minReplica: "最小弹性副本",
    maxReplica: "最大弹性副本",
    resource: "资源配置",
    resourceTip1: "您可以随时在实例设置中切换到不同的实例云资源。",
    resourceTip2: "切换到付费资源后，将根据使用时长向您收取费用。",
    framework: "运行时框架",
    cluster: "区域",
    public: "公开",
    publicDesc: "任何互联网上的人都可以访问这个实例。",
    private: "私有",
    privateDesc: "只有你（个人）或你所在组织的成员可以访问这个实例。",
    createEndpoint: "新建实例",
    dedicated: "专属实例",
    tip: "应用于专属实例，创建后不可更改",
    createSuccess: "专属实例创建成功",
    createFail: "专属实例创建失败",
    quantization: "量化"
  },
  settings: {
    stop: "暂停",
    restart: "重启",
    restartEndpoint: "重启专属实例",
    stopEndpoint: "暂停专属实例",
    delete: "删除",
    deleteEndpoint: "删除专属实例",
    delTips: "此操作",
    delTips2: "撤销，这将永久删除",
    delTips3: "专属实例。",
    confirmDel: "我已知晓,确认删除",
    namespaceName: "专属实例名称/ID",
    toggleStatusSuccess: '更新成功，请等待实例状态切换',
    statusText: "当前实例目前是",
    status: "状态",
    changeVisibility: "修改实例可见性",
    visibility: "实例可见性",
    privateVis: "只有创建者或组织成员可见",
    publicVis: "任何人都可以看到此实例",
    privateInfo: "，仅创建者或者组织管理员可进行修改",
    publicInfo: "， 任何互联网上的人都可以看到此实例。",
    resource: "资源配置",
    resourceTip: "您可以随时在实例设置中切换到不同的实例云资源。切换到付费资源后，将根据使用时长向您收取费用。",
    currentCloudResource: '当前云资源',
    framework: "运行时框架",
    currentFramework: '当前运行时框架',
    maxReplica: "最大弹性副本",
    minReplica: "最小弹性副本",
    currentMaxReplica: "当前最大弹性副本",
    currentMinReplica: "当前最小弹性副本"
  },
  playground: {
    title: "沙盒",
    parameters: "参数",
    generation: "文本生成",
    json: "JSON 输出",
    maximum: "最大化",
    send: "发送",
    test: "推理 API",
    api: "发送请求到专属实例",
    useToken: '使用我的 token',
    wgTit: '测试你的模型',
    wgDec: '文生图',
    wgBtn: '图片生成',
  }
}