/**
 * 超级菜单数据格式
 * @param id 编号
 * @param name 名称
 * @param path 路由路径
 * @param open 是否展开
 * @param select 是否选中
 * @param children 子项, 拥有子项则说明存在子级菜单
 */
export interface SuperMenu {
  id: string
  name: string
  path?: string
  open?: boolean
  select?: boolean
  children?: SuperMenu[]
}

export const supermenu: SuperMenu[] = [
  { id: '1', name: '标题1', path: './1' },
  {
    id: '2',
    name: '标题2',
    open: true,
    select: true,
    children: [
      { id: '2.1', name: '标题2-1', select: true },
      { id: '2.2', name: '标题2-2' },
      { id: '2.3', name: '标题2-3' }
    ]
  },
  {
    id: '3',
    name: '标题3',
    children: [
      { id: '3.1', name: '标题3-1' },
      {
        id: '3.2',
        name: '标题3-2',
        children: [
          { id: '3.2.1', name: '标题3-2-1', path: './3-2-1' },
          { id: '3.2.2', name: '标题3-2-2', path: './3-2-2' },
          { id: '3.2.3', name: '标题3-2-3', path: './3-2-3' }
        ]
      }
    ]
  }
]