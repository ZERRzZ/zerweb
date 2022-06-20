/**
 * @param name 显示的名称
 * @param value 对应的值
 */
export interface DDList {
  name: string
  value: string
}

export const list: DDList[] = [
  { name: '未来一天', value: '0' },
  { name: '未来二天', value: '1' },
  { name: '未来三天', value: '2' },
  { name: '未来四天', value: '3' },
  { name: '未来五天', value: '4' },
  { name: '未来六天', value: '5' },
  { name: '未来七天', value: '6' }
]