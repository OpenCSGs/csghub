export const finetune = {
  title: 'Finetune Instance',
  new: {
    title: 'Create Finetune Instance',
    desc: 'Deploy your model on dedicated computing power instance,',
    guide: 'View Finetune Guide',
    name: 'Instance Name',
    nameTip:'Please enter the Instance Name',
    modelId: 'Model ID',
    modelIdTip: 'Please enter the Model ID',
    framework: 'Runtime Framework',
    cluster: 'Region',
    clusterTip: 'Please select a region',
    clusterDec1: 'It is recommended to choose the region closest to your customers to reduce access latency;',
    clusterDec2: 'Region cannot be changed after creation.',
    resource: 'Resource Configuration',
    resourceTip: 'Please select resource configuration',
    resourceDec1: 'You can switch to different cloud resources within the space settings at any time',
    resourceDec2: 'Switching to paid resources will incur charges based on the usage duration',
    createFinetune: 'Create Instance',
    createSuccess: 'Instance created successfully',
    tip: "Applied to the fine-tuning instance, cannot be changed after creation",
    createFail: "Failed to create the fine-tuning instance"
  },
  detail: {
    notebook: 'Start Notebook',
    tab1: 'Overview',
    tab2: 'Settings',
    tab3: 'Analysis',
    noDataTip1:'The fine-tuning instance is not running',
    noDataTip2:'Please wait for the deployment to succeed or go to the settings page to enable running state before trying to access the fine-tuning interface.',
    settings: {
      region: 'Region',
      regionTip1: 'It is recommended to choose the region closest to you to reduce access latency;',
      regionTip2: 'Region cannot be changed after creation.',
      regionTip3: 'Instance Region',
      resources: 'Space Cloud Resources',
      resourcesTip1: 'You can switch to different fine-tune instance cloud resources.',
      resourcesTip2: 'Switching to paid resources will incur charges based on the usage duration.',
      resourcesTip3: 'Current Cloud Resources',
      status: 'Running Status',
      statusTip1: 'Toggle running or pausing the fine-tune instance',
      statusVal1: 'Running',
      statusVal2: 'Stopped',
      enName: 'English Name',
      enNameTip1: 'Used for the application space path, cannot be changed after creation',
      cnName: 'Chinese Name',
      cnNameTip1: 'Will be displayed in the instance list page, optional',
      delete: 'Delete',
      deleteTip1: 'This action cannot be undone. This will permanently delete',
      deleteTip2: 'the fine-tune model.',
      finetuneName: 'Finetune Instance Name'
    }
  },
  settings: {
    fetchBillingError: 'Failed to obtain billing information'
  }
}