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

/**
 * 位置, 即上下左右
 */
export interface Position {
  left?: number,
  top?: number,
  right?: number,
  bottom?: number
}
/**
 * 根据图例最大行数来自动化图例
 * @param layout 公司图例信息
 * @param position 自定义图例的位置
 * @returns 返回修改后的图例信息
 */
export function autoLegend(layout: any, position?: Position): any {
  let { map, style, legend, legendInfo } = layout
  // 筛选图例
  style = style.filter(v => v.show)
  // 设置列数和行数, 默认行数已知
  legend.column = Math.ceil(style.length / legend.row)
  legend.row = style.length <= legend.row ? style.length : Math.ceil(style.length / legend.column)

  // 单行高
  let rowHeight: number = legendInfo.itemHeight + legendInfo.itemSpac
  // 标题高
  let titleHeight: number = legendInfo.titleSpac + legendInfo.itemSpac
  // 设置图例高度
  legend.height = rowHeight * legend.row + titleHeight

  // 最大图例文本字符长度, 分中英文
  let maxLength = Math.max(...(style.map(v => {
    let zhArr = v.text.match(/[^\x00-\xff]/g)
    let zhLen = zhArr ? zhArr.length : 0
    let enLen = v.text.length - zhLen
    return zhLen + Math.ceil(enLen / 2)
  })))
  // 设置图例文本宽度
  legendInfo.itemFW = maxLength * legendInfo.itemFs
  // 单列宽
  let colWidth: number = legendInfo.itemWidth + legendInfo.itemHorizontalSpac + legendInfo.itemFW
  // 计算图例宽度
  legend.width = colWidth * legend.column

  // 默认位置在右下角
  legend.y = map.height - legend.height
  legend.x = map.width - legend.width

  // 根据 position 值而改变位置
  if (position) {
    !isNaN(position.left) ? legend.x = position.left + 10 : position.right ? legend.x = legend.x - position.right : ''
    !isNaN(position.top) ? legend.y = position.top + 10 : position.bottom ? legend.y = legend.y - position.bottom : ''
  }

  return layout
}

/**
 * @param value 值, 一个值对应一种颜色
 * @param color 颜色
 * @param percent 百分比值, 饼图占比, 总和为 100
 * @param path svg path 标签, 不用传值
 */
export interface Pie {
  value: number
  color: string
  percent: number
  path?: string
}
/**
 * 根据传入的颜色和百分比来返回一个饼形图 svg 元素
 * @param pie 各个值对应的颜色与百分比
 * @param radius 圆的半径
 * @returns 返回一个 svg 饼形图
 */
export function pieChart(pie: Array<Pie>, radius: number = 30) {
  // 判断传输的百分率是否正确, 和是否是 100
  if (pie.reduce((pre, v) => v.percent ? v.percent + pre : pre, 0) > 100) {
    console.error('pie.percent 总值超过了 100')
    return
  }
  // console.log(pie.reduce((pre, v) => v.percent ? v.percent + pre : pre, 0))

  // 排序, 百分比大的在前
  pie.sort((a, b) => b.percent - a.percent)
  // console.log(pie)

  // 设置 path 属性, svg 路径, 拼接 svg 标签
  // Math.sin(), Math.cos() 当值是弧度值时才准确 弧度 = 角度 * PI / 180
  pie.reduce((pre, v, i) => {
    if (i == 0) {
      v.path = `<circle cx='${radius}' cy='${radius}' r='${radius}' fill=${v.color} />`
      return pre + v.percent / 100 * 360
    }
    let radian = (360 - pre) * Math.PI / 180
    let largeArcFlag: number = radian >= 180 ? 1 : 0 // 是否大于 180 度
    let startX = radius, startY = 0;
    let endX = startX + radius * Math.sin(radian), endY = startY + radius - radius * Math.cos(radian)
    console.log(Math.sin(radian), Math.cos(radian))
    v.path = `<path d='M${radius} ${radius} L${startX} ${startY} A${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z' fill='${v.color}' />`
    return pre + v.percent / 100 * 360
  }, 0)
  // console.log(pie)

  // 拼接 SVG
  let svg = `<svg viewbox="0 0 ${radius * 2} ${radius * 2}" width="${radius * 2}">`
  pie.forEach(v => v.percent && (svg += v.path))

  // 创建 html 元素并插入 svg
  let div = document.createElement('div')
  div.innerHTML = svg + `</svg>`
  console.log(div)

  return div
}
