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
  style = style.filter((v: any) => v.show)
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
  let maxLength = Math.max(...(style.map((v: any) => {
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
    position.left && position.left >= 0 ? legend.x = position.left + 10 : position.right ? legend.x = legend.x - position.right : ''
    position.top && position.top >=0 ? legend.y = position.top + 10 : position.bottom ? legend.y = legend.y - position.bottom : ''
  }

  return layout
}