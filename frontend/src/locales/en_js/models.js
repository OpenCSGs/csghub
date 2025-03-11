import { emptyProps } from "element-plus";
import { evaluation } from "./evaluation";

export const models = {
  title: "Models",
  placeholder: "Search Models",
  downloadModel: "Download model data",
  download: "Download Model",
  modelName: "Model name",
  modelNameTips:
    "Applied to the model path, cannot be changed after creation",
  namespaceModelName: "Name space",
  modelNickName: "Model alias",
  modelDesc: "Model description",
  modelTag: "Model tags",
  modelIndustryTag: "Industry tags",
  tips:" Creating and Uploading Model Files",
  modelsUsedToTrain: "Model used to train",
  index: {
    allFilter: "all models",
    inferenceFilter: "support inference",
    finetuneFilter: "support finetune",
    evaluationFilter: "support evaluation",
    serverlessFilter: "Serverless API"
  },
  newModel: {
    title: "Create a new model repository",
    titleDesc: "The repository contains all model files and revision history",
    owner: "Owner",
    modelName: "Model name",
    modelNickName: "Model alias",
    license: "License",
    modelDesc: "Model description",
    public: "Public",
    publicDesc:
      "Anyone on the internet can see this model. Only you (personal model) or members of your organization can commit.",
    private: "Private",
    privateDesc:
      "Only you (personal model) or members of your organization can see and commit to this model.",
    tips: "Once your model is created, you can upload your files using the web interface or git.",
    createModel: "Create Model",
    createSuccess: "Model created successfully",
    tip: "Applies to model data and cannot be changed after creation",
    createFail: "Model creation failed",
    modelEnName: "Model name",
  },
  edit: {
    tips: "Will be displayed on the model list page, optional",
    tips2: "An introduction about the model, optional",
    tips3: "Select industry labels, users can filter models by labels",
    changeVisibility: "Change model visibility",
    statusText: "The current model is now",
    status: "Status.",
    modelVisibility: "Model visibility",
    delModel: "Delete model",
    delTips: "This action",
    canNot: "cannot",
    delTips2: "be undone and will permanently delete the model repository",
    delTips3: "and all its files.",
    privateVis: "Only creator or members of your organization can see",
    publicVis: "Anyone can see this model",
    confirmDel: "I understand and confirm deletion",
    privateInfo: ", only the creator or organization admin can make submissions",
    publicInfo: ", visible to anyone on the internet.",
    needModelName: "Please provide a model nickname first",
    needModelDesc: "Please provide a model description first",
    needModelTag: "Please provide a model tag first",
  },
  emptyModels: {
    title: "Enrich the model with multi-source synchronization capabilities",
    desc: "Multi-source synchronization can synchronize high-quality models from OpenCSG open source community and Huggingface to the project",
    uploadBtn: "Upload Local Model",
    multisyncBtn: "Open Multi-Sync"
  }
}