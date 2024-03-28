export default {
  rule: {
    nameRule:
      "String of 2-70 charaters, numbers and _.- (_.-discontinuous)",
    nameSpaceRule:
      "String of 2-20 charaters, numbers and _",
  },
  user_sessions: {
    expiredTitle: 'Sign Status Invalid',
    expiredDesc: 'Login has expired. Click "Sign Back In" to log in again',
    reLogin: 'Sign Back In'
  },
  application_spaces: {
    title: "Application Space",
    placeholder: "Application Space Name",
    name: "ApplicationSpace Name",
    nickname: "ApplicationSpace Nickname",
    namespaceName: "Namespace/Name",
    desc: "Application Space intro",
    stoppedDesc: "This Space has been paused by its owner.",
    sleepingDesc: "This Space has entered sleeping state due to no operation for a long time.",
    buildDesc: "This Space is in building, please wait a while",
    errorDesc: "This Space is in Error, please check the logs",
    restart: "Restart",
    wakeup: "Wakeup",
    restartSpace: "Restart the Space",
    stop: "Stop",
    stopSpace: "Stop the Space",
    toggleStatusSuccess: 'Updated, please wait Space status change',
    gradioGuide: {
      notice: 'Get started with your grario app space!',
      noticeDesc: 'The app space was created successfully, please follow the steps below to get started (or read our full documentation)',
      cloneTitle: 'Clone Application Space',
      createTitle: 'Create Gradio app.py file',
      submitTitle: 'Submit and Push',
      successNotes: 'After successful submission, the application will be deployed and run on the current page.',
      dependencyNotesTitle: 'About Dependencies',
      dependencyNotes1: 'You can specify Python dependencies by adding a requirements.txt file at the repository root.',
      dependencyNotes2: 'If necessary, you can also add a packages.txt file in the root directory of the repository to specify Debian dependencies.',
      dependencyNotes3: 'The Gradio package is preinstalled and its version is set in the sdk_version field of the README.md file.',
      docNotesTitle: 'About Docs',
      docNotes1: 'Click here to view the full documentation for gradio Spaces'
    },
    errorPage: {
      log: 'Logs',
      build: 'Build',
      container: 'Container',
      errorAlert: 'Application Space deploy failed',
      errorAlertDesc: 'The code failed to run, check the log',
      showErrorLogs: 'Check error logs',
      startFailed: 'Space failed to start',
      startSuccess: 'Space started'
    },
    new: {
      title: 'Create a new ApplicationSpace',
      subTitle1: 'Appspace is a Git repository that hosts machine learning demo application code',
      subTitle2: 'You can use different SDKs to build app spaces',
      owner: 'Owner',
      name: 'Name',
      namePlaceholder: '2-70 alphanumeric strings _.-, _.- cannot appear side by side',
      nickname: 'Nickname',
      nicknamePlaceholder: 'Please enter nickname',
      description: 'Description',
      descriptionPlaceholder: 'Please enter description',
      coverImage: 'Cover Image',
      coverImageDesc1: 'Click to upload, or drag the file here',
      coverImageDesc2: 'Support PNG, JPG format, aspect ratio 5:2,smaller than 2M',
      sdk: 'Select App Space SDK',
      sdkDesc: 'You can use Gradio as your space. In the future, Streamlit, Static, Docker, etc. will be opened to host applications',
      cloudResource: 'Cloud Resource',
      cloudResourceDesc1: 'You can switch to different space cloud resources at any time in space settings.',
      cloudResourceDesc2: 'After switching to paid resources, you will be charged based on the length of use.',
      public: 'Public',
      publicDesc: 'Anyone on the internet can see this model. Only you (personal model) or members of your organization can commit.',
      private: 'Private',
      privateDesc: 'Only you (personal model) or members of your organization can see and commit to this model.',
      notes: 'Once your model is created, you can upload your files using the web interface or git.',
      create: 'Create Space',
      createSuccess: "Application Space created successfully",
    },
    edit: {
      cloudResource: 'Cloud Resource',
      cloudResourceDesc: 'Switch to different cloud resources. When you switch to a paid resource, you will be charged based on how long you use it.',
      currentCloudResource: 'Current Cloud Resource',
      runningStatus: 'Running Status',
      runningStatusDesc: 'Switch running or stop application space',
      tips: "Will be displayed on the application spaces index page, optional",
      tips2: "An introduction about the ApplicationSpace, optional",
      changeVisibility: "Change Space visibility",
      statusText: "The current Space is now",
      status: "Status",
      visibility: "ApplicationSpace visibility",
      del: "Delete ApplicationSpace",
      delTips: "This action",
      delTips2: "can be undone and will permanently delete",
      delTips3: "the application space repository and all its files.",
      privateVis: "Only creator or members of your organization can see",
      publicVis: "Anyone can see this application space",
      confirmDel: "I understand, delete this application space",
      privateInfo:
        ", only the creator or organization admin can make submissions",
      publicInfo: ", visible to anyone on the internet.",
      needName: "Please provide name first",
      needDesc: "Please provide description first",
    },
    download: "Download Space",
    downloadSpace: "Download space data",
    app: 'App',
    status: {
      noAppfile: 'Uninitialized',
      building: 'Building',
      deploying: 'Deploying',
      startup: 'Startup',
      running: 'Running',
      sleeping: 'Sleeping',
      stopped: 'Stopped',
      buildingFailed: 'Building Failed',
      deployFailed: 'Deploy Failed',
      runtimeError: 'Runtime Error'
    }
  },
  widgets: {
    onlineDemo: "Online Experience",
    testInput: "Test Input",
    testOutput: "Test Result",
    wordsNumber: "Word Count",
    runTest: "Run Test",
    timeCost: "More inference time"
  },
  models: {
    title: "Model",
    placeholder: "Models name",
    downloadModel: "Download model data",
    download: "Download Model",
    modelName: "Model name",
    datasetNameTips:
      "Applied to the model path, cannot be changed after creation",
    namespaceModelName: "Name space/Model name",
    modelNickName: "Model alias",
    modelDesc: "Model Profile",
    modelTag:"Model Tags",
    newModel: {
      title: "Create a new model repository",
      titleDesc: "The repository contains all model files and revision history",
      owner: "Owner",
      modelName: "Model name",
      modelNickName: "Model alias",
      modelDesc: "Model Profile",
      public: "Public",
      publicDesc:
        "Anyone on the internet can see this model. Only you (personal model) or members of your organization can commit.",
      private: "Private",
      privateDesc:
        "Only you (personal model) or members of your organization can see and commit to this model.",
      tips: "Once your model is created, you can upload your files using the web interface or git.",
      createModel: "Create Model",
      createSuccess: "Model created successfully",
    },
    edit: {
      tips: "Will be displayed on the model list page, optional",
      tips2: "An introduction about the model, optional",
      tips3: "Choose classification labels corresponding to the model to facilitate users in quickly finding your model during filtering.",
      changeVisibility: "Change model visibility",
      statusText: "The current model is now",
      status: "Status",
      modelVisibility: "Model visibility",
      delModel: "Delete model",
      delTips: "This action",
      delTips2: "can be undone and will permanently delete",
      delTips3: "the model repository and all its files.",
      privateVis: "Only creator or members of your organization can see",
      publicVis: "Anyone can see this model",
      confirmDel: "I understand, delete this model",
      privateInfo:
        ", only the creator or organization admin can make submissions",
      publicInfo: ", visible to anyone on the internet.",
      needModelName: "Please provide a model nickname first",
      needModelDesc: "Please provide a model description first",
      needModelTag: "Please provide a model tag first",
    },
  },
  comment: {
    sureDel: "Confirm to delete this comment?",
    createComment: "Add a comment",
  },
  datasets: {
    title: "Datasets",
    placeholder: "Datasets name",
    downloadDataset: "Download Dataset",
    datasetName: "Dataset Name",
    datasetNameTips:
      "Applied to the dataset path, cannot be changed after creation",
    namespaceDatasetName: "Namespace/Dataset Name",
    datasetNickName: "Dataset Nickname",
    datasetDesc: "Dataset Description",
    datasetTag: "Dataset Tags",
    newDataset: {
      title: "Create New Dataset Repository",
      titleDesc:
        "The repository contains all model files and revision history.",
      owner: "Owner",
      datasetName: "Dataset Name",
      datasetNickName: "Dataset Nickname",
      datasetDesc: "Dataset Description",
      public: "Public",
      publicDesc:
        "Anyone on the internet can see this repository. Only you (individual) or members of your organization can commit.",
      private: "Private",
      privateDesc:
        "Only you (individual) or members of your organization can view and commit to this repository.",
      tips: "After creating the model, you can use the web or Git to upload your files.",
      tips2:
        "Creating public datasets is currently not supported. Please contact the administrator for manual review if needed.",
      tips3:"Choose classification labels corresponding to the dataset to facilitate users in quickly finding your model during filtering.",
      createDataset: "Create Dataset",
      createSuccess: "Dataset created successfully",
    },
    edit: {
      tips: "Will be displayed on the dataset list page, optional",
      tips2: "An introduction about the dataset, optional",
      changeVisibility: "Change dataset visibility",
      statusText: "The current dataset is",
      status: "Status",
      datasetVisibility: "Dataset visibility",
      delDataset: "Delete dataset",
      delTips: "This operation",
      delTips2: "cannot be undone and will permanently delete",
      delTips3: "the dataset and all its files.",
      privateVis: "Only visible to the creator or organization members",
      publicVis: "Visible to anyone",
      confirmDel: "I understand and confirm deletion",
      privateInfo:
        ", only the creator or organization administrators can make submissions.",
      publicInfo: ", anyone on the internet can view this dataset.",
      needDatasetName: "Please provide a dataset alias first.",
      needDatasetDesc: "Please provide a dataset description first.",
    },
  },
  codes: {
    title: "Codes",
    placeholder: "Codes name",
    downloadCode: "Download Code",
    codeName: "Code Name",
    codeNameTips:
      "Applied to the code path, cannot be changed after creation",
    namespaceCodeName: "Namespace/Code Name",
    codeNickName: "Code Nickname",
    codeDesc: "Code Description",
    newCode: {
      title: "Create New Code Repository",
      titleDesc:
        "The repository contains all code files and revision history.",
      owner: "Owner",
      codeName: "Code Name",
      codeNickName: "Code Nickname",
      codeDesc: "Code Description",
      public: "Public",
      publicDesc:
        "Anyone on the internet can see this repository. Only you (individual) or members of your organization can commit.",
      private: "Private",
      privateDesc:
        "Only you (individual) or members of your organization can view and commit to this repository.",
      tips: "After creating the code, you can use the web or Git to upload your files.",
      createCode: "Create Code",
      createSuccess: "Code Repository created successfully",
    },
  },
  organization: {
    orgSetting: "Organization Settings",
    orgInfo: "Organization Information",
    orgNameSpace: "Organization Namespace",
    orgSpaceTips: "Once created, the namespace cannot be changed.",
    orgNickName: "Organization Nickname",
    orgAvatar: "Organization Avatar",
    orgType: "Organization Type",
    orgHomepage: "Organization Homepage",
    orgTeam: "Team Members",
    model: "Model",
    dataset: "Dataset",
    space: "Space",
    code: "Code",
    invite: {
      title: "Invite",
      inviteNew: "Invite New Member",
      inviteDesc: "You are inviting a new member to the organization",
      addSuccess: "Member added successfully",
    },
    newOrganization: {
      title: "Create New Organization",
      createOrg: "Create Organization",
      createSuccess: "Organization created successfully",
      inputSpaceNamePls: "Please enter the organization namespace",
    },
    edit: {
      updateSuccess: "organization updated successfully",
    },
  },
  navbar: {
    models: "Models",
    datasets: "Datasets",
    spaces: "Spaces",
    codes: "Codes",
    profile: "Profile",
    editProfile: "Account Settings",
    newModel: "New Model",
    newDataset: "New Dataset",
    newCode: "New Code",
    newApplicationSpace: "New Application Space",
    newOrganization: "New Organization",
    logout: "Logout",
    loginRegister: "Login/Registe",
    login: "Login",
  },
  all: {
    defaultText:
      "```\nREADME file is empty, please download the file and add description content.\n```",
    tip: "tip",
    summary: "Summary",
    files: "Files",
    community: "Community",
    settings: "Settings",
    tasks: "Tasks",
    framework: "Framework",
    others: "Others",
    contributors: "Contributors",
    historyCommits: "History commits",
    addFile: "Add file",
    fileName: "File name",
    filterTags: "Filter tags",
    provideMoreDesc: "Provide more description",
    submitNewFile: "Submit new file",
    submitChange: "Submit changes",
    createNewFile: "Create new file",
    createFile: "Create File",
    uploadFile: "Upload file",
    loadError: "Load Error",
    notSupportPreview:
      "Preview is not supported at the moment, please download via git clone",
    changeVis: "Change visibility to",
    enterPls: "Enter Please",
    sureDel: "Sure to Del",
    canNot: "Cannot",
    role: "Role",
    userName: "Username",
    nickName: "Nickname",
    phone: "Phone Number",
    email: "Email",
    confirm: "Confirm",
    cancel: "Cancel",
    add: "Add",
    update: "Update",
    changeSuccess: "Switch successful",
    changeCancel: "Operation canceled",
    addSuccess: "Added successfully",
    delSuccess: "Del successfully",
    lastTime: "Last Updated",
    downloadCount: "Download",
    public: "Public",
    private: "Private",
    recentlyUpdate: "Recently Update",
    trending: "Trending",
    mostDownload: "Most Download",
    mostFavorite: "Most Favorite",
    noData: "No Data",
    save: "Save",
    remove: "Remove",
    saveSetting: "Save Setting",
    toBeUploaded: "to be uploaded",
    upLoadSuccess: "Upload successful",
    upLoadError: "Upload error",
    clickUpload: "Click Upload",
    uploadAvatar: "Upload Avatar",
    uploadPic1Mb: "Please upload image files not exceeding 1MB.",
    select: "Select",
    selectFilePls: "Please select a file",
    fileTooLarge: "File size is too large",
    inputPls: "Please enter",
    inputNickNamePlc: "Enter nickname",
    inputDescPlc: "Enter description",
    lfsTips:
      "Before downloading, please make sure you have installed git-lfs (https://git-lfs.com).",
    lfsTips2:
      "If you do not want to download the content of LFS files, please add it to the environment variables.",
  },
  community: {
    discussion: {
      back: "Back to topic list",
      new: "New topic",
    },
    discussionDetail: {
      reply: "Reply",
      comment: "Comment",
      cancel: "Cancel",
      updateSuccess: "Title update successfully!",
      warn: "Content cannot be empty",
      addSuccess: "Add comment successfully",
    },
    MD: {
      edit: "Edit",
      preview: "Preview",
      desc: "Upload pictures, audio, video, or by dragging and dropping ",
      click: "Click here to upload",
      default: "Leave a comment",
    },
    newDiscussion: {
      new: "New topic",
      title: "Title",
      content: "Content",
      create: "Create a topic",
      cancel: "Cancel",
      warn: "Content cannot be empty",
      success: "Create topic successfully!",
    },
    empty: {
      welcome: "Welcome to discuss ",
      desc: "This is the place to discuss and collaborate with OpenCSG!",
      new: "New topic ",
    },
  },
  profile: {
    editProfile: "Edit Profile",
    settings: "Settings",
    interests: "Interests",
    organization: "Organization",
    menu: {
      profile: "Profile",
      accountInformation: "Account Information",
      accessToken: "Access Token",
      gitToken: "Git Token",
      sshKey: "SSH Keys",
      billing: "Billing",
    },
    edit: {
      title: "Profile Edit",
      uploadAvatar: "Upload Avatar",
      removeAvatar: "Remove Avatar",
      updateSuccess: "Profile updated successfully",
    },
  },
  gitToken: {
    title: "User Git Token",
    desc: "Git Token is used to authorize you to perform Git-related operations",
    refresh: "Refresh Git Token",
    refreshWarning:
      "After refreshing, the existing Git Token will become invalid. Are you sure you want to continue?",
    confirm: "Continue",
    cancelInfo: "Operation cancelled",
  },
  sshKey: {
    addSshKey: "Add SSH Key",
    noKeyTips: "There are currently no SSH keys added to your account",
    sshKeyName: "SSH Key Name",
    sshKeyContent: "SSH Key Content",
    nameWarning: "Please enter the SSH Key Name",
    contentWarning: "Please enter the SSH Key Content",
    sureDelKey:
      "Are you sure you want to delete this key from your account? This action cannot be undone.",
    delKeyName: "Delete Key 'key name'",
  },
  shared: {
    commitToMain: "Commit directly to the main branch",
    dragOr: "Drag and drop files here or",
    onlyOneFile: "Only support one file",
    uploadFile5Mb: "Support uploading files up to 5MB in size",
    lfs1: "This file is stored with",
    lfs2: "Git LFS",
    lfs3: ". It's too big to display, but you can still",
    lfs4: "download",
    lfs5: "it.",
    lfs6: "Git LFS Details",
    lfs7: "Pointer size",
    lfs8: "Size of remote file",
    lfs9: "Raw pointer file",
    lfs10: "Git Large File Storage (LFS) replaces large files with text pointers inside Git, while storing the file contents on a remote server.",
    lfs11: "More info",
    preview: "Preview",
    edit: "Edit",
  },
  repo: {
    edit: {
      fileName: "File Name",
      main: "Directly submit to the main branch",
      submit: "Submit Update",
      desc: "Provide more description",
      update: "Update file",
      cancel: "Cancel",
    }
  }
};
