import { GlobalMethod } from "@/stories/GlobalConfig";
import { message } from "antd";
import http, { getRequestUrl } from "./http";
import env from "@/constants/env.json";

// 限制文件类型，文件大小
export const checkFile = (file: File, accept, maxSize) => {
    if (accept) {
        let regex = new RegExp(".+\.(" + accept + ")$");
        if (!regex.test(file.name)) {
            message.error('文件类型不支持');
            return false;
        }
    }
    if (file.size / 1024 / 1024 > maxSize) {
        message.error(`文件大小不能超过 ${maxSize} MB`)
        return false
    }
    return true;
}

// 获取token后，上传文件，获得文件url
export const uploadFile = (file, action, tokenType, isChunk, chunkSize, onProgress) => {
    if (isChunk) {
        return uploadFileChunk(file, action, tokenType, chunkSize, onProgress);
    } else {
        return new Promise((resolve, reject) => {
            GlobalMethod.getUploadToken(tokenType).then((tokenStr) => {
                var formFile = new FormData();
                formFile.append("file", file);
                http({
                    url: getRequestUrl(action),
                    method: 'POST',
                    headers: {
                        'UploadToken': '' + tokenStr,
                    },
                    data: formFile,
                    timeout: 120000
                }).then((res) => {
                    if (res.data) {
                        if (res.data.code === 400 && res.data.data === null) {
                            reject(res.data.msg || '上传文件失败');
                        } else if (res.data.code === 200) {
                            const fileUrl = res.data.data?.url;
                            resolve(fileUrl);
                        }
                    }
                }).catch(err => {
                    console.error(err);
                    err.message = '文件上传失败'
                    reject(err);
                });
            });
        });
    }
}

//分片上传
const uploadFileChunk = (fileObj, action, tokenType, chunkSize, onProgress) => {
    onProgress && onProgress({ percent: 0 });
    var index = 1;
    var hasShowMessage = false;
    const uploadPieceOfFile = (filePieces, fileName, fileType, tokenStr, chunks, size, resolve, reject) => {
        if (!filePieces) return;
        var pieceOfFile = filePieces.shift();
        if (!pieceOfFile) return;
        var formFile = new FormData();
        var fileUrl = '';
        formFile.append("file", new window.File([pieceOfFile], fileName, { type: fileType }));
        var chunk = index;
        index++;
        http({
            url: getRequestUrl(action),
            method: 'POST',
            headers: {
                'UploadToken': '' + tokenStr
            },
            params: {
                chunk: chunk,
                chunks: chunks,
                size: size
            },
            data: formFile,
            timeout: 120000
        }).then((res) => {
            if (res.data) {
                if (res.data.code === 400 && res.data.data === null) {
                    reject(res.data.msg || '上传文件失败');
                } else if (res.data.code === 200) {
                    fileUrl = res.data.data.url;
                    if (fileUrl) {
                        onProgress && onProgress({ percent: 100 });
                        resolve(fileUrl);
                    } else {
                        let percent: number = Number(Number((chunks - filePieces.length) * 100 / chunks).toFixed(0));
                        if (percent > 99) {
                            percent = 99;
                        }
                        onProgress && onProgress({ percent: percent });
                    }
                    uploadPieceOfFile(filePieces, fileName, fileType, tokenStr, chunks, size, resolve, reject);
                }
            }
        }).catch((err) => {
            console.error(err);
            if (!hasShowMessage) {
                reject(err.msg || '网络异常，请刷新重试');
                hasShowMessage = true;
            }
        });
    };
    return new Promise((resolve, reject) => {
        GlobalMethod.getUploadToken(tokenType).then((tokenStr) => {
            const { size, type, name } = fileObj;
            const partSize = chunkSize * 1024 * 1024;
            const chunks = size <= partSize ? 1 : Math.ceil(size / partSize);
            let cur = 0;
            let obj;
            let filePieces: any = [];
            for (let i = 0; i < chunks - 1; i++) {
                obj = fileObj.slice(cur, cur = cur + partSize);
                filePieces.push(obj);
            }
            filePieces.push(fileObj.slice(cur, size));
            for (var i = 0; i < 3; i++) {
                uploadPieceOfFile(filePieces, name, type, tokenStr, chunks, size, resolve, reject);
            }
        }).catch((err) => {
            message.error(err.msg);
        })
    })
}