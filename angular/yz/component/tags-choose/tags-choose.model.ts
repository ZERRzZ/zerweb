/**标签选择（可多选）数据类型
 * @param text 文本
 * @param choose 是否选择
 * @param open 父级展开或叠起
 * @param children 子集
 */
export interface TagsParent {
  text: string
  choose?: boolean
  open?: boolean
  children: TagsChild[]
}

/**标签选择（可多选）数据类型
 * @param text 文本
 * @param choose 是否选择
 */
export interface TagsChild {
  text: string
  choose?: boolean
}

export const tags: TagsParent[] = [
  {
    text: '全部一',
    children: [
      { text: 'one', choose: true },
      { text: 'two', choose: true },
      { text: 'three', choose: true },
      { text: 'four' },
      { text: 'five' },
      { text: 'six' },
      { text: 'seven' },
      { text: 'eight' },
      { text: 'nine' },
      { text: 'ten' }
    ]
  },
  {
    text: '全部二',
    children: [
      { text: '一', choose: true },
      { text: '两', choose: true },
      { text: '二', choose: true }
    ]
  }
]