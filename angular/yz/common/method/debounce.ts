const debounceFunc = () => {

  let timer: number | undefined = undefined

  return (func: Function, delay: number) => {
    clearTimeout(timer)
    timer = setTimeout(func, delay)
  }

}

/**
 * 防抖函数, 只有这样才形成了闭包
 * @param func 处理函数
 * @param delay 延迟秒数
 */
export const debounce = debounceFunc()