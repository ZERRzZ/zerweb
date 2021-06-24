/**
 * @param id 一个 id 对应一种颜色和值
 * @param color 颜色
 * @param value 值, 根据该值占总值的比例来设置饼图占比
 */
export interface Pie {
  id: number
  color: string
  value: number
}

/**
 * 根据传入的颜色和值来返回一个饼形图 svg 元素
 * @param pie 各个 id 对应的颜色与值
 * @param radius 圆的半径
 * @returns 返回一个 svg 饼形图
 */
export function pieChart(pie: Array<Pie>, radius: number = 10) {
  // 传入的 value 总值, 根据此值计算百分率
  let total = pie.reduce((pre, v) => pre + v.value, 0)

  // 排序, value 值大的在前面
  pie.sort((a, b) => b.value - a.value)

  // 创建 svg 标签
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewbox', `0 0 30 30`)
  svg.setAttribute('width', `${radius * 2}px`)
  svg.setAttribute('height', `${radius * 2}px`)

  if (total == 0) return svg

  // 设置 path 属性, 画弧
  // Math.sin(), Math.cos() 当值是弧度值时才准确
  // 弧度 = 角度 * PI / 180, 2 * PI 即一个圆周
  pie.reduce((radian, v, i) => {
    if (i == 0) {
      svg.innerHTML += `<circle cx='${radius}' cy='${radius}' r='${radius}' fill='${v.color}'/>`
      return radian - v.value / total * Math.PI * 2
    }
    let largeArcFlag = radian >= 180 ? 1 : 0 // 是否大于 180 度
    let endX = radius + radius * Math.sin(radian)
    let endY = radius - radius * Math.cos(radian)
    svg.innerHTML += `<path d='M${radius} ${radius} L${radius} 0 A${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z' fill='${v.color}'/>`
    return radian - v.value / total * Math.PI * 2
  }, 2 * Math.PI)

  return svg
}