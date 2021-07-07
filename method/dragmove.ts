/**
 * 实现元素随鼠标移动的功能
 * @param el HTML 元素, 指定那个元素需要移动
 */
export function dragmove(el: HTMLElement) {
  el.onmousedown = function (event) {
    // 计算鼠标在元素上偏移量, 鼠标在视口的位置 - 元素在视口的偏移量
    let mouseX = event.clientX - el.offsetLeft;
    let mouseY = event.clientY - el.offsetTop;

    // 在 onmousedown 中触发 nonmousemove 事件
    document.onmousemove = function (event) {
      event.preventDefault()

      // 改变元素定位偏移量
      el.style.left = event.clientX - mouseX + "px";
      el.style.top = event.clientY - mouseY + "px";
    };
  };
  // onmouseup 给 document 元素加上比较好 ???
  el.onmouseup = function () {
    // 当鼠标松开时关闭 onmousemove 事件
    document.onmousemove = null;
    // console.log("are you sure ?");
  };
}