/**
 * 需将数据转换成该格式传入二级菜单组件
 * @param id 一级菜单 id
 * @param title 一级菜单标题名
 */
export interface MenuOne {
  id: string,
  title: string
}
/**
 * @param open 二级菜单是否打开, 不必要时不用设置值
 * @param list 子菜单列表
 */
export interface MenuTwo extends MenuOne {
  open?: boolean,
  list: Array<MenuOne>
}