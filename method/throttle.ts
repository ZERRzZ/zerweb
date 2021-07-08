/**
 * 节流函数, 大失败 ???
 */
export const throttle = throttleFunc()
export function throttleFunc() {
  let timer = -1
  return (func: Function, delay: number) => {
    if (timer != -1) return
    func()
    timer = setTimeout(() => {
      timer = -1
    }, delay)
  }
}