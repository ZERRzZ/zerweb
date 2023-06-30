/**
 * 将 css 形式的字符串转换为对象
 * @param css css 形式字符串
 */
export function CSSStringToObject(css: string) {
  const leftBraceIndex = css.indexOf('{')
  const rightBraceIndex = css.indexOf('}')
  css = css.slice(leftBraceIndex + 1, rightBraceIndex)
  const cssAttributes = css.split(';').map(v => v.trim()).filter(v => v)
  const cssObject = {}
  cssAttributes.forEach(v => cssObject[v.split(':')[0].trim()] = v.split(':')[1].trim())
  return cssObject
}