import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { Form, message, Modal } from 'antd'
import env from "@/constants/env.json"

import './index.css'
import { checkFile, uploadFile } from '@/lib/upload'
import MyForm, { MyFormItems } from '../MyForm'

/**
 * @param value 编辑器内容
 * @param onchange
 * @param action 图片上传地址
 * @param getToken 图片上传 token 方法
 * @param width 编辑器宽度
 * @param height 编辑器高度
 */
export interface MyEditorProps {
  value?: string
  onChange?: (value: string) => void
  width?: number
  height?: number
}

export default function MyEditor({ width, height = 300, value, onChange }: MyEditorProps) {

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  // 编辑器内容
  const [html, setHtml] = useState('')
  // 上传视频弹框
  const [videoModalShow, setVideoModalShow] = useState<boolean>(false);
  const [videoModalForm] = Form.useForm();
  const videoFormItems: MyFormItems[] = [
    {
      type: 'myVideoUpload',
      item: { name: 'url', label: '视频文件', rules: [{ required: true, message: '请上传' }] },
    },
    {
      type: 'myImageUpload',
      item: { name: 'poster', label: '封面图片', rules: [{ required: true, message: '请上传' }] },
    },
  ]
  const insertFnRef = React.useRef((url, poster) => {
  });

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = { excludeKeys: [] }

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // 初始内容
    placeholder: '请输入内容...',
    // 菜单配置
    MENU_CONF: {
      // 图片上传
      uploadImage: {
        onBeforeUpload(file: File) {
          return checkFile(file, "jpg|jpeg|png|gif", 2) ? file : false;
        },
        // 自定义上传
        async customUpload(file: File, insertFn) {
          uploadFile(file, env.file_upload, 1, false, 2, undefined).then(res => {
            if (res) {
              insertFn(res, file.name, '')
            } else {
              message.error('图片上传失败');
            }
          }).catch(() => {
            message.error('图片上传失败');
          })
        }
      },
      // 视频上传
      uploadVideo: {
        customBrowseAndUpload(insertFn) {
          setVideoModalShow(true);
          insertFnRef.current = insertFn;
        },
      }
    },

  }

  // 改变
  const editorChange = (editor: IDomEditor) => {
    setHtml(editor.getHtml())
    onChange?.(editor.getHtml())
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const onVideoModalOk = () => {
    videoModalForm.validateFields().then(data => {
      insertFnRef.current && insertFnRef.current(data.url, data.poster);
      onVideoModalClose();
    })
  }

  const onVideoModalClose = () => {
    setVideoModalShow(false);
    insertFnRef.current = (url, poster) => {
    };
    videoModalForm.resetFields();
  }

  return <>
    <div style={{ width: `${width}px`, border: '1px solid #ccc', zIndex: 99 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={value || html}
        onCreated={setEditor}
        onChange={editorChange}
        mode="default"
        style={{ height: `${height}px` }}
      />
      <Modal
        title="上传视频"
        maskClosable={false}
        open={videoModalShow}
        onCancel={onVideoModalClose}
        onOk={onVideoModalOk}
        width={"60%"}>
        <MyForm form={{
          form: videoModalForm,
          labelCol: { span: 3 },
          wrapperCol: { span: 20 },
        }} items={videoFormItems} layout={[1]} />
      </Modal>
    </div>
  </>

}