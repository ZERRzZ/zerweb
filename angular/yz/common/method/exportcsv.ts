/**
 * 任意对象
 */
export interface CSVData {
  [prop: string]: any
}

/**
 * 导出 CSV 文件, head 与 column 中值应该一一对应
 */
export const exportCSV = (data: CSVData[], head: string[], column: string[], filename: string) => {

  let csv = data2csv(data, head, column) // 转换数据成 csv 格式

  // 可下载链接
  let a = document.createElement('a');
  a.download = filename;

  // 转变 blob 地址
  let blob = new Blob(['\uFEFF' + csv]); // 解决 excel 乱码
  a.href = URL.createObjectURL(blob)

  // 点击
  document.body.appendChild(a);
  a.click();

  // 移除
  document.body.removeChild(a);

}

/**
 * 转换数据称 CSV 格式数据
 * @param data 对象数组
 * @param head 表头，顺序要一一对应
 * @param column 列名
 */
const data2csv = (data: CSVData[], head: string[], column: string[]) => {

  //验证并处理参数
  if (head.length != column.length) {
    console.error('表头和内容字段数不符')
    return ''
  }

  let csv = ''

  // 表头，引号包起来为了识别换行
  head.forEach((h, i) => csv += (i === head.length - 1) ? (h + '\n') : (h + ', '))

  data.forEach(d => column.forEach((c, i) => {

    let body = d[c] // 用变量接收，防止影响源数据

    if (body != 0) body || (body = "") // 除零之外的假值都为空

    if (/\n/g.test(body)) body = `${body.toString().replace(/\n/g, ';')}` // 将换行符替换掉（没法做到单元格内换行）

    csv += (i === column.length - 1) ? (body + '\n') : (body + ', ')

  }))

  return csv

}
