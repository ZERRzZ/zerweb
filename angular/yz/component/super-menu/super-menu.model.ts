/**
 * 超级菜单数据格式
 * @param name 名称
 * @param level 层级
 * @param path 路由路径
 * @param open 是否展开
 * @param select 是否选中
 * @param children 子项, 拥有子项则说明存在子级菜单
 * @any [prop: string]: any 任意其他数据供使用者使用
 */
 export interface SuperMenu {
  name: string
  level: number
  path?: string
  open?: boolean
  select?: boolean
  children?: SuperMenu[]
  [prop: string]: any
}

export const supermenu: SuperMenu[] = [
  {
    name: '标题1',
    level: 1,
    path: './1'
  },
  {
    name: '标题2',
    level: 1,
    open: true,
    children: [
      { name: '标题2-1', level: 2 },
      { name: '标题2-2', level: 2 },
      { name: '标题2-3', level: 2 }
    ]
  },
  {
    name: '标题3',
    level: 1,
    open: true,
    children: [
      {
        name: '标题3-1',
        level: 2
      },
      {
        name: '标题3-2',
        level: 2,
        children: [
          { name: '标题3-2-1', level: 3, path: './3-2-1' },
          { name: '标题3-2-2', level: 3, path: './3-2-2' },
          { name: '标题3-2-3', level: 3, path: './3-2-3' }
        ]
      }
    ]
  }
]