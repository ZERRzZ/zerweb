/**
 * 表头信息
 * @param name 表头单元格内容
 * @param field 对应的对象的属性
 * @param width 表格宽, 没有则自动
 */
export interface BTHead {
  name: string
  field: string
  width?: string
}

/**
 * 表体数据
 */
export interface BTBody {
  [prop: string]: any
}