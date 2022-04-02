/** 表头信息
 * @param id id
 * @param name 表头单元格文本
 * @param field 表格该列对应的 key
 * @param width 表格宽, 没有则自动
 */
export interface BTHead {
  id: number
  name: string
  field: string
  width?: string
}

/** 表体数据 */
export interface BTBody {
  [prop: string]: any
}

export const bthead: BTHead[] = [
  { id: 1, name: 'ID', field: 'id' },
  { id: 2, name: 'NAME', field: 'name' },
  { id: 3, name: 'TYPE', field: 'type' }
]

export const btbody: BTBody[] = [
  { id: 1, name: 'sadanya', type: 'otaku' },
  { id: 2, name: 'sadanya', type: 'otaku' },
  { id: 3, name: 'sadanya', type: 'AliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAliceAlice' },
  { id: 4, name: 'sadanya', type: 'otaku' },
  { id: 5, name: 'sadanya', type: 'otaku' },
  { id: 6, name: 'sadanya', type: 'otaku' },
  { id: 7, name: 'sadanya', type: 'otaku' },
  { id: 8, name: 'sadanya', type: 'otaku' },
  { id: 9, name: 'sadanya', type: 'otaku' },
  { id: 10, name: 'sadanya', type: 'otaku' },
  { id: 11, name: 'sadanya', type: 'otaku' },
  { id: 12, name: 'sadanya', type: 'otaku' },
  { id: 13, name: 'sadanya', type: 'otaku' },
  { id: 14, name: 'sadanya', type: 'otaku' },
  { id: 15, name: 'sadanya', type: 'otaku' },
  { id: 16, name: 'sadanya', type: 'otaku' },
  { id: 17, name: 'sadanya', type: 'otaku' },
  { id: 18, name: 'sadanya', type: 'otaku' },
  { id: 19, name: 'sadanya', type: 'otaku' },
  { id: 20, name: 'sadanya', type: 'otaku' },
  { id: 21, name: 'sadanya', type: 'otaku' }
]