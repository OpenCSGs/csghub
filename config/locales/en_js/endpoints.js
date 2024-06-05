export const endpoints = {
  title: "Inference Endpoint",
  resourceType: 'Resource Type',
  replica: "Replica",
  summary: 'Summary',
  detail: {
    endpointUrl: 'Inference Endpoint URL',
    modelId: 'Model ID',
    parameters: 'Parameters',
    currentEndpointReplica: 'Endpoint Replica',
    cloudResource: 'Cloud Resource',
    endpointStatus: 'Endpoint Status'
  },
  new: {
    title: "Create a new endpoint",
    desc: "Deploy your model to an endpoint",
    name: "Endpoint name",
    modelId: "Model ID",
    modelIdTip: "Please enter Model ID",
    minReplica: "Minimum number of replicas",
    maxReplica: "Maximum number of replicas",
    resource: "Resource configuration",
    resourceTip1: "You can switch to different cloud resources at any time.",
    resourceTip2: "After switching to paid resources, you will be charged based on the length of use.",
    framework: "Framework",
    cluster: "Region",
    public: "Public",
    publicDesc: "Anyone on the internet can see this endpoint.",
    private: "Private",
    privateDesc: "Only you (personal) or members of your organization can see this endpoint.",
    createEndpoint: "Create Endpoint",
    createSuccess: "Endpoint created successfully",
    dedicated: "Dedicated endpoint"
  },
  settings: {
    stop: "Stop",
    restart: "Restart",
    restartEndpoint: "Restart Endpoint",
    stopEndpoint: "Stop Endpoint",
    delete: "Delete",
    deleteEndpoint: "Delete Endpoint",
    delTips: "This operation",
    delTips2: "Undo, this will permanently delete",
    delTips3: "the endpoint and all its files.",
    confirmDel: "I understand and confirm deletion",
    namespaceName: "Endpoint Name/ID",
    toggleStatusSuccess: 'Updated, please wait Endpoint status change'
  }
}