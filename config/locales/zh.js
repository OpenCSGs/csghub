export default {
  rule: {
    nameRule: "2-70个字母数字_.-的字符串，_.-不能并列出现",
    nameSpaceRule: "2-20位字母数字以及 _ 构成的字符串",
  },
  user_sessions: {
    expiredTitle: '登录状态失效',
    expiredDesc: '登录已失效，请点击重新登录',
    reLogin: '重新登录'
  },
  application_spaces: {
    name: "应用空间名称",
    nickname: "应用空间别名",
    namespaceName: "命名空间/应用空间名称",
    desc: "应用空间介绍",
    stoppedDesc: "此空间已被其所有者暂停。",
    sleepingDesc: "由于长时间未操作，该空间已进入休眠状态。",
    restart: "重启 Space",
    gradioGuide: {
      notice: '开始使用您的 gradio 应用空间！',
      noticeDesc: '应用空间创建成功，请按照以下步骤开始使用（或阅读我们的完整文档）',
      cloneTitle: '克隆应用空间',
      createTitle: '创建 Gradio app.py 文件',
      submitTitle: '提交并推送',
      successNotes: '提交成功后，应用会部署运行在当前页面。',
      dependencyNotesTitle: '关于依赖：',
      dependencyNotes1: '您可以在版本库根目录下添加 requirements.txt 文件，以指定 Python 依赖项。',
      dependencyNotes2: '如果需要，也可以在版本库根目录下添加 packages.txt 文件，指定 Debian 依赖项。',
      dependencyNotes3: 'Gradio 软件包已预装，其版本在 README.md 文件的 sdk_version 字段中设置。',
      docNotesTitle: '关于文档：',
      docNotes1: '点击此处查看 gradio Spaces 的完整文档'
    },
    errorPage: {
      log: '日志',
      build: '构建',
      container: '控制台',
      errorAlert: '应用空间发布失败',
      errorAlertDesc: '代码运行失败，查看日志',
      showErrorLogs: '查看日志'
    },
    new: {
      title: '新建应用空间',
      subTitle1: '应用空间是托管机器学习演示应用代码的 Git 仓库',
      subTitle2: '你可以使用不同的 SDK 构建应用空间',
      owner: '所有者',
      name: '空间名称',
      namePlaceholder: '2-70个字母数字_.-的字符串，_.-不能并列出现',
      nickname: '空间别名',
      nicknamePlaceholder: '请输入别名',
      description: '应用空间介绍',
      descriptionPlaceholder: '请输入简介',
      coverImage: '封面图片',
      coverImageDesc1: '点击上传，或将文件拖到此处',
      coverImageDesc2: '支持 PNG, JPG 格式，高宽比5:2',
      sdk: '选择应用空间SDK',
      sdkDesc: '你可以Gradio作为你的空间。后续将开放 Streamlit、 Static、 Docker 等来托管应用。',
      cloudResource: '空间云资源',
      cloudResourceDesc1: '您可以随时在空间设置中切换到不同的空间云资源。',
      cloudResourceDesc2: '切换到付费资源后，将根据使用时长向您收取费用。',
      public: '公开',
      publicDesc: '任何互联网上的人都可以看到这个仓库。只有你（个人）或你所在组织的成员可以提交。',
      private: '私有',
      privateDesc: '只有你（个人）或你所在组织的成员可以看到并提交到这个仓库。',
      notes: '创建应用空间后，你可以使用网页或 Git 上传你的文件。',
      create: '创建应用空间',
      createSuccess: "应用空间创建成功",
    },
    edit: {
      cloudResource: '空间云资源',
      cloudResourceDesc: '可切换到不同的空间云资源。切换到付费资源后，将根据使用时长向您收取费用。',
      currentCloudResource: '当前云资源',
      runningStatus: '运行状态',
      runningStatusDesc: '切换运行或关停应用空间',
      tips: "将会显示在应用空间列表页面中，选填",
      tips2: "一段关于应用空间的介绍，选填",
      changeVisibility: "修改应用空间可见性",
      statusText: "当前应用空间目前是",
      status: "状态",
      visibility: "应用空间可见性",
      del: "删除应用空间",
      delTips: "此操作",
      delTips2: "撤销，这将永久删除",
      delTips3: "应用空间仓库及其所有文件。",
      privateVis: "只有创建者或组织成员可见",
      publicVis: "任何人都可以看到此应用空间",
      confirmDel: "我已知晓,确认删除",
      privateInfo: "，仅创建者或者组织管理员可进行提交",
      publicInfo: "， 任何互联网上的人都可以看到此应用空间。",
      needName: "请先提供应用空间别名",
      needDesc: "请先提供应用空间介绍",
    },
    download: "下载应用空间",
    downloadSpace: "下载应用空间数据",
    app: "应用",
    status: {
      noAppfile: '待初始化',
      building: '构建中',
      deploying: '部署中',
      startup: '启动中',
      running: '运行中',
      sleeping: '待机中',
      stopped: '暂停中',
      buildingFailed: '构建失败',
      deployFailed: '部署失败',
      runtimeError: '运行报错'
    }
  },
  models: {
    title: "模型",
    placeholder: "模型名字",
    downloadModel: "下载模型数据",
    download: "下载模型",
    modelName: "模型名称",
    datasetNameTips: "应用于模型路径，创建后不可更改",
    namespaceModelName: "命名空间/模型名称",
    modelNickName: "模型别名",
    modelDesc: "模型简介",
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
    edit: {
      tips: "将会显示在模型列表页面中，选填",
      tips2: "一段关于模型的介绍，选填",
      changeVisibility: "修改模型可见性",
      statusText: "当前模型目前是",
      status: "状态",
      modelVisibility: "模型可见性",
      delModel: "删除模型",
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
    },
  },
  comment: {
    sureDel: "确认删除此评论？",
    createComment: "添加评论",
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
    newApplicationSpace: "新建应用空间",
    newOrganization: "新建组织",
    logout: "退出登录",
    loginRegister: "登录/注册",
    login: "登录",
  },
  all: {
    defaultText: "```\nREADME文件内容为空，请下载文件，补充描述内容。\n```",
    tip: "提示",
    summary: "介绍",
    files: "文件",
    community: "讨论",
    settings: "设置",
    tasks: "任务",
    framework: "框架",
    others: "其他",
    contributors: "贡献者",
    historyCommits: "历史提交",
    addFile: "添加文件",
    fileName: "文件名",
    filterTags: "筛选标签",
    provideMoreDesc: "提供更多描述",
    submitNewFile: "提交新文件",
    submitChange: "提交变更",
    createNewFile: "创建新文件",
    createFile: "创建文件",
    uploadFile: "上传文件",
    loadError: "加载数据报错",
    notSupportPreview: "暂不支持预览，请通过 git clone 下载",
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
    update: "更新",
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
    upLoadSuccess: "上传完成",
    upLoadError: "上传错误",
    clickUpload: "点击上传",
    uploadAvatar: "上传头像",
    uploadPic1Mb: "请上传不超过1MB的图片文件",
    select: "选择",
    selectFilePls: "请选择文件",
    fileTooLarge: "文件过大",
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
      warn: "内容不能为空",
      success: "新建话题成功",
    },
    empty: {
      welcome: "欢迎来讨论",
      desc: "这里是与OpenCSG讨论和合作的地方！",
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
    sureDelKey: "你确定要从你的帐户中删除此密钥吗？此操作无法撤消。",
    delKeyName: "删除 Key “key name”",
  },
  shared: {
    commitToMain: "直接提交到 main 分支",
    dragOr: "拖拽文件到这里或者",
    onlyOneFile: "只支持单个文件",
    uploadFile5Mb: "支持 5M 以内大小的文件上传",
    lfs1: "此文件存储在 ",
    lfs2: "Git LFS",
    lfs3: " 中。它太大了，无法显示，但您仍然可以",
    lfs4: "下载",
    lfs5: "它。",
    lfs6: "Git LFS 详细信息",
    lfs7: "指针大小",
    lfs8: "文件大小",
    lfs9: "原始指针文件",
    lfs10: "Git大文件存储（LFS）将大文件替换为Git内部的文本指针，同时将文件内容存储在远程服务器上。",
    lfs11: "更多信息",
    preview: "预览",
    edit: "编辑",
  },
  repo: {
    edit: {
      fileName: "文件名",
      main: "直接提交到 main 分支",
      submit: "提交更新",
      desc: "提供更多描述",
      update: "更新文件",
      cancel: "取消",
    }
  }
};
