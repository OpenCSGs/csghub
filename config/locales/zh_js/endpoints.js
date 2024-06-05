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
    cloudResource: '资源',
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
    createSuccess: "实例创建成功",
    dedicated: "专属实例"
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
    toggleStatusSuccess: '更新成功，请等待实例状态切换'
  }
}