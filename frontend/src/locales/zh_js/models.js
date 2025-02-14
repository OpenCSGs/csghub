import { finetune } from "./finetune";

export const models = {
  title: "模型",
  placeholder: "模型名字",
  downloadModel: "下载模型数据",
  download: "下载模型",
  modelName: "模型名称",
  modelNameTips: "应用于模型路径，创建后不可更改",
  namespaceModelName: "命名空间/模型名称",
  modelNickName: "模型别名",
  modelDesc: "模型介绍",
  modelTag: "模型标签",
  modelIndustryTag: "模型行业标签",
  modelsUsedToTrain: "关联模型",
  tips:"创建并上传模型文件",
  index: {
    allFilter: "所有模型",
    inferenceFilter: "支持模型推理",
    finetuneFilter: "支持模型微调",
    evaluationFilter: "支持模型评测"
  },
  newModel: {
    title: "新建模型仓库",
    titleDesc: "仓库包含所有的模型文件和修订的历史记录",
    owner: "所有者",
    modelName: "模型名称",
    modelNickName: "模型别名",
    license: "许可证",
    modelDesc: "模型介绍",
    public: "公开",
    publicDesc:
      "任何互联网上的人都可以看到这个仓库。只有你（个人）或你所在组织的成员可以提交。",
    private: "私有",
    privateDesc: "只有你（个人）或你所在组织的成员可以看到并提交到这个仓库。",
    tips: "创建模型后，你可以使用网页或 Git 上传你的文件。",
    createModel: "创建模型",
    createSuccess: "模型创建成功",
    tip: "应用于模型数据，创建后不可更改",
    createFail: "模型创建失败",
    modelEnName: "模型英文名称",
  },
  edit: {
    tips: "将会显示在模型列表页面中，选填",
    tips2: "一段关于模型的介绍，选填",
    tips3: "选择模型对应的分类标签，便于用户在筛选时更快的找到您的模型。",
    changeVisibility: "修改模型可见性",
    statusText: "当前模型目前是",
    status: "状态。",
    modelVisibility: "模型可见性",
    delModel: "删除模型",
    canNot: "无法",
    delTips: "此操作",
    delTips2: "撤销，这将永久删除",
    delTips3: "模型仓库及其所有文件。",
    privateVis: "只有创建者或组织成员可见",
    publicVis: "任何人都可以看到此模型",
    confirmDel: "我已知晓,确认删除",
    privateInfo: "，仅创建者或者组织管理员可进行提交",
    publicInfo: "， 任何互联网上的人都可以看到此模型",
    needModelName: "请先提供模型别名",
    needModelDesc: "请先提供模型介绍",
    needModelTag: '请先提供模型标签'
  },
  emptyModels: {
    title: "使用多源同步功能丰富模型",
    desc: "多源同步可将 OpenCSG 开源社区以及 Huggingface 的优质模型同步到项目中",
    uploadBtn: "上传本地模型",
    multisyncBtn: "开启多源同步"
  }
}