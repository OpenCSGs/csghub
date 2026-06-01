import { fetchEventSource } from "@microsoft/fetch-event-source";

/**
 * CSGHub DataFlow 平台日志 SSE：
 * event:Container  data:aa159-xxx | 2026-05-26 ...  → 展示 aa159-xxx | 2026-05-26 ...
 * event:Heartbeat  data:keep-alive  （忽略）
 */

export function buildCsghubDataflowLogsUrl(
  csghubServer,
  { namespaceUuid, jobId, dagTaskId, stream = true }
) {
  const server = String(csghubServer || CSGHUB_SERVER || "").replace(/\/$/, "");
  if (!server || !namespaceUuid || !jobId) {
    throw new Error("缺少 CSGHub 日志参数: csghubServer / namespace / job_id");
  }
  const params = new URLSearchParams();
  if (stream) {
    params.set("stream", "true");
  }
  if (dagTaskId) {
    params.set("dag_task_id", String(dagTaskId));
  }
  const base = `${String(server).replace(/\/$/, "")}/api/v1/platform/dataflow/${encodeURIComponent(
    namespaceUuid
  )}/jobs/${encodeURIComponent(jobId)}/logs`;
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/** 原始 payload 是否包含换行（\\n / \\r / \\r\\n 或真实 \\n / \\r / \\r\\n） */
export function payloadHasNewline(raw) {
  const s = String(raw ?? "");
  return (
    /\\r\\n|\\n|\\r/.test(s) ||
    s.includes("\r\n") ||
    s.includes("\n") ||
    s.includes("\r")
  );
}

/** 将字面量转义与真实 CRLF/LF/CR 统一为 \\n */
export function normalizePayloadLineBreaks(raw) {
  return String(raw ?? "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

/** CSGHub 容器/job 前缀，如 aa160-3076901533（区别于 tqdm 里的 0%| |） */
const CSGHUB_LOG_JOB_PREFIX_RE = /^[a-zA-Z0-9]+-\d+$/;

function stripDataPrefix(segment) {
  let line = String(segment ?? "").trimEnd();
  if (line.startsWith("data:")) {
    line = line.slice(5).trimStart();
  }
  return line;
}

/**
 * 仅当 | 前为 job 前缀时才拆分；否则整行视为日志正文（可能含 tqdm 的 |）。
 */
function parseCsghubLogLine(line) {
  const text = String(line ?? "");
  const pipeIdx = text.indexOf("|");
  if (pipeIdx < 0) {
    return { jobPrefix: null, content: text.trim() };
  }
  const candidate = text.slice(0, pipeIdx).trim();
  if (CSGHUB_LOG_JOB_PREFIX_RE.test(candidate)) {
    return {
      jobPrefix: candidate,
      content: text.slice(pipeIdx + 1).trimStart(),
    };
  }
  return { jobPrefix: null, content: text.trim() };
}

/** 从一行中提取 job 前缀（忽略 tqdm 等行内 |） */
function extractJobPrefixFromLine(segment) {
  const { jobPrefix } = parseCsghubLogLine(stripDataPrefix(segment));
  return jobPrefix;
}

function joinJobPrefixAndContent(jobPrefix, content) {
  const prefix = String(jobPrefix ?? "").trim();
  const body = String(content ?? "").trim();
  if (!prefix) {
    return body || null;
  }
  return body ? `${prefix} | ${body}` : `${prefix} |`;
}

/**
 * 格式化为：job_id-XXXX | 日志内容
 * 无 job 前缀的行（含仅含 tqdm | 的行）拼接 carriedPrefix。
 */
function formatOneLogSegment(segment, carriedPrefix = null) {
  const line = stripDataPrefix(segment);
  if (!line.trim()) {
    return null;
  }

  const { jobPrefix, content } = parseCsghubLogLine(line);
  if (jobPrefix) {
    return joinJobPrefixAndContent(jobPrefix, content);
  }

  const prefix = carriedPrefix?.trim();
  if (prefix) {
    return joinJobPrefixAndContent(prefix, line.trim());
  }
  return line.trim();
}

/**
 * 仅当 payload 含换行符时按行拆分；否则整段作为一行。
 * @returns {{ lines: string[], carriedPrefix: string|null }}
 */
export function formatCsghubSseLogData(rawData, initialCarriedPrefix = null) {
  const raw = String(rawData ?? "");
  if (!raw.trim() || raw.trim() === "keep-alive") {
    return { lines: [], carriedPrefix: initialCarriedPrefix || null };
  }

  let carriedPrefix = initialCarriedPrefix || null;

  if (!payloadHasNewline(raw)) {
    const segmentPrefix = extractJobPrefixFromLine(raw);
    const workingPrefix = segmentPrefix || carriedPrefix;
    const one = formatOneLogSegment(raw, workingPrefix);
    if (segmentPrefix) {
      carriedPrefix = segmentPrefix;
    }
    return {
      lines: one ? [one] : [],
      carriedPrefix,
    };
  }

  const text = normalizePayloadLineBreaks(raw);
  const lines = [];
  text.split("\n").forEach((segment) => {
    const segmentPrefix = extractJobPrefixFromLine(segment);
    if (segmentPrefix) {
      carriedPrefix = segmentPrefix;
    }
    const formatted = formatOneLogSegment(segment, carriedPrefix);
    if (formatted) {
      lines.push(formatted);
    }
  });
  return { lines, carriedPrefix };
}

function shouldSkipSseEvent(eventType, data) {
  const type = String(eventType || "").trim().toLowerCase();
  if (type === "heartbeat") {
    return true;
  }
  const payload = String(data ?? "").trim();
  if (payload === "keep-alive" || payload === "[DONE]") {
    return true;
  }
  return false;
}

function streamSseLogs(url, headers, { onLine, signal }) {
  let carriedPrefix = null;
  return new Promise((resolve, reject) => {
    fetchEventSource(url, {
      openWhenHidden: true,
      headers,
      signal,
      async onopen(response) {
        if (!response.ok) {
          const body = await response.text().catch(() => "");
          throw new Error(body || `CSGHub logs HTTP ${response.status}`);
        }
      },
      onmessage(event) {
        if (shouldSkipSseEvent(event.event, event.data)) {
          return;
        }
        const eventType = String(event.event || "").trim().toLowerCase();
        if (eventType && eventType !== "container") {
          return;
        }
        const { lines: formattedLines, carriedPrefix: nextPrefix } =
          formatCsghubSseLogData(event.data, carriedPrefix);
        carriedPrefix = nextPrefix;
        const appendToPrevious = !payloadHasNewline(event.data);
        formattedLines.forEach((line, index) => {
          onLine(line, { append: appendToPrevious && index === 0 });
        });
      },
      onclose() {
        resolve();
      },
      onerror(err) {
        reject(err);
        throw err;
      },
    }).catch(reject);
  });
}

/**
 * 流式拉取 CSGHub DataFlow 日志（SSE），按行回调 onLine。
 */
export async function streamCsghubDataflowLogs(
  url,
  { authorization, userToken, onLine, signal } = {}
) {
  const headers = {
    Accept: "text/event-stream",
  };
  if (authorization) {
    headers.Authorization = authorization;
  }
  if (userToken) {
    headers["User-Token"] = userToken;
  }

  await streamSseLogs(url, headers, { onLine, signal });
}

/** 从任务列表行解析 CSGHub 日志参数（与后端 resolve_csghub_remote_job_id 优先级接近） */
export function resolveCsghubLogParamsFromTask(task) {
  const namespaceUuid = String(task?.namespace_uuid ?? "").trim();
  const jobId = String(
    task?.csghub_remote_job_id || task?.csghub_job_id || task?.flow_id || ""
  ).trim();
  return { namespaceUuid, jobId };
}

/** 描述缺失的 CSGHub 日志字段，便于排查 */
export function describeCsghubLogParamsGap({ namespaceUuid, jobId }) {
  const parts = [];
  if (!namespaceUuid) parts.push("namespace_uuid（任务所属 namespace）");
  if (!jobId) parts.push("csghub_job_id / flow_id（CSGHub 任务 ID）");
  return parts;
}
