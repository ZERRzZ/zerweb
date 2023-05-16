/**
 * 根据 value 找出所有父级元素的 value
 * @param value 选中的子元素的值
 * @param data 数据源
 * @returns 返回所有父级的值
 */
const findParent = (value: string, data: data[]) => {
  let flag = false
  const values: string[] = []
  sub(value, 0, data)
  return values
  function sub(value: string, index: number, data: data[]) {
    for (const v of data) {
      if (flag) return
      values.splice(index)
      values[index] = v.value!
      if (v.value === value) flag = true
      v.children && sub(value, index + 1, v.children)
    }
  }
}

/**
 * 模拟带有 children 的类似数据类型
 */
interface data {
  value?: string
  children?: data[]
}