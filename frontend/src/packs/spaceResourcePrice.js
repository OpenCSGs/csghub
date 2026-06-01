/**
 * 空间云资源价格展示（与 fetchResourceInCategory / 新建 Notebook·微调·Endpoint 一致）
 * - pay_mode == minute：price/100 + 元/时
 * - pay_mode == month：price/100 + 元/月
 * - pay_mode == year：price/100 + 元/年
 * - pay_mode == free 或其它：免费
 */

function resolveLabels(t, locale) {
  if (t) {
    return {
      free: t("all.free"),
      hourUnit: t("all.hourUnit"),
      monthUnit: t("all.monthUnit"),
      yearUnit: t("all.yearUnit"),
      minutePay: t("all.minutePay"),
      yearMonthPay: t("all.yearMonthPay"),
      others: t("all.others"),
    };
  }
  return {
    free: locale?.free ?? "免费",
    hourUnit: locale?.hourUnit ?? "",
    monthUnit: locale?.monthUnit ?? "",
    yearUnit: locale?.yearUnit ?? "",
    minutePay: locale?.minutePay ?? "",
    yearMonthPay: locale?.yearMonthPay ?? "",
    others: locale?.others ?? "",
  };
}

/**
 * @param {object} item space_resources 单项
 * @param {{ t?: Function, locale?: object }} i18n
 */
export function formatSpaceResourcePriceLabel(item, { t, locale } = {}) {
  if (!item) return "";
  const labels = resolveLabels(t, locale);
  const payMode = item.pay_mode;
  if (payMode == "minute") {
    return `${(Number(item.price) / 100).toFixed(2)}${labels.hourUnit}`;
  }
  if (payMode == "month") {
    return `${(Number(item.price) / 100).toFixed(2)}${labels.monthUnit}`;
  }
  if (payMode == "year") {
    return `${(Number(item.price) / 100).toFixed(2)}${labels.yearUnit}`;
  }
  return labels.free;
}

/** 付费类型分组名（下拉分组等场景） */
export function getSpaceResourcePayModeCategory(item, { t, locale } = {}) {
  const labels = resolveLabels(t, locale);
  const mapping = {
    free: labels.free,
    minute: labels.minutePay,
    month: labels.yearMonthPay,
    year: labels.yearMonthPay,
  };
  return mapping[item?.pay_mode] || labels.others;
}

/** 为资源项附加 priceValue，供卡片展示 */
export function enrichSpaceResourceWithPrice(item, i18n) {
  if (!item || typeof item !== "object") return item;
  return {
    ...item,
    priceValue: formatSpaceResourcePriceLabel(item, i18n),
  };
}
