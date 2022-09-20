/**
 * 实现元素随鼠标移动的功能
 * @param el HTML 元素, 指定哪个元素需要移动
 */
export const dragmove = (el: HTMLElement) => {
  el.onmousedown = e => {
    // 鼠标按下时计算鼠标在元素上的相对偏移量
    // = 鼠标在视口的位置 - 元素在视口的偏移量
    let mouseX = e.clientX - el.offsetLeft;
    let mouseY = e.clientY - el.offsetTop;
    // 在鼠标按下时触发 onmousemove 事件
    // 不直接给元素添加是为了防止鼠标移动过快超出元素导致 bug
    document.onmousemove = ev => {
      ev.preventDefault()
      // 防止超出视口范围
      if (ev.clientX >= innerWidth) return
      if (ev.clientY >= innerHeight) return
      // 时刻改变元素偏移量
      let x = e.clientX - mouseX
      let y = e.clientY - mouseY
      // 防止元素超出视口
      x = x <= 0 ? 0 : x >= innerWidth - el.clientWidth ? innerWidth - el.clientWidth : x
      y = y <= 0 ? 0 : y >= innerHeight - el.clientHeight ? innerHeight - el.clientHeight : y
      // 改变元素定位偏移量
      el.style.left = x + 'px'
      el.style.top = y + 'px'
    }
  }
  // 关闭 onmousemove 事件
  el.onmouseup = () => document.onmousemove = null
}