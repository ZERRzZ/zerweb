/** 将 cookie 差分成键值对的形式 */
export const cookieObj = () => document.cookie.split('; ').map(v => ({ key: v.split('=')[0], value: v.split('=')[1] })) 