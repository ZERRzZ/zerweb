/**
 * 需将数据转换成该格式传入二级菜单组件
 * @param open 二级菜单是否打开, 不必要时不用设置值
 */
export interface MenuTwo extends MenuOne {
  open?: boolean,
  list: Array<MenuOne>
}
export interface MenuOne {
  id: number,
  title: string
}