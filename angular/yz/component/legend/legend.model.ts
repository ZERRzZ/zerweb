/** 图例
 * @param image 颜色示例的图片名称, 带后缀名
 */
export interface Legend {
  color: string
  text: string
  url?: string
}

export const legend: Legend[] = [
  {
    color: '#ff0000',
    text: 'one',
    url: '/assets/circle.png'
  },
  {
    color: '#00ff00',
    text: 'two',
  },
  {
    color: '#0000ff',
    text: 'three'
  },
  {
    color: '#ffff00',
    text: 'four'
  },
  {
    color: '#ff00ff',
    text: 'five'
  },
  {
    color: '#00ffff',
    text: 'sixsixsixsix'
  },
  {
    color: '#f0f0f0',
    text: 'seven'
  },
  {
    color: '#0f0f0f',
    text: 'eight'
  },
  {
    color: '#fff000',
    text: 'nine'
  },
  {
    color: '#000fff',
    text: 'ten'
  }
]