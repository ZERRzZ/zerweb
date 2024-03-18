import CryptoJS from 'crypto-js'

// 加密数据函数 工具crypto.js 文件工具
export function aesEncrypt(word) {
  var key = CryptoJS.enc.Utf8.parse("CSxdAUoZkXka4HSa");
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}
export function aesDecrypt(word) {
  var key = CryptoJS.enc.Utf8.parse("CSxdAUoZkXka4HSa");
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
