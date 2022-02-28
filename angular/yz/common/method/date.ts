/**
 * 转日期字符串如 08-20
 */
export const M_D = (date: Date) => `${MM(date.getMonth() + 1)}-${MM(date.getDate())}`

/**
 * 转日期字符串如 2021-07-30
 */
export const Y_M_D = (date: Date) => `${date.getFullYear()}-${MM(date.getMonth() + 1)}-${MM(date.getDate())}`

/**
 * 转日期字符串如 20210730
 */
export const YYYYMMDD = (date: Date) => `${date.getFullYear()}${MM(date.getMonth() + 1)}${MM(date.getDate())}`

/**
 * 转日期字符串如 2021073017
 */
export const YYYYMMDDHH = (date: Date) => `${date.getFullYear()}${MM(date.getMonth() + 1)}${MM(date.getDate())}${MM(date.getHours())}`

/**
 * 转日期字符串如 2021年07月30日
 */
export const dailyYMD = (date: Date) => `${date.getFullYear()}年${MM(date.getMonth() + 1)}月${MM(date.getDate())}日`

/**
 * 转日期字符串如 2021年07月30日09时
 */
export const dailyYMDH = (date: Date) => `${date.getFullYear()}年${MM(date.getMonth() + 1)}月${MM(date.getDate())}日${MM(date.getHours())}时`

/**
 * 格式化 M to MM
 */
export const MM = (number: number) => number > 9 ? number : `0${number}`

/**未来或过去几天
 * @param date 源日期
 * @param days 未来(正值)或过去(负值)天数
 */
export const jumpDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)