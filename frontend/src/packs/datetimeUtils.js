import dayjs from 'dayjs'

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1，并使用padStart来确保总是两位数
  const day = String(now.getDate()).padStart(2, '0'); // 使用padStart来确保总是两位数
  return `${year}-${month}-${day}`;
}

export const getCurrentTime = () => {
  const currentDate = getCurrentDate(); // 获取当前日期
  return `${currentDate} 23:59:59`;
}

export const getFirstDayOfMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1); // 设置日期为1来获取这个月的第一天
  const year = firstDay.getFullYear();
  const month = String(firstDay.getMonth() + 1).padStart(2, '0');
  const day = String(firstDay.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getFirstDayOfTime = () => {
  const firstDayOfMonth = getFirstDayOfMonth(); // 获取当前月份的第一天
  return `${firstDayOfMonth} 00:00:00`;
}

export const formatDate = (date=(new Date), format='YYYY-MM-DD') => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
}

export const isFutureDate = (date) => {
  if (date) {
    const current = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const compareDate = new Date(year, month, 1)
    return compareDate > current
  }
}

export const isWithinTwoWeeks = (dateStr) => {
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const targetDate = new Date(dateStr);
  return targetDate > twoWeeksAgo;
};

export const getLastDayOfMonthFromDateString = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  const nextMonthFirstDay = new Date(year, month, 1)
  const lastDay = new Date(nextMonthFirstDay - 86400000).getDate()
  const formattedMonth = (month).toString().padStart(2, '0')

  return `${year}-${formattedMonth}-${lastDay}`
}

export const timestampToDatetimeStr = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const localDateTime = date.toLocaleString()
  return localDateTime
}