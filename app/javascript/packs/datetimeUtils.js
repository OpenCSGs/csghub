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