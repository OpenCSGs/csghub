/**
 * 子任务展示名：按 task_type + task_name（技术名）映射到 dataPipelines 国际化文案。
 * 采集任务示例：数据采集-MySQL、数据采集-MongoDB、数据上传
 */
const HARVESTING_NAME_KEYS = {
  mysql: "subtaskHarvestingMysql",
  mongo: "subtaskHarvestingMongodb",
  mongodb: "subtaskHarvestingMongodb",
  hive: "subtaskHarvestingHive",
  file: "subtaskHarvestingFile",
};

const TASK_TYPE_KEYS = {
  upload_data: "subtaskUploadData",
  pull_data: "subtaskPullData",
  data_harvesting: null,
  format_conversion: "subtaskFormatConversion",
  tool_execute: "subtaskToolExecute",
  operator_execute: "subtaskOperatorExecute",
};

/** 按 task_name 兜底（部分记录 task_type 为空） */
const TASK_NAME_KEYS = {
  upload_data: "subtaskUploadData",
  pull_data: "subtaskPullData",
};

/**
 * @param {object} row 子任务行（含 task_type、task_name）
 * @param {(key: string) => string} t vue-i18n 的 t，键为 dataPipelines.xxx
 */
export function resolveSubtaskDisplayName(row, t) {
  if (!row) return "-";
  const taskType = String(row.task_type || "").toLowerCase();
  const taskName = String(row.task_name || "").toLowerCase();

  if (taskType === "data_harvesting") {
    const harvestingKey = HARVESTING_NAME_KEYS[taskName];
    if (harvestingKey) {
      return t(`dataPipelines.${harvestingKey}`);
    }
  }

  const nameKey = TASK_NAME_KEYS[taskName];
  if (nameKey) {
    return t(`dataPipelines.${nameKey}`);
  }

  if (taskType === "upload_data" || taskName === "upload_data") {
    return t("dataPipelines.subtaskUploadData");
  }
  if (taskType === "pull_data" || taskName === "pull_data") {
    return t("dataPipelines.subtaskPullData");
  }

  if (taskType === "format_conversion" && taskName.startsWith("format_conversion_")) {
    const raw = taskName.replace(/^format_conversion_/, "");
    const [fromPart, toPart] = raw.split("2");
    if (fromPart && toPart) {
      return t("dataPipelines.subtaskFormatConversionFromTo", {
        from: fromPart.toUpperCase(),
        to: toPart.toUpperCase(),
      });
    }
  }

  const typeKey = TASK_TYPE_KEYS[taskType];
  if (typeKey) {
    return t(`dataPipelines.${typeKey}`);
  }

  if (taskName && taskType) {
    const label = taskName.charAt(0).toUpperCase() + taskName.slice(1);
    return `${t("dataPipelines.dataAcquisition")}-${label}`;
  }

  return row.task_name || row.task_type || "-";
}

/** 子任务 status 字段 → dataPipelines 国际化键（与主任务 Queued/Finished 等同命名空间） */
const SUBTASK_STATUS_I18N_KEY = {
  pending: "Pending",
  waiting: "Waiting",
  wainting: "Waiting",
  queued: "Queued",
  running: "Running",
  processing: "Processing",
  in_progress: "Running",
  executing: "Running",
  finished: "Finished",
  completed: "Finished",
  complete: "Finished",
  succeeded: "Finished",
  success: "Finished",
  failed: "Failed",
  failure: "Failed",
  error: "Failed",
  stopped: "Stopped",
  canceled: "Canceled",
  cancelled: "Canceled",
  timeout: "Timeout",
};

/**
 * @param {string|null|undefined} status 子任务 status 原始值（如 Pending、Running）
 * @param {(key: string) => string} t vue-i18n 的 t
 */
export function resolveSubtaskStatusLabel(status, t) {
  if (status === null || status === undefined || String(status).trim() === "") {
    return "-";
  }
  const raw = String(status).trim();
  const i18nKey = SUBTASK_STATUS_I18N_KEY[raw.toLowerCase()] || raw;
  const label = t(`dataPipelines.${i18nKey}`);
  if (label === `dataPipelines.${i18nKey}`) {
    return raw;
  }
  return label;
}
