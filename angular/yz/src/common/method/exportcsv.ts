/**
 * 导出 CSV 文件
 */
export const exportCSV = (data: any[], head: string[], column: string[], filename: string) => {

  // 借助第三方包将数据转换成 csv 格式
  let csv = data2csv(data, head, column)

  // 可下载链接
  var a = document.createElement('a');
  a.download = filename;

  // 转变 blob 地址
  var blob = new Blob([csv]);
  a.href = URL.createObjectURL(blob)

  // 点击
  document.body.appendChild(a);
  a.click();

  // 移除
  document.body.removeChild(a);

}

/**
 * @param data 对象数组
 * @param head 表头，顺序要一一对应
 * @param column 列名
 */
const data2csv = (data: any[], head: string[], column: string[]) => {

  //验证并处理参数
  if (head.length != column.length) {
    console.error('表头和内容字段数不符')
    return ''
  }

  let csv = ""

  // 表头
  head.forEach((h, i) => csv += i >= head.length - 1 ? h + '\n' : h + ',')

  // 内容
  data.forEach(d => column.forEach((c, i) => {
    d[c] || (d[c] = "")
    csv += i >= column.length - 1 ? d[c] + '\n' : d[c] + ','
  }))

  return csv

}
