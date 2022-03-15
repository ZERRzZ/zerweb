// import { LayoutObj, LegendInner, Style } from "@yz-ui/core"
// import { PrintModelParam } from "@yz-ui/print"

// /**
//  * 位置, 即上下左右
//  * @param left
//  * @param top
//  * @param right
//  * @param bottom
//  */
// export interface Position {
//   left?: number,
//   top?: number,
//   right?: number,
//   bottom?: number
// }

// // 根据图例最大行数来自动化图例

// export const autoLegendV = (printmodel: PrintModelParam, position?: Position) => {

//   let style = (printmodel.style as Style).rules
//   let templ = (printmodel.templ as LayoutObj)
//   let legendInfo = printmodel.legend as LegendInner
//   let legend = (printmodel.templ as LayoutObj).legend

//   // style = style.filter(v => v.visble) // 筛选图例

//   legend.column = Math.ceil(style.length / legend.row) // 行数
//   legend.row = style.length <= legend.row ? style.length : Math.ceil(style.length / legend.column) // 列数

//   let rowHeight = legendInfo.item_h + legendInfo.item_s // 单行高
//   let titleHeight = legendInfo.title_spacing + legendInfo.item_s // 标题高
//   legend.height = rowHeight * legend.row + titleHeight // 图例高度

//   // 最大图例文本字符长度, 分中英文
//   let maxLength = Math.max(...(style.map(v => {
//     let zhArr = v.filterRules[0].label.match(/[^\x00-\xff]/g)
//     let zhLen = zhArr ? zhArr.length : 0
//     let enLen = v.filterRules[0].label.length - zhLen
//     return zhLen + Math.ceil(enLen / 2)
//   })))

//   legendInfo.item_font_w = maxLength * legendInfo.item_font_s // 设置图例文本宽度
//   let colWidth = legendInfo.item_w + legendInfo.item_horizontal_s + legendInfo.item_font_w // 单列宽
//   legend.width = colWidth * legend.column // 图例宽度

//   // 默认位置在右下角
//   legend.y = templ.height - legend.height - 21
//   legend.x = templ.width - legend.width

//   // 根据 position 值而改变位置
//   if (position) {
//     !isNaN(position.left) ? legend.x = position.left + 10 : position.right ? legend.x = legend.x - position.right : ''
//     !isNaN(position.top) ? legend.y = position.top + 10 : position.bottom ? legend.y = legend.y - position.bottom : ''
//   }

//   return printmodel

// }
