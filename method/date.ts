/**
 * 转日期字符串如 2021-07-30
 */
export const Y_M_D = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}日`

/**
 * 转日期字符串如 20210730
 */
export const YYYYMMDD = (date: Date) => `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}日`

/**
 * 转日期字符串如 2021年07月30日
 */
export const dailyYMD = (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`

/**
 * 转日期字符串如 2021年07月30日09时
 */
export const dailyYMDH = (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时`