export const finetune = {
  title: '微调实例',
  new: {
    title: '新建微调实例',
    desc: '在专属算力实例上部署您的模型',
    name: '实例名称',
    nameTip:'请输入实例名称',
    modelId: '模型 ID',
    modelIdTip: '请输入模型ID',
    framework: '运行时框架',
    cluster: '区域',
    clusterTip: '请选择区域',
    clusterDec1: '建议选择最靠近您客户的地域，可降低访问时延；',
    clusterDec2: '创建成功后不支持切换地域。',
    resource: '资源配置',
    resourceTip: '请选择资源配置',
    resourceDec1: '您可以随时在空间设置中切换到不同的空间云资源',
    resourceDec2: '切换到付费资源后，将根据使用时长向您收取费用',
    createFinetune: '创建实例',
    createSuccess: '微调实例创建成功',
    tip: "应用于微调实例，创建后不可更改",
    createFail: "微调实例创建失败",
  },
  detail: {
    notebook: '启动 Notebook',
    tab1: '概览',
    tab2: '设置',
    noDataTip1:'微调实例尚未处于运行状态',
    noDataTip2:'请等待部署成功或前往设置页面启用运行状态后，再尝试访问微调界面。',
    settings: {
      region: '区域',
      regionTip1: '建议选择靠近您的地域，可降低访问时延；',
      regionTip2: '创建成功后不支持切换地域。',
      regionTip3: '实例区域',
      resources: '空间云资源',
      resourcesTip1: '可切换到不同的微调实例云资源。',
      resourcesTip2: '切换到付费资源后，将根据使用时长向您收取费用。',
      resourcesTip3: '当前云资源',
      status: '运行状态',
      statusTip1: '切换运行或暂停微调实例',
      statusVal1: '运行中',
      statusVal2: '已停止',
      enName: '英文名称',
      enNameTip1: '应用于应用空间路径，创建后不可更改',
      cnName: '中文名称',
      cnNameTip1: '将会显示在实例列表页面中，选填',
      delete: '删除',
      deleteTip1: '此操作无法撤销.这将永久删除',
      deleteTip2: '模型微调。',
      finetuneName: '微调实例名称'
    }
  }
}