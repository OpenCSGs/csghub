export const notebooks = {   
  title: "Notebook",
  useNotebook: "Use Notebook",
  startNotebook: 'Start Notebook',
  loading: 'Loading Notebook information...',
  new: {
    title: "Create Notebook",
    desc: "Interactive Notebook, easily run models",
    name: "Notebook Name",
    tip: "Naming Rules:",
    cluster: "Cluster",
    resource: "Resource",
    resourceTip1: "Different hardware resources are available, you can choose based on your needs",
    resourceTip2: "Billing: Charged based on actual usage time, no charge when not in use",
    minReplicas: "Min Elastic Replicas",
    maxReplicas: "Max Elastic Replicas",
    autoSleepTip: "Setting min replica to 0 enables auto sleep",
    maxReplicaFixedTip: "Max replica is fixed at 1, cannot be modified",
    runtimeFramework: "Pre-installed Image",
    cancel: "Cancel",
    create: "Create Notebook",
    createSuccess: "Successfully Created"
  },
  settings: {
    stop: "Stop",
    restart: "Restart",
    restartNotebook: "Restart Notebook",
    stopNotebook: "Stop Notebook",
    delete: "Delete",
    deleteNotebook: "Delete Notebook",
    delTips: "This action",
    delTips2: "be undone, it will permanently delete",
    delTips3: "Notebook.",
    confirmDel: "I understand, confirm delete",
    namespaceName: "Notebook Name/ID",
    toggleStatusSuccess: 'Update successful, please wait for instance status to change',
    resource: "Resource Configuration",
    resourceTip: "You can switch to different resource configurations in the instance settings at any time. After switching to a paid resource, you will be charged based on usage time.",
    currentCloudResource: 'Current Cloud Resource',
    framework: "Runtime Framework",
    currentFramework: 'Current Runtime Framework',
    maxReplica: "Maximum Elastic Replicas",
    minReplica: "Minimum Elastic Replicas",
    currentMaxReplica: "Current Maximum Elastic Replicas",
    currentMinReplica: "Current Minimum Elastic Replicas"
  },
  error: {
    getRuntimeFrameworkFailed: 'Failed to get runtime framework:',
    createNotebookFailed: 'Failed to create Notebook:',
    createFailedRetry: 'Creation failed, please try again'
  },
  resources: {
    gpuResource: 'GPU Resource',
    cpuResource: 'CPU Resource',
    otherResource: 'Other Resource'
  }
}