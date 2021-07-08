/**
 * 实现元素随鼠标移动的功能
 * @param el HTML 元素, 指定哪个元素需要移动
 */
export function dragmove(el: HTMLElement) {
  el.onmousedown = e => {
    // 计算鼠标在元素上偏移量, 鼠标在视口的位置 - 元素在视口的偏移量
    let mouseX = e.clientX - el.offsetLeft;
    let mouseY = e.clientY - el.offsetTop;

    // 在 onmousedown 中触发 nonmousemove 事件
    document.onmousemove = e => {
      e.preventDefault()

      // 防止超出视口范围
      if (e.clientX >= innerWidth) return
      if (e.clientY >= innerHeight) return

      // 改变元素定位偏移量
      el.style.left = e.clientX - mouseX + "px";
      el.style.top = e.clientY - mouseY + "px";
    }
  }

  // onmouseup 给 document 元素加上比较好 ???
  el.onmouseup = () => {
    // 当鼠标松开时关闭 onmousemove 事件
    document.onmousemove = null;
    // console.log("are you sure ?");
  }
}