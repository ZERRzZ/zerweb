import { Button, ConfigProvider, Drawer, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { Tab } from 'rc-tabs/lib/interface'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'

import './LayoutDesign.scss'
import { uid8 } from '@/utils/utility'
import MyCode from '@/components/MyCode'
import api, { Layout } from '@/api/adminService'
import MyForm, { MyFormItems } from '@/components/MyForm'

export default function LayoutDesign({ layoutId }: LayoutDesignProps) {

  // 布局总数据
  const [layout, setLayout] = useState<Layout>()
  // 布局对象，根据此对象渲染 DOM
  const [content, setContent] = useState<LayoutContent>({
    id: uid8(),
    style: JSON.stringify({ width: '100%', height: '100%' })
  })
  // 当前选中标识
  const [active, setActive] = useState<string>()
  // 全屏标识
  const [fullScreenFlag, setFullScreenFlag] = useState(false)

  const [configForm] = useForm()
  const [configOpen, setConfigOpen] = useState(false)

  const [message, contextHolder] = useMessage()

  useEffect(() => {
    layoutId && api.cms.layout.get({ id: layoutId }).then(res => {
      setLayout(res)
      res.content && setContent(JSON.parse(res.content))
    })
    // 监听页面全屏变化
    document.addEventListener('fullscreenchange', () => setFullScreenFlag(document.fullscreenElement !== null))
    return document.removeEventListener('fullscreenchange', () => setFullScreenFlag(document.fullscreenElement !== null))
  }, [layoutId])

  const renderLayout = (data: LayoutContent) => (
    <div className={`box ${data.id === active && 'active'}`} key={data.id} style={JSON.parse(data.style || "{}")} onClick={e => selectBox(e, data)}>
      {
        data.children?.map(c => renderLayout(c))
      }
      {
        data.id === active &&
        <div className="box-btns">
          <Button type='dashed' icon={<SettingOutlined />} onClick={() => setLayoutBox()}></Button>
          <Button type='dashed' icon={<PlusOutlined />} onClick={() => addLayoutBox(data)}></Button>
          {
            content.id !== active && <Button type='dashed' icon={<CloseOutlined />} onClick={() => delLayoutBox(data)}></Button>
          }
        </div>
      }
    </div>
  )

  const selectBox = (e, content: LayoutContent) => {
    e.stopPropagation()
    setActive(content.id)
    configForm.resetFields()
    configForm.setFieldsValue({ ...content, ...JSON.parse(content.style || '{}') })
  }

  const setLayoutBox = () => {
    setConfigOpen(true)
  }

  const addLayoutBox = (content: LayoutContent) => {
    const obj = {
      id: uid8(),
      style: JSON.stringify({ width: '100%' })
    }
    setContent(c => {
      addChildById(c, content.id, obj)
      return JSON.parse(JSON.stringify(c))
    })
  }

  const delLayoutBox = (content: LayoutContent) => {
    setContent(c => {
      delChildById(c, content.id)
      return JSON.parse(JSON.stringify(c))
    })
  }

  const handleValuesChange = (_, data) => {
    const obj: LayoutContent = {
      id: data.id,
      class_name: data.class_name,
      style: JSON.stringify({ width: data.width, height: data.height, padding: data.padding, margin: data.margin })
    }
    setContent(c => changeById(c, data.id, obj))
  }

  const changeById = (content: LayoutContent, id: string, obj: LayoutContent) => {
    if (content.id === id) {
      return { ...obj, children: content.children }
    } else {
      return {
        ...content,
        children: content.children?.map(c => changeById(c, id, obj))
      }
    }
  }

  const addChildById = (content: LayoutContent, id: string, obj: LayoutContent) => {
    if (content.id === id) {
      content.children = content.children ? [...content.children, obj] : [obj]
    } else {
      content.children?.forEach(c => addChildById(c, id, obj))
    }
  }

  const delChildById = (content: LayoutContent, id: string) => {
    content.children = content.children?.filter(c => {
      delChildById(c, id)
      return c.id !== id
    })
  }

  const designFinish = value => {
    api.cms.layout.update(Object.assign(layout || {}, { layout_content: value })).then(() => {
      message.success('布局设计成功')
    }).catch(err => message.error(`布局设计失败，${err.msg}`))
  }

  const formItems: MyFormItems[] = [
    {
      type: 'text',
      item: { label: 'id', name: 'id' },
      option: { disabled: true }
    },
    {
      type: 'text',
      item: { label: '样式名', name: 'class_name' },
    },
    {
      type: 'text',
      item: { label: '宽度', name: 'width' }
    },
    {
      type: 'text',
      item: { label: '高度', name: 'height' }
    },
    {
      type: 'text',
      item: { label: '内间距', name: 'padding' }
    },
    {
      type: 'text',
      item: { label: '外间距', name: 'margin' }
    }
  ]

  const tabItems: Tab[] = [
    {
      key: '1',
      label: '样式配置',
      children: <MyCode language='css' height='400px' value={layout?.style} onChange={v => setLayout(l => ({ ...l, style: v }))} />
    },
    {
      key: '2',
      label: '脚本配置',
      children: <MyCode language='javascript' height='400px' value={layout?.script} onChange={v => setLayout(l => ({ ...l, script: v }))} />
    }
  ]

  return (
    <ConfigProvider getPopupContainer={() => document.getElementById('layout-design-box')!}>
      <div id='layout-design-box' className='layout-design-box'>
        <div className='layout-design-title'>
          <span className='title'>{layout?.name}</span>
          <div className="btns">
            <Button type='primary' onClick={() => designFinish(content)}>完成设计</Button>
            {
              fullScreenFlag ?
                <Button type='ghost' icon={<FullscreenExitOutlined />} onClick={() => document.exitFullscreen()}></Button> :
                <Button type='ghost' icon={<FullscreenOutlined />} onClick={() => document.getElementById('layout-design-box')?.requestFullscreen()}></Button>
            }
          </div>
        </div>
        <div className='layout-design'>
          <div className="design">
            {
              renderLayout(content)
            }
          </div>
          <div className='right'>
            <Tabs className='config' defaultActiveKey="1" items={tabItems} />
          </div>
        </div>
        <Drawer title='盒子配置' open={configOpen} onClose={() => setConfigOpen(false)} getContainer={false}>
          <MyForm form={{ form: configForm, labelCol: { span: 6 }, onValuesChange: handleValuesChange }} items={formItems} layout={[1]} />
        </Drawer>
        {contextHolder}
      </div>
    </ConfigProvider>
  )

}

export interface LayoutDesignProps {
  layoutId?: string
}

export interface LayoutContent {
  id: string
  class_name?: string
  style?: string
  children?: LayoutContent[]
}