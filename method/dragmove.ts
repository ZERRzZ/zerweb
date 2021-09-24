/**
 * 实现元素随鼠标移动的功能
 * @param el HTML 元素, 指定哪个元素需要移动
 */
export const dragmove = (el: HTMLElement) => {

  el.onmousedown = e => {

    // 鼠标按下时计算鼠标在元素上的相对偏移量
    // 鼠标在视口的位置 - 元素在视口的偏移量
    let relativelyX = e.clientX - el.offsetLeft;
    let relativelyY = e.clientY - el.offsetTop;

    document.onmousemove = e => { // 在鼠标按下时触发 onmousemove 事件

      e.preventDefault()

      // 防止超出视口范围
      if (e.clientX >= innerWidth) return
      if (e.clientY >= innerHeight) return

      // 改变元素定位偏移量
      el.style.left = e.clientX - relativelyX + "px";
      el.style.top = e.clientY - relativelyY + "px";

    }

  }

  el.onmouseup = () => document.onmousemove = null // 关闭 onmousemove 事件

}