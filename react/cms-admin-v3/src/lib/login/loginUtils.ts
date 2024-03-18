import {strDec, strEnc} from "./des"
import env from "@/constants/env.json";

export function encrypt(text) {
    return strEnc(text, env.k1, env.k2, env.k3);
}

export function decrypt(text) {
    return strDec(text, env.k1, env.k2, env.k3);
}

export function getRandom(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var maxPos = $chars.length;
    var random = '';
    for (var i = 0; i < len; i++) {
        random += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    var timestamp = new Date().getTime();
    return random + "$" + timestamp;
}

