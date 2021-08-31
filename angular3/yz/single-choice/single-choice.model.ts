/**
 * 需将格式转换成该类型传入 single-choice 组件
 */
export interface SingleChoice extends Single {
  list: Array<Single>
}
export interface Single {
  id: number,
  title: string
}