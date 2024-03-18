import { ReactNode, useEffect, useState } from "react"
import { message, Modal, Upload } from "antd"
import { RcFile, UploadFile } from "antd/lib/upload"
import { UploadListType, UploadFileStatus, UploadChangeParam } from "antd/lib/upload/interface"
import './index.css'
import { UploadRequestOption } from "rc-upload/lib/interface"
import { checkFile, uploadFile } from "@/lib/upload"
import ImgCrop from "antd-img-crop"


export default function MyUpload({ action, accept, maxSize = 5, isChunk = false, chunkSize = 2, tokenType, listType = 'text', maxCount = 1, valueSplit, valueType = 'string', crop, value, onChange, disabled, children }: MyUploadProps) {

  const [previewImage, setPreviewImage] = useState('') // 预览信息
  const [previewOpen, setPreviewOpen] = useState(false) // 预览弹窗开关

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [localValue, setLocalValue] = useState<any>();

  useEffect(() => {
    if (value != localValue) {
      setLocalValue(value);
      let newFilelist = [] as UploadFile[];
      if (value) {
        if (typeof value === 'string') {
          if (valueType === 'json') {
            try {
              value = JSON.parse(value);
            } catch(e){
            }
          } else {
            value = valueSplit && value.split(valueSplit);
          }
        }
        if (Array.isArray(value) && value.length > 0) {
          newFilelist = value.map((item, index) => {
            const uid = (index + 1).toString();
            if (typeof item === 'string') {
              return { uid: uid, url: item, thumbUrl: item, status: 'done' as UploadFileStatus, name: uid }
            } else {
              return { uid: uid, url: item.url, thumbUrl: item.url, status: 'done' as UploadFileStatus, name: item.name }
            }
          });
        }

      }
      setFileList(newFilelist);
    }

  }, [value])

  // 限制文件类型，文件大小
  const beforeUpload = (file: RcFile) => {
    return checkFile(file, accept, maxSize);
  }

  // 限制文件数量
  const handleChange = (info: UploadChangeParam<UploadFile>) => {
    if (!info.file.status) {
      return;
    }
    const newFileList = info.fileList.filter(item => item.status === 'done' || item.status === 'success' || item.status === 'uploading');
    newFileList.forEach(item => {
      if (item.response) {
        item.url = item.thumbUrl = item.response;
      }
    })
    setFileList(newFileList);
    if ((info.file.status === 'done' || info.file.status === 'removed') && onChange) {
      const doneFiles = newFileList.filter(item => item.status === 'done' && item.url);
      let files: any;
      if (valueType === 'obj') {
        files = doneFiles.map(item => ({ name: item.name, url: item.url }));
      } else if (valueType === 'json') {
        files = JSON.stringify(doneFiles.map(item => ({ name: item.name, url: item.url })));
      } else if (valueType === 'string' && valueSplit) {
        files = doneFiles.map(item => item.url || '').join(valueSplit);
      } else {
        files = doneFiles.map(item => item.url || '');
      }
      setLocalValue(files);
      onChange(files);
    }
  }

  const uploadRequest = (info: UploadRequestOption) => {
    const file = info.file;
    if (file) {
      uploadFile(file, action, tokenType, isChunk, chunkSize, info.onProgress).then((res) => {
        if (res) {
          message.success("上传成功");
          info.onSuccess && info.onSuccess(res);
        }
      }).catch((err) => {
        console.log("uploadFileFor Url err", err);
        message.error(err);
        info.onError && info.onError({ name: '上传失败', message: err });
      });

    }
  }

  // 文件预览或下载
  const onPreview = (file: UploadFile) => {
    if (!file.url) return
    if (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle') {
      setPreviewImage(file.url)
      setPreviewOpen(true)
    } else {
      const a = document.createElement("a")
      a.href = file.url
      a.download = file.name
      a.click()
      a.remove()
    }
  }

  const upload = (
    <Upload
      accept={accept}
      listType={listType}
      fileList={fileList}
      maxCount={maxCount}
      beforeUpload={beforeUpload}
      customRequest={uploadRequest}
      onChange={handleChange}
      onPreview={onPreview}
      disabled={disabled}
      progress={{
        // strokeColor: {
        //   '0%': '#108ee9',
        //   '100%': '#87d068',
        // },
        size: 3,
        format: (percent) => `${percent}%`,
      }}
    >
      {(fileList.length >= maxCount || disabled) ? undefined : children}
    </Upload>
  )


  return <>
    {crop ? <ImgCrop showGrid rotationSlider aspectSlider showReset>{upload}</ImgCrop> : upload}
    <Modal width={'60%'} title='预览' open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
      <img alt="example" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  </>

}

/**
 * 我的上传组件
 * @param action 文件上传地址
 * @param accept 文件类型
 * @param maxSize 文件大小，单位为 MB，默认值5
 * @param isChunk 是否分片上传，默认值false
 * @param chunkSize 分片文件大小限制，默认值2
 * @param tokenType 获取UploadToken的参数
 * @param listType UploadListType
 * @param maxCount 文件数量
 * @param valueSplit 值的分隔符
 * @param valueType 值类型
 * @param crop 是否裁剪
 * @param value 值
 * @param onChange 传出 url
 * @param disabled 不可编辑
 */
export interface MyUploadProps {
  action?: string;
  accept?: string;
  maxSize?: number;
  isChunk?: boolean;
  chunkSize?: number;
  tokenType?: any;
  listType?: UploadListType;
  maxCount?: number;
  valueSplit?: string;
  valueType?: 'string' | 'array' | 'obj' | 'json'
  crop?: boolean
  value?: string | string[] | { url: string; name: string }[];
  onChange?: (value: string | string[] | { url: string; name: string }[] | undefined) => void;
  disabled?: boolean;
  children?: ReactNode;
}