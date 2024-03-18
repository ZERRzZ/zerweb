import { useEffect, useState } from 'react'
import { Tab } from 'rc-tabs/lib/interface'
import useMessage from 'antd/es/message/useMessage'
import { Button, ConfigProvider, Drawer, Form, Space, Tabs } from 'antd'

import './PageDesign.scss'
import CorMList from './CorMList'
import DataConfig, { DataContent } from './DataConfig'
import MyCode from '@/components/MyCode'
import { uid8 } from '@/utils/utility'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined, SettingOutlined } from '@ant-design/icons'
import api, { LayoutContent, Page } from '@/api/adminService'
import MyForm, { MyFormItems } from '@/components/MyForm'
import adminService from '@/api/adminService'

export default function PageDesign({ pageId }: PageDesignProps) {

  const [pageForm] = Form.useForm()
  // 页面总数据
  const [page, setPage] = useState<Page>()
  // 布局数据
  const [layoutContent, setLayoutContent] = useState<LayoutContent>()
  // 当前选中盒子 id
  const [active, setActive] = useState<string>()
  // 页面布局结构
  const [pageLayout, setPageLayout] = useState<any>({})
  // 页面布局数据
  const [content, setContent] = useState<any>({})
  // 当前组件数据模板
  const [dataContent, setDataContent] = useState<DataContent[]>()
  // 当前组件数据
  const [data, setData] = useState<any>()
  // 全屏标识
  const [fullScreenFlag, setFullScreenFlag] = useState(false)

  let configData: any
  const [configOpen, setConfigOpen] = useState(false)

  const [publicCss, setPublicCss] = useState<any>([])
  const [publicJs, setPublicJs] = useState<any>([])

  const [message, contextHolder] = useMessage();

  useEffect(() => {
    pageId && api.cms.page.get({ id: pageId }).then(res => {
      setPage(res)
      pageForm.setFieldsValue(JSON.parse(res.head || "{}"))
      // 初始布局结构
      res.layout_id && api.cms.layout.get({ id: res.layout_id }).then(ress => {
        ress.content && setLayoutContent(JSON.parse(ress.content))
        // 根据最新布局获取初始页面 content
        const oldPageContent = JSON.parse(res.content || "{}")
        const layoutBoxId = getLayoutBoxId(JSON.parse(ress.content || "{}"))
        const initContent = {}
        for (let key in oldPageContent) {
          layoutBoxId.includes(key) && (initContent[key] = oldPageContent[key])
        }
        // 初始布局结构，布局数据
        for (let key in initContent) {
          api.cms.module.get({ id: initContent[key] }).then(resss => {
            setPageLayout(pl => ({ ...pl, [key]: <div className='component'>{resss.component_name}</div> }))
            setContent(c => ({ ...c, [key]: { c_id: resss.component_id, m_id: resss.id, public: resss.type == 1 ? true : false } }))
          })
        }
      })
    })
    getPublicData()
    // 监听页面全屏变化
    document.addEventListener('fullscreenchange', () => setFullScreenFlag(document.fullscreenElement !== null))
    return document.removeEventListener('fullscreenchange', () => setFullScreenFlag(document.fullscreenElement !== null))
  }, [])

  // 根据布局数据获取布局所有最底层盒子 Id
  const getLayoutBoxId = (content: LayoutContent) => {
    const arr: string[] = []
    arr.push(recursion(content))
    function recursion(content: LayoutContent) {
      if (!content.children || content.children.length == 0) return content?.id
      else return content.children.map(c => recursion(c))
    }
    return arr.toString().split(",")
  }

  const getPublicData = () => {
    adminService.ms.dictionary.getOption({ code: 'website_public_js' }).then(res => {
      setPublicJs(res.map(item => ({ label: item.title, value: item.value })))
    })
    adminService.ms.dictionary.getOption({ code: 'website_public_css' }).then(res => {
      setPublicCss(res.map(item => ({ label: item.title, value: item.value })))
    })
  }

  const handleDragStart = (e, v) => e.dataTransfer?.setData('text', JSON.stringify(v))

  const handelDragOver = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e, box) => {
    e.preventDefault()
    e.stopPropagation()
    const data = JSON.parse(e.dataTransfer?.getData('text') || "")
    if (box.children && box.children.length > 0) return message.warning('父级盒子不可放入组件')
    // 添加当前选中盒子
    setActive(box.id)
    // 添加页面布局结构
    setPageLayout(pl => ({ ...pl, [box.id]: <div className='component'>{data.component_id ? data.name : data.title}</div> }))
    // 添加页面布局数据
    data.component_id ? data.type === 1 ?
      setContent(c => ({ ...c, [box.id]: { c_id: data.component_id, m_id: data.id, public: true } })) :
      setContent(c => ({ ...c, [box.id]: { c_id: data.component_id, m_id: data.id, public: false } })) :
      setContent(c => ({ ...c, [box.id]: { c_id: data.id, m_id: undefined, public: false } }))
    // 添加当前组件数据模板
    data.component_id ? setDataContent(undefined) : api.cms.component.get({ id: data.id }).then(res => res.data_content ? setDataContent(JSON.parse(res.data_content)) : setDataContent(undefined))
    // 添加当前组件数据
    setData(undefined)
  }

  const handleSelect = (e, box) => {
    e.stopPropagation()
    if (box.children && box.children.length > 0) return
    // 更改当前选中盒子
    setActive(box.id)
    // 更改当前组件数据模板和当前组件数据
    if (!content || !content[box.id] || content[box.id].public) {
      setDataContent(undefined)
      setData(undefined)
    } else {
      api.cms.component.get({ id: content[box.id].c_id }).then(res => {
        res.data_content ? setDataContent(JSON.parse(res.data_content)) : setDataContent(undefined)
        if (content[box.id].m_id)
          api.cms.module.get({ id: content[box.id].m_id }).then(res => setData(res.data))
        else
          setData(undefined)
      })
    }
  }

  const handleSet = () => {
    setConfigOpen(true)
  }

  const handleDelete = (e, box) => {
    e.stopPropagation()
    // 删除页面布局结构
    setPageLayout(pl => ({ ...pl, [box.id]: undefined }))
    // 删除页面布局数据
    setContent(c => ({ ...c, [box.id]: undefined }))
    // 删除当前组件数据模板
    setDataContent(undefined)
  }

  const renderLayout = (data: LayoutContent) => (
    <div className={`box ${data.id === active && 'active'}`} key={data.id} style={JSON.parse(data.style || "{}")} onDragOver={handelDragOver} onDrop={e => handleDrop(e, data)} onClick={e => handleSelect(e, data)}>
      {
        data.children?.map(c => renderLayout(c))
      }
      {
        data.id && pageLayout[data.id]
      }
      {
        data.id === active &&
        <div className="box-btns">
          {
            active && content[active] && !content[active].public && <Button type='dashed' icon={<SettingOutlined />} onClick={handleSet}></Button>
          }
          <Button type='dashed' icon={<CloseOutlined />} onClick={e => handleDelete(e, data)}></Button>
        </div>
      }
    </div>
  )

  const handleDataFinish = () => {
    if (!active) return message.error('未选中任何盒子')
    // 当前盒子内是一般模块时更新
    if (content[active].m_id) {
      api.cms.module.get({ id: content[active].m_id }).then(res => {
        api.cms.module.update({ ...res, page_id: pageId, data: JSON.stringify(configData) }).then(() => {
          message.success('更新数据成功')
          setConfigOpen(false)
        }).catch(err => message.error(`更新数据失败, ${err.msg}`))
      })
    } else {
      // 当前盒子内是组件时创建
      api.cms.component.get({ id: content[active].c_id }).then(res => {
        api.cms.module.add({ name: res.title, component_id: res.id, sn_id: uid8(), data: JSON.stringify(configData), type: 2, page_id: pageId }).then(res => {
          content[active].m_id = res
          message.success('模块创建成功')
          setConfigOpen(false)
        }).catch(err => message.error(`模块创建失败, ${err.msg}`))
      })
    }
  }

  const designFinish = () => {
    const obj = {}
    for (let key in content) {
      if (content[key] && !content[key].m_id) return message.error('请将所有组件都生成模块')
      obj[key] = content[key]?.m_id
    }
    api.cms.page.update(Object.assign(page || {}, { content: JSON.stringify(obj), head: JSON.stringify(pageForm.getFieldsValue()) })).then(() => {
      message.success('页面设计成功')
    }).catch(err => message.error(`页面设计失败，${err.msg}`))
  }

  const leftTabItems: Tab[] = [
    {
      key: '1',
      label: '组件',
      children: <CorMList type='component' code='cms_component_category' onDragStart={handleDragStart} />
    },
    {
      key: '2',
      label: '公共模块',
      children: <CorMList type='pubModule' onDragStart={handleDragStart} />
    },
    {
      key: '3',
      label: '私有模块',
      children: <CorMList type='priModule' pageId={pageId} onDragStart={handleDragStart} />
    }
  ]

  const pageItems: MyFormItems[] = [
    {
      type: 'text',
      item: { name: 'title', label: '标题' },
    },
    {
      type: 'text',
      item: { name: 'description', label: '描述' },
    },
    {
      type: 'text',
      item: { name: 'keywords', label: '关键词' },
    },
    {
      type: 'select',
      item: { name: 'css', label: '公共css' },
      option: { style: { width: 213 }, mode: 'multiple', options: publicCss }
    },
    {
      type: 'select',
      item: { name: 'js', label: '公共js' },
      option: { style: { width: 213 }, mode: 'multiple', options: publicJs }
    }
  ]

  const rightTabItems: Tab[] = [
    {
      key: '1',
      label: '页面配置',
      children: <MyForm form={{ onFinish: designFinish, layout: 'vertical', form: pageForm }} items={pageItems} layout={[1]} />

    },
    {
      key: '2',
      label: '样式配置',
      children: <MyCode language='css' height='400px' value={page?.style} onChange={v => setPage(l => ({ ...l, style: v }))} />
    },
    {
      key: '3',
      label: '脚本配置',
      children: <MyCode language='javascript' height='400px' value={page?.script} onChange={v => setPage(l => ({ ...l, script: v }))} />
    }
  ]

  return (
    <ConfigProvider getPopupContainer={() => document.getElementById('page-design-box')!}>
      <div id='page-design-box' className='page-design-box'>
        <div className='page-design-title'>
          <span className='title'>{page?.title}</span>
          <div className="btns">
            <Button type='primary' onClick={designFinish}>完成设计</Button>
            {
              fullScreenFlag ?
                <Button type='ghost' icon={<FullscreenExitOutlined />} onClick={() => document.exitFullscreen()}></Button> :
                <Button type='ghost' icon={<FullscreenOutlined />} onClick={() => document.getElementById('page-design-box')?.requestFullscreen()}></Button>
            }
          </div>
        </div>
        <div className='page-design'>
          <Tabs className='left' defaultActiveKey="1" items={leftTabItems} centered />
          <div className="middle">
            {
              layoutContent && renderLayout(layoutContent)
            }
          </div>
          <div className="right">
            <Tabs className='config' defaultActiveKey="1" items={rightTabItems} centered />
          </div>
        </div>
        <Drawer
          width={'90%'}
          title='数据配置'
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          destroyOnClose
          getContainer={false}
          extra={
            <Space>
              <Button type='primary' onClick={() => handleDataFinish()}>确认</Button>
              <Button onClick={() => setConfigOpen(false)}>取消</Button>
            </Space>
          }
        >
          <DataConfig dataContent={dataContent} initData={data} onFinish={v => configData = v} />
        </Drawer>
        {contextHolder}
      </div>
    </ConfigProvider>
  )

}

/**
 * 页面设计 Props
 * @param layout 布局数据
 * @param page 页面数据
 * @param onClose 返回时触发的事件
 */
export interface PageDesignProps {
  pageId?: string
}