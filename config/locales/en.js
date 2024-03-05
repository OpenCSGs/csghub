export default {
  rule: {
    nameRule:
      "* Must be a string of 2-20 characters including letters, numbers, and _ - (hyphen and underscore) without consecutive occurrences of - or _",
    nameSpaceRule:
      "A string composed of 2-20 alphanumeric characters and underscores _",
  },
  models: {
    title: "Models",
    placeholder: "Models name",
    downloadModel: "Download Model",
    download: "Download Model",
    modelName: "Model name",
    datasetNameTips:
      "Applied to the model path, cannot be changed after creation",
    namespaceModelName: "Namespace/Model name",
    modelNickName: "Model nickname",
    modelDesc: "Model description",
    newModel: {
      title: "Create Model Repository",
      titleDesc: "The repository contains all model files and revision history",
      owner: "Owner",
      modelName: "Model Name",
      modelNickName: "Model Nickname",
      modelDesc: "Model Description",
      public: "Public",
      publicDesc:
        "Anyone on the internet can see this repository. Only you (individual) or members of your organization can contribute.",
      private: "Private",
      privateDesc:
        "Only you (individual) or members of your organization can see and contribute to this repository.",
      tips: "After creating the model, you can upload your files using the web or Git.",
      createModel: "Create Model",
      createSuccess: "Model created successfully",
    },
    edit: {
      tips: "Will be displayed on the model list page, optional",
      tips2: "An introduction about the model, optional",
      changeVisibility: "Change model visibility",
      statusText: "The current model is currently",
      status: "Status",
      modelVisibility: "Model visibility",
      delModel: "Delete model",
      delTips: "This operation",
      delTips2: "can be undone and will permanently delete",
      delTips3: "the model repository and all its files.",
      privateVis: "Only visible to the creator or organization members",
      publicVis: "Visible to anyone",
      confirmDel: "I understand and confirm the deletion",
      privateInfo:
        ", only the creator or organization admin can make submissions",
      publicInfo: ", visible to anyone on the internet.",
      needModelName: "Please provide a model nickname first",
      needModelDesc: "Please provide a model description first",
    },
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
    profile: "Profile",
    editProfile: "Account Settings",
    newModel: "New Model",
    newDataset: "New Dataset",
    newOrganization: "New Organization",
    logout: "Logout",
    loginRegister: "Login/Registe",
    login: "Login",
  },
  all: {
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
    userName: "UserName",
    nickName: "Nickname",
    phone: "Phone Number",
    email: "Email",
    confirm: "Confirm",
    cancel: "Cancel",
    add: "Add",
    upDate: "Update",
    changeSuccess: "Switch successful",
    changeCancel: "Operation canceled",
    addSuccess: "Added successfully",
    delSuccess: "Del successfully",
    lastTime: "Last Updated",
    downloadCount: "Download Count",
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
    cloneTips:
      "Before downloading, please make sure you have installed git-lfs (https://git-lfs.com).",
    cloneTips2:
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
      updateSuccess: "Title update successful!",
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
    },
    empty: {
      wellcome: "Welcome to discuss ",
      decs: "This is the place to discuss and collaborate with OpenCSG!",
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
  },
  shared: {
    commitToMain: "Commit directly to the main branch",
    dragOr: "Drag and drop files here or",
    onlyOneFile: "Only support one file",
    uploadFile5Mb: "Support uploading files up to 5MB in size",
  },
};
