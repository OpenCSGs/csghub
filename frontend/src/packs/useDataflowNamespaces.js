import { ref, computed } from "vue";
import useFetchApi from "@/packs/useFetchApi";
import { normalizeSpaceResourcePayload } from "@/packs/spaceResourcePayload.js";
import { resolveStorageSizePayload } from "@/packs/storageSize.js";

export const NAMESPACE_TYPE_PERSONAL = "personal";
export const NAMESPACE_TYPE_ORGANIZATION = "organization";

/**
 * 规范化 CSGHub /user/{username} 返回的 namespace 项。
 * 支持 Path/Type/UUID（Go 默认）与 path/type/uuid。
 */
export function normalizeNamespaceItem(item) {
  if (!item || typeof item !== "object") return null;
  const type = String(item.Type ?? item.type ?? "")
    .trim()
    .toLowerCase();
  const uuid = String(item.UUID ?? item.uuid ?? "").trim();
  const path = String(item.Path ?? item.path ?? "").trim();
  if (!uuid || !path) return null;
  return {
    path,
    type,
    uuid,
    avatar: item.Avatar ?? item.avatar ?? "",
    nsType: item.NSType ?? item.nsType ?? "",
  };
}

export function parseNamespacesFromUserResponse(body) {
  const root = body?.data ?? body ?? {};
  const rawList = root.namespaces ?? root.Namespaces ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeNamespaceItem).filter(Boolean);
}

/**
 * 从 CSGHub /user/{username} 返回的 orgs 字段中提取组织 namespace。
 * 只保留 role 为 write 或 admin 的组织。
 */
export function parseOrgsFromUserResponse(body) {
  const root = body?.data ?? body ?? {};
  const rawOrgs = root.orgs ?? root.Orgs ?? [];
  if (!Array.isArray(rawOrgs)) return [];
  return rawOrgs
    .filter((org) => {
      const role = String(org.role ?? "").trim().toLowerCase();
      return role === "write" || role === "admin";
    })
    .map((org) => {
      const uuid = String(org.uuid ?? "").trim();
      const path = String(org.path ?? "").trim();
      if (!uuid || !path) return null;
      return {
        path,
        type: "organization",
        uuid,
        avatar: org.avatar ?? "",
        nsType: org.nsType ?? org.ns_type ?? "",
      };
    })
    .filter(Boolean);
}

/** 从 ref 或 reactive 取出表单对象 */
export function unwrapFormRef(formRef) {
  if (formRef == null) return null;
  return formRef?.value ?? formRef;
}

function resolveNamespaceType(rawType) {
  const t = String(rawType ?? NAMESPACE_TYPE_PERSONAL).trim().toLowerCase();
  return t === NAMESPACE_TYPE_ORGANIZATION
    ? NAMESPACE_TYPE_ORGANIZATION
    : NAMESPACE_TYPE_PERSONAL;
}

/** 判断 uuid 是否属于组织 namespace 列表（而非个人 user namespace） */
export function isValidOrganizationNamespaceUuid(uuid, organizationOptions = []) {
  const id = String(uuid ?? "").trim();
  if (!id) return false;
  return (organizationOptions ?? []).some((o) => o.id === id);
}

/**
 * 从表单字段生成 DataFlow 后端所需的 namespace 参数。
 */
export function resolveNamespacePayload(form) {
  const raw = unwrapFormRef(form);
  const namespaceUuid = String(raw?.namespace_uuid ?? "").trim();
  const namespaceType = resolveNamespaceType(raw?.namespace_type);
  return {
    namespace_uuid: namespaceUuid || undefined,
    namespace_type: namespaceType,
  };
}

/**
 * 校验任务归属（个人 / 组织）与 namespace_uuid。
 */
export function validateNamespaceSelection(form, t) {
  const raw = unwrapFormRef(form);
  const namespaceType = resolveNamespaceType(raw?.namespace_type);
  const uuid = String(raw?.namespace_uuid ?? "").trim();

  if (!uuid) {
    if (namespaceType === NAMESPACE_TYPE_ORGANIZATION) {
      return { ok: false, message: t("dataPipelines.pleaseSelectOrganization") };
    }
    return {
      ok: false,
      message: t("dataPipelines.namespaceLoadFailed"),
    };
  }

  if (namespaceType === NAMESPACE_TYPE_ORGANIZATION) {
    const orgOptions = raw?.organizationOptions;
    if (
      Array.isArray(orgOptions) &&
      orgOptions.length > 0 &&
      !isValidOrganizationNamespaceUuid(uuid, orgOptions)
    ) {
      return { ok: false, message: t("dataPipelines.pleaseSelectOrganization") };
    }
    return { ok: true };
  }

  return { ok: true };
}

/**
 * namespace 列表加载完成后，将个人 namespace_uuid 写入表单（组织已选且有效时不覆盖）。
 */
