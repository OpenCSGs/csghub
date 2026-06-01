/**
 * 将表单中的区域/云资源字段对齐 DataFlow 后端（resource_id，非 space_resource_id）。
 */
export function normalizeSpaceResourcePayload(form) {
  if (!form || typeof form !== "object") return {};
  const resourceId =
    form.resource_id != null && form.resource_id !== ""
      ? form.resource_id
      : form.space_resource_id;
  const payload = { ...form };
  if (resourceId != null && resourceId !== "") {
    payload.resource_id = resourceId;
  }
  delete payload.space_resource_id;
  return payload;
}

function pickString(obj, ...keys) {
  for (const k of keys) {
    const v = obj?.[k];
    if (v != null && v !== "") return String(v);
  }
  return "";
}

/** 统一 cluster 接口字段：cluster_id、region */
export function normalizeClusterRow(c) {
  if (!c || typeof c !== "object") return null;
  const cluster_id = c.cluster_id ?? c.id ?? c.ID ?? c.ClusterID;
  const region = pickString(c, "region", "Region", "cluster_name", "name", "Name");
  return { ...c, cluster_id, region };
}

/** 统一 space_resources 接口字段：id、name、cluster_region */
export function normalizeSpaceResourceRow(r) {
  if (!r || typeof r !== "object") return null;
  const id = r.id ?? r.ID;
  const name = pickString(r, "name", "Name");
  const cluster_region = pickString(r, "cluster_region", "ClusterRegion");
  return { ...r, id, name, cluster_region };
}

/**
 * 根据已选 cluster_id / resource_id 从接口列表解析展示名（提交落库用）。
 * cluster_name ← /cluster 的 region（或资源行上的 cluster_region）
 * resource_name ← /space_resources 的 name
 */
export function resolveSpaceResourceNames(form, clusters = [], resources = []) {
  const clusterId = form?.cluster_id;
  const resourceId = form?.resource_id ?? form?.space_resource_id;
  const rawC = (clusters || []).find(
    (x) =>
      String(x?.cluster_id ?? x?.id ?? x?.ID ?? x?.ClusterID) ===
      String(clusterId)
  );
  const rawR = (resources || []).find(
    (x) => String(x?.id ?? x?.ID) === String(resourceId)
  );
  const c = normalizeClusterRow(rawC);
  const r = normalizeSpaceResourceRow(rawR);
  return {
    cluster_name:
      c?.region ||
      r?.cluster_region ||
      form?.cluster_name ||
      "",
    resource_name: r?.name || form?.resource_name || "",
  };
}
