/**
 * 实现拖拽排序
 * @param el 排序列表元素的父元素, 类似 ul > li 中的 ul 元素, 排序的则是 li 元素  
 * dragstart 和 dragend 发生在拖拽源元素上, 源元素 draggable 需为 true  
 * dragenter 发生在目标元素上, 不需要 draggable 为 true  
 */
export function dragsort(el: HTMLElement) {
  let start: HTMLElement
  let timer = -1

  // 事件加在父元素上实现事件委托
  el.ondragstart = e => start = e.target as HTMLElement

  el.ondragenter = e => {
    // 应保证 enter 与 start 元素层级一致
    let enter = e.target as HTMLElement // 没有嵌套
    // let enter = (e.target as HTMLElement).parentElement // 再嵌套一级

    // 筛选不必要的触发
    if (enter == start) return  // 自己进入自己
    if (enter.nodeName != start.nodeName) return // 防止层级不一样
    if (timer != -1) return // 防鬼畜

    // 获取源元素与目标元素初始位置
    let preStartY = start.offsetTop
    let preEnterY = enter.offsetTop

    // 改变两元素的顺序
    if (_index(start) < _index(enter)) el.insertBefore(enter, start)
    else el.insertBefore(start, enter)

    // 获取改变之后的元素位置
    let curStartY = start.offsetTop
    let curEnterY = enter.offsetTop

    // 让元素瞬间回到初始位置
    _transform(start, '', `translateY(${preStartY - curStartY}px)`)
    _transform(enter, '', `translateY(${preEnterY - curEnterY}px)`)
    // 添加动画
    setTimeout(() => {  // 触发重绘, 实现 css 的 animation 效果
      _transform(start, 'all .2s', 'translateY(0)')
      _transform(enter, 'all .2s', 'translateY(0)')
    }, 0)

    // 防鬼畜
    timer = setTimeout(() => {
      _transform(start, '', '')
      _transform(enter, '', '')
      timer = -1
    }, 200)
  }
}

/**
 * 获取同一层级的元素下标
 */
export function _index(el: HTMLElement) {
  let index = 0
  while (el.previousElementSibling && (el = el.previousElementSibling as HTMLElement)) index++
  return index
}

/**
 * 添加动画
 */
export function _transform(el: HTMLElement, transition: string, transform: string) {
  el.style.transition = transition
  el.style.transform = transform
}