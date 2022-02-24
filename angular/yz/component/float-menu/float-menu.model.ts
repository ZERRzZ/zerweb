/** 最上层
 * @param title 一级标题
 * @param content 一级标题下的菜单内容
 */
export interface FloatMenu {
  id: number
  title: string
  content?: FloatMenu[]
  [prop: string]: any
}

export const floatMenu: FloatMenu[] = [

  {
    id: 1,
    title: 'A',
    content: [
      {
        id: 1,
        title: 'Aa',
        content: [
          { id: 1, title: 'Aa1', value: 'key1' },
          { id: 2, title: 'Aa2', value: 'key2' }
        ]
      }
    ]
  },

  {
    id: 2,
    title: 'B',
    content: [
      {
        id: 1,
        title: 'Ba',
        content: [
          { id: 1, title: 'Ba1', value: 'key3' },
          { id: 2, title: 'Ba2', value: 'key4' }
        ]
      }
    ]
  },

  {
    id: 3,
    title: 'C',
    content: [
      {
        id: 1,
        title: 'Ca',
        content: [
          { id: 1, title: 'Ca1', value: 'key5' },
          { id: 2, title: 'Ca2', value: 'key6' }
        ]
      },
      {
        id: 2,
        title: 'Cb',
        content: [
          { id: 1, title: 'Cb1', value: 'key7' },
          { id: 2, title: 'Cb2', value: 'key8' }
        ]
      },
      {
        id: 3,
        title: 'Cc',
        content: [
          { id: 1, title: 'Cc1', value: 'key9' },
          { id: 2, title: 'Cc2', value: 'key10' }
        ]
      }
    ]
  }

]