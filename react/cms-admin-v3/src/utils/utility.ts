// https://gist.github.com/gordonbrander/2230317?permalink_comment_id=3443509#gistcomment-3443509
export function uid() {
  return (
    performance.now().toString(36) +
    Math.random().toString(36)
  ).replace(/\./g, '');
}

export function uid8() {
  return (
    performance.now().toString(36).slice(0, 4) +
    Math.random().toString(36).slice(0, 6)
  ).replace(/\./g, '');
}

export function objectToParamstr(Object: any = {}) {
  let paramStr = '';
  for (let key in Object) {
    if (Object.hasOwnProperty(key) && Object[key] != undefined && Object[key] != null) {
      paramStr += `${key}=${encodeURIComponent(Object[key])}&`;
    }
  }
  if (paramStr.endsWith('&')) paramStr = paramStr.substring(0, paramStr.length - 1);
  return paramStr;
}

export function paramstrToObject(str: string): any {
  if (str.startsWith('?')) {
    str = str.substring(1, str.length);
  }
  let obj = {};
  let array = str.split('&');
  array.forEach(item => {
    let split = item.split('=');
    obj[split[0]] = split[1] ? split[1] : '';
  });
  return obj;
}

export function getRequestParamsInHash() {
  let hrefQuery = window.location.hash.split('?')[1]
  return hrefQuery ? paramstrToObject(hrefQuery) : {}
}

export function isEqual(a, b) {
  if (a === null || a === undefined || b === null || b === undefined) {
    return a == b;
  }
  if (typeof a == 'object' && typeof b == 'object') {
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length != bKeys.length) {
      return false;
    }
    for (let i = 0; i < aKeys.length; i++) {
      let key = aKeys[i];
      if (!bKeys.includes(key)) {
        return false;
      }
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return a == b;
}

export function pathMatch(a?: string, b?: string) {
  if (!a || !b) {
    return false;
  }
  let aArray = a.split('/');
  let bArray = b.split('/');
  return aArray.length == bArray.length && aArray.every((p, index) => {
    return p === bArray[index] || p.startsWith(':') || bArray[index].startsWith(':');
  })
}

export function getRandomString(len) {
  len = len || 32;
  var $chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  var maxPos = $chars.length;
  var random = '';
  for (var i = 0; i < len; i++) {
    random += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return random;
}

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
  cssAttributes.forEach(v => cssObject[v.split(':')[0]?.trim()] = v.split(':')[1]?.trim())
  return cssObject
}