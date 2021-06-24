/**
 * 防抖函数, 只有这样才形成了闭包
 * @param func 处理函数
 * @param delay 需要延迟几秒
 */
export const debounce = debounceFunc()
function debounceFunc() {
  let timer: number | undefined = undefined
  return (func: Function, delay: number) => {
    clearTimeout(timer)
    timer = setTimeout(func, delay)
  }
}