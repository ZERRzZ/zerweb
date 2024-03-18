import { Base64 } from "js-base64";
import { useEffect, useState } from "react";
import { Button, Form, Popconfirm } from "antd";
import useMessage from "antd/es/message/useMessage";

import './index.scss'
import adminService from "@/api/adminService";
import MyForm, { MyFormItems } from "@/components/MyForm";

const WebsiteConfigPage: React.FC = () => {

  const [websiteForm] = Form.useForm()
  const [websiteId, setWebsiteId] = useState<string>('')

  const [message, contextHolder] = useMessage()

  useEffect(() => {
    adminService.cms.websiteConfig.get({ sn_id: 'cms_website_config' }).then(res => {
      if (res.content) {
        websiteForm.setFieldsValue(JSON.parse(res.content))
      }
      setWebsiteId(res?.id as string)
    })
  }, [])

  const websiteFormItems: MyFormItems[] = [
    {
      type: 'text',
      span: 22,
      item: { name: 'name', label: '网站名称', rules: [{ required: true, message: '请填写名称' }] },
    },
    {
      type: 'text',
      span: 22,
      item: { name: 'title', label: '网站标题', rules: [{ required: true, message: '请填写标题' }] },
    },
    {
      type: 'text',
      span: 22,
      item: { name: 'description', label: '网站描述', rules: [{ required: true, message: '请填写描述' }] },
    },
    {
      type: 'text',
      span: 22,
      item: { name: 'keywords', label: '关键词', rules: [{ required: true, message: '请填写关键词' }] },
    },
    {
      type: 'myImageUpload',
      span: 22,
      item: { name: 'icon', label: 'Icon', rules: [{ required: true, message: '请上传图片' }], tooltip: '支持 png、jepg、jpg、gif、ico 等格式' },
    },
    {
      type: 'myImageUpload',
      span: 22,
      item: { name: 'logo', label: 'Logo', rules: [], tooltip: '支持 png、jepg、jpg、gif 等格式' },
    },
    {
      type: 'code',
      span: 22,
      item: { name: 'style', label: '全局样式' },
      option: { language: 'css', width: '100%', height: '500px' }
    },
    {
      type: 'code',
      span: 22,
      item: { name: 'script', label: '全局脚本' },
      option: { language: 'javascript', width: '100%', height: '500px' }
    }
  ];

  const setSadColor = () => {
    const sadStyle = `
html{
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  filter: progid:dximagetransform.microsoft.basicimage(grayscale=1);
}
    `
    const preValue = websiteForm.getFieldValue('style')
    websiteForm.setFieldValue('style', preValue + sadStyle)
  }

  const websiteFinish = () => {
    websiteForm.validateFields().then(values => {
      const temp = { ...values, style: Base64.encode(values.style), script: Base64.encode(values.script) }
      const params = {
        content: JSON.stringify(temp),
        sn_id: 'cms_website_config',
        id: websiteId
      }
      adminService.cms.websiteConfig.save(params).then(res => {
        message.success("保存成功！")
      }).catch(err => message.error(`保存失败！，${err.msg}`))
    })
  }

  return (
    <div className="website-config">
      <div className="website-save-box">
        <Popconfirm placement="topRight" title={`确认添加到全局样式里吗？`} onConfirm={setSadColor}>
          <Button>一键哀悼色</Button>
        </Popconfirm>
        <Button type="primary" onClick={websiteForm.submit}>保存</Button>
      </div>
      <MyForm form={{ onFinish: websiteFinish, labelCol: { span: 3 }, form: websiteForm }} items={websiteFormItems} layout={[1]} />
      {contextHolder}
    </div>
  )
}

export default WebsiteConfigPage;