export default {
  rule: {
    nameRule: "2-70个字母数字_.-的字符串，_.-不能并列出现",
    nameSpaceRule: "2-20位字母数字以及 _ 构成的字符串",
  },
  models: {
    title: "模型",
    placeholder: "模型名字",
    downloadModel: "下载模型数据",
    download: "下载模型",
    newModel: {
      title: "新建模型仓库",
      titleDesc: "仓库包含所有的模型文件和修订的历史记录",
      owner: "所有者",
      modelName: "模型名称",
      modelNickName: "模型别名",
      modelDesc: "模型简介",
      public: "公开",
      publicDesc:
        "任何互联网上的人都可以看到这个仓库。只有你（个人）或你所在组织的成员可以提交。",
      private: "私有",
      privateDesc: "只有你（个人）或你所在组织的成员可以看到并提交到这个仓库。",
      tips: "创建模型后，你可以使用网页或 Git 上传你的文件。",
      createModel: "创建模型",
      createSuccess: "模型创建成功",
    },
  },
  datasets: {
    title: "数据集",
    placeholder: "数据集名字",
    downloadDataset: "下载数据集",
    datasetName: "数据集名称",
    datasetNameTips: "应用于数据集路径，创建后不可更改",
    namespaceDatasetName: "命名空间/数据集名称",
    datasetNickName: "数据集别名",
    datasetDesc: "数据集简介",
    newDataset: {
      title: "新建数据集仓库",
      titleDesc: "仓库包含所有的模型文件和修订的历史记录",
      owner: "所有者",
      datasetName: "数据集名称",
      datasetNickName: "数据集别名",
      datasetDesc: "数据集简介",
      public: "公开",
      publicDesc:
        "任何互联网上的人都可以看到这个仓库。只有你（个人）或你所在组织的成员可以提交。",
      private: "私有",
      privateDesc: "只有你（个人）或你所在组织的成员可以看到并提交到这个仓库。",
      tips: "创建数据集后，你可以使用网页或 Git 上传你的文件。",
      tips2: "暂不支持创建公开的数据集，如有需要可以联系管理员进行人工审核。",
      createDataset: "创建数据集",
      createSuccess: "数据集创建成功",
    },
    edit: {
      tips: "将会显示在数据集列表页面中，选填",
      tips2: "一段关于数据集的介绍，选填",
      changeVisibility: "修改数据集可见性",
      statusText: "当前数据集目前是",
      status: "状态",
      datasetVisibility: "数据集可见性",
      delDataset: "删除数据集",
      delTips: "此操作",
      delTips2: "撤销，这将永久删除",
      delTips3: "数据集及其所有文件。",
      privateVis: "只有创建者或组织成员可见",
      publicVis: "任何人都可以看到此数据集",
      confirmDel: "我已知晓,确认删除",
      privateInfo: "，仅创建者或者组织管理员可进行提交",
      publicInfo: "， 任何互联网上的人都可以看到此数据集。",
      needDatasetName: "请先提供数据集别名",
      needDatasetDesc: "请先提供数据集介绍",
    },
  },
  organization: {
    orgSetting: "组织设置",
    orgInfo: "组织信息",
    orgTeam: "团队成员",
    orgNameSpace: "组织命名空间",
    orgSpaceTips: "创建完成后，命名空间不可更改",
    orgNickName: "组织别名",
    orgAvatar: "组织头像",
    orgType: "组织类型",
    orgHomepage: "组织主页",
    model: "模型",
    dataset: "数据集",
    invite: {
      title: "邀请",
      inviteNew: "邀请新成员",
      inviteDesc: "你正在邀请新成员到组织",
      addSuccess: "添加成员成功",
    },
    newOrganization: {
      title: "新建组织",
      createOrg: "创建组织",
      createSuccess: "组织创建成功",
      inputSpaceNamePls: "请填写组织命名空间",
    },
    edit: {
      updateSuccess: "organization已更新",
    },
  },
  navbar: {
    models: "模型",
    datasets: "数据集",
    profile: "个人信息",
    editProfile: "账号设置",
    newModel: "新建模型",
    newDataset: "新建数据集",
    newOrganization: "新建组织",
    logout: "退出登录",
    loginRegister: "登录/注册",
    login: "登录",
  },
  all: {
    changeVis: "修改可见性为",
    enterPls: "请输入",
    sureDel: "以确认删除",
    canNot: "无法",
    role: "角色",
    userName: "用户名",
    nickName: "用户昵称",
    phone: "手机号码",
    email: "邮箱",
    confirm: "确认",
    cancel: "取消",
    add: "添加",
    upDate: "更新",
    changeSuccess: "切换成功",
    changeCancel: "操作取消",
    addSuccess: "添加成功",
    delSuccess: "删除成功",
    lastTime: "更新时间",
    downloadCount: "下载热度",
    public: "公开",
    private: "私有",
    recentlyUpdate: "最近更新",
    trending: "热门",
    mostDownload: "最多下载",
    mostFavorite: "最多喜欢",
    noData: "暂无数据",
    save: "保存",
    remove: "移除",
    saveSetting: "保存设置",
    toBeUploaded: "待上传",
    clickUpload: "点击上传",
    uploadAvatar: "上传头像",
    uploadPic1Mb: "请上传不超过1MB的图片文件",
    select: "选择",
    inputPls: "请输入",
    inputNickNamePlc: "请输入别名",
    inputDescPlc: "请输入简介",
    lfsTips: "在下载前请确认您安装了git-lfs  (https://git-lfs.com)",
    lfsTips2: "如果您不想下载LFS文件的内容，请在环境变量中添加",
  },
  community: {
    discussion: {
      back: "回到话题列表",
      new: "新建话题",
    },
    discussionDetail: {
      reply: "回复",
      comment: "评论",
      cancel: "取消",
      updateSuccess: "标题更新成功！",
      warn: "内容不能为空",
      addSuccess: "添加评论成功",
    },
    MD: {
      edit: "编辑",
      preview: "预览",
      desc: "通过拖拽上传图片，音频，视频，或者",
      click: "点击这里上传",
      default: "留下评论",
    },
    newDiscussion: {
      new: "新建话题",
      title: "标题",
      content: "内容",
      create: "创建话题",
      cancel: "取消",
    },
    empty: {
      wellcome: "欢迎来讨论",
      decs: "这里是与OpenCSG讨论和合作的地方！",
      new: "新建话题",
    },
  },
  profile: {
    editProfile: "编辑个人信息",
    settings: "设置",
    interests: "兴趣",
    organization: "组织机构",
    menu: {
      profile: "个人资料",
      accountInformation: "账户信息",
      accessToken: "Access Token",
      gitToken: "Git Token",
      sshKey: "SSH Keys",
      billing: "账单",
    },
    edit: {
      title: "个人资料设置",
      uploadAvatar: "上传头像",
      removeAvatar: "移除头像",
      updateSuccess: "profile已更新",
    },
  },
  gitToken: {
    title: "用户 Git Token",
    desc: "Git Token 用于授权您执行 Git 相关操作",
    refresh: "刷新 Git Token",
    refreshWarning: "刷新之后现有的 Git Token 将会失效，确认继续吗?",
    confirm: "继续刷新",
    cancelInfo: "操作已取消",
  },
  sshKey: {
    addSshKey: "添加 SSH Key",
    noKeyTips: "现在还没有添加SSH key到您的账户",
    sshKeyName: "SSH Key 名称",
    sshKeyContent: "SSH Key 内容",
    nameWarning: "请您填写SSH Key 名称",
    contentWarning: "请您填写SSH Key 内容",
  },
};
