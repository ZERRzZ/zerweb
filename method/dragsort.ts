export function dragsort(el: HTMLElement) {
  let start = null
  let timer = undefined
  
  el.ondragstart = e => {
    start = e.target
  }
}