export function applyNamespaceFromLoaded(formRef, payload) {
  const target = unwrapFormRef(formRef);
  if (!target || !payload) return;

  const orgOptions = payload.organizationOptions ?? [];
  const type = resolveNamespaceType(target.namespace_type);

  if (type === NAMESPACE_TYPE_ORGANIZATION) {
    const uuid = String(target.namespace_uuid ?? "").trim();
    target.namespace_type = NAMESPACE_TYPE_ORGANIZATION;
    if (isValidOrganizationNamespaceUuid(uuid, orgOptions)) {
      return;
    }
    // 组织模式下残留的个人 user uuid 必须清空，避免下拉框展示/提交个人 uuid
    target.namespace_uuid = "";
    return;
  }

  const personal = payload.personalNamespace;
  if (personal?.uuid) {
    target.namespace_type = NAMESPACE_TYPE_PERSONAL;
    target.namespace_uuid = personal.uuid;
  }
}

/**
 * 提交前校验：加载中拦截 + namespace 字段校验。
 */
export function guardNamespaceBeforeSubmit(form, t, options = {}) {
  const { namespacesLoading = false } = options;
  if (namespacesLoading) {
    return { ok: false, message: t("dataPipelines.namespaceLoading") };
  }
  return validateNamespaceSelection(form, t);
}

export function buildTaskCreatePayload(form) {
  const base = normalizeSpaceResourcePayload(
    form && typeof form === "object"
      ? { ...(typeof form === "function" ? form() : unwrapFormRef(form) ?? {}) }
      : {}
  );
  const namespaceFields = resolveNamespacePayload(base);
  delete base.task_scope;
  delete base.organization_id;
  return { ...base, ...namespaceFields, ...resolveStorageSizePayload(base) };
}

export function useDataflowNamespaces() {
  const loading = ref(false);
  const loadError = ref("");
  const namespaces = ref([]);
  const loadedUsername = ref("");

  const personalNamespace = computed(() =>
    namespaces.value.find((n) => n.type === "user")
  );

  const organizationNamespaces = computed(() =>
    namespaces.value.filter((n) => n.type === "organization")
  );

  const organizationOptions = computed(() =>
    organizationNamespaces.value.map((n) => ({
      id: n.uuid,
      label: n.path,
      path: n.path,
    }))
  );

  const isNamespaceReady = computed(() => {
    if (loading.value) return false;
    if (loadError.value) return false;
    return Boolean(personalNamespace.value?.uuid);
  });

  /** 所属仓库 owner 下拉：个人 path + 各组织 path */
  const ownerPathOptions = computed(() => {
    const paths = [];
    if (personalNamespace.value?.path) {
      paths.push(personalNamespace.value.path);
    }
    organizationNamespaces.value.forEach((n) => {
      if (n.path && !paths.includes(n.path)) paths.push(n.path);
    });
    return paths;
  });

  async function load(username) {
    const name = String(username ?? "").trim();
    if (!name) {
      loadError.value = "username is required";
      namespaces.value = [];
      return;
    }
    if (loadedUsername.value === name && namespaces.value.length) {
      return;
    }
    loading.value = true;
    loadError.value = "";
    try {
      const { data, error } = await useFetchApi(`/user/${name}`).json();
      if (error.value) {
        loadError.value = error.value?.msg || "加载用户 namespace 失败";
        namespaces.value = [];
        return;
      }
      const nsFromNamespaces = parseNamespacesFromUserResponse(data.value);
      const nsFromOrgs = parseOrgsFromUserResponse(data.value);
      // 合并并去重（以 uuid 为准）
      const uuidSet = new Set();
      const merged = [];
      for (const ns of [...nsFromNamespaces, ...nsFromOrgs]) {
        if (!uuidSet.has(ns.uuid)) {
          uuidSet.add(ns.uuid);
          merged.push(ns);
        }
      }
      namespaces.value = merged;
      loadedUsername.value = name;
      if (!personalNamespace.value?.uuid) {
        loadError.value = "未找到个人 namespace，请刷新后重试";
      }
    } catch (e) {
      loadError.value = e?.message || "加载用户 namespace 失败";
      namespaces.value = [];
    } finally {
      loading.value = false;
    }
  }

  function applyPersonalNamespace(formRef) {
    const target = unwrapFormRef(formRef);
    if (!target || !personalNamespace.value) return;
    target.namespace_uuid = personalNamespace.value.uuid;
    target.namespace_type = NAMESPACE_TYPE_PERSONAL;
  }

  return {
    loading,
    loadError,
    namespaces,
    personalNamespace,
    organizationNamespaces,
    organizationOptions,
    ownerPathOptions,
    isNamespaceReady,
    load,
    applyPersonalNamespace,
  };
}
