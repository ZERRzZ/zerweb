/**进度条的数据格式
 * @param id ID
 * @param text 鼠标 hover 后显示的文本
 * @param 其他与具体业务相关的数据
 */
export interface PlayBar {
  id: number
  text?: string
  [prop: string]: any
}

export const playbar: PlayBar[] = [

  { id: 1, text: '11111111' },
  { id: 2, text: '22222222' },
  { id: 3, text: '33333333' },
  { id: 4, text: '44444444' },
  { id: 5, text: '55555555' },
  { id: 6, text: '66666666666666666666' },
  { id: 7, text: '77777777' },
  { id: 8, text: '88888888' },
  { id: 9, text: '99999999' },
  { id: 10, text: '1010101010101010' }

]