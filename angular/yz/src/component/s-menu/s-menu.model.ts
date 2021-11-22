/**
 * 二级菜单
 * @param open 是否打开
 */
export interface SMenu {
  id: number
  title: string
  open?: boolean
  list: Array<AMenu>
}

/** 一级菜单 */
export interface AMenu {
  id: number
  title: string
  path?: string
}
