/**
 * 将同一数组中的某元素插入到另一元素的前面
 * @param arr 数组
 * @param m 插入源元素下标
 * @param n 插入目标元素下标
 */
 export function _insertBefore<T>(arr: Array<T>, m: number, n: number) {
  if (m < 0 || m >= arr.length) return
  if (n < 0 || n == m || n == m + 1) return

  let num = arr[m]

  if (n >= arr.length) {
    arr.push(num)
    arr.splice(m, 1)
    return
  }

  if (m < n) {
    arr.splice(n, 0, num)
    arr.splice(m, 1)
    return
  }

  if (m > n) {
    arr.splice(m, 1)
    arr.splice(n, 0, num)
    return
  }
}