import { Gutter } from 'antd/es/grid/row'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useRef, useState } from 'react'
import { Button, Collapse, FormProps } from 'antd'

import './index.css'
import { uid } from '@/utils/utility'
import { formField } from './FormField'
import { formOption } from './FormOption'
import MyForm, { MyFormItems, MyFormProps } from '@/components/MyForm'

function FormDesign({ initValue, onFinish }: FormDesignProps) {

  const H = 35 // 表单字段高

  // 拖放区盒子元素
  const dragBoxRef = useRef<HTMLDivElement>(null)
  // 当前选中元素的 name
  const [active, setActive] = useState<any>()

  // 预览表单 form
  const [mainForm, setMainForm] = useState<FormProps>({
    labelAlign: 'right',
    layout: 'horizontal',
    labelCol: { span: 0, offset: 0 },
    wrapperCol: { span: 0, offset: 0 }
  })
  // 预览表单 items
  const [mainItems, setMainItems] = useState<MyFormItems[]>([])
  // 预览表单 layout
  const [mainLayout, setMainLayout] = useState<number[]>([1])
  // 预览表单 gutter
  const [mainGutter, setMainGutter] = useState<[Gutter, Gutter]>([0, 0])

  // 配置表单 items
  const [optItems, setOptItems] = useState<MyFormItems[]>([])
  // 全局配置表单实例
  const [gOptForm] = useForm()

  useEffect(() => {
    // 初始化配置
    initOption()
    // 回显
    if (initValue) {
      // 添加预览表单 form
      setMainForm(mf => {
        initValue.form?.labelAlign && (mf.labelAlign = initValue.form.labelAlign)
        initValue.form?.layout && (mf.layout = initValue.form.layout)
        initValue.form?.labelCol?.span && (mf.labelCol!.span = initValue.form.labelCol.span)
        initValue.form?.labelCol?.offset && (mf.labelCol!.offset = initValue.form.labelCol.offset)
        initValue.form?.wrapperCol?.span && (mf.wrapperCol!.span = initValue.form.wrapperCol.span)
        initValue.form?.wrapperCol?.offset && (mf.wrapperCol!.offset = initValue.form.wrapperCol.offset)
        return JSON.parse(JSON.stringify(mf))
      })
      // 添加预览表单 layout
      initValue.layout && setMainLayout(initValue.layout)
      // 添加预览表单 gutter
      setMainGutter(mg => {
        initValue.gutter?.[0] && (mg[0] = initValue.gutter[0])
        initValue.gutter?.[1] && (mg[1] = initValue.gutter[1])
        return [...mg]
      })
      // 添加预览表单 items
      initValue.items && setMainItems(initValue.items)
    }
  }, [initValue])

  const handleDragStart = (e, data?: MyFormItems) => {
    if (data) {
      e.dataTransfer.setData("text/plain", JSON.stringify(data))
      setActive(data?.item?.name || data?.list?.name)
    } else {
      setMainItems(pre => {
        // 确保每次拖拽开始时，传递的都是最新的数据
        e.dataTransfer.setData("text/plain", JSON.stringify(pre[getIndex(e.target)]))
        return pre
      })
    }
  }

  const handleDrag = e => {
    // 排序拖拽时，鼠标速度太快会不触发 dragOver，所以须在 drag 里删除元素
    // 排序拖拽时，在 dragStart 也不能删除元素，所以只能在 drag 里删除元素
    setMainItems(pre => {
      pre.splice(getIndex(e.target), 1)
      return [...pre]
    })
    initOption()
  }

  const handleDragOver = e => {
    e.preventDefault()
    if (e.target !== dragBoxRef.current) {
      const target = H / 2 > e.nativeEvent.offsetY ? e.target : e.target.nextElementSibling
      addTranslate(target)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    const data = JSON.parse(e.dataTransfer.getData("text/plain"))
    let index = 0
    if (e.target !== dragBoxRef.current) {
      const el = H / 2 > e.nativeEvent.offsetY ? e.target : e.target.nextElementSibling
      index = el ? getIndex(el) : dragBoxRef.current!.childElementCount
    } else {
      const num = Math.floor(e.nativeEvent.offsetY / H)
      index = num > dragBoxRef.current!.childElementCount ? dragBoxRef.current!.childElementCount : num
    }
    // 添加预览表单项
    setMainItems(main => {
      main.splice(index, 0, data)
      // 清除位移
      clearTranslate(true)
      // 添加配置表单项
      addOption(index, main[index])
      return [...main]
    })
  }

  const handleDragLeave = e => {
    if (e.relatedTarget?.className.includes('ml_main') || e.relatedTarget?.className.includes('field-item')) return
    clearTranslate()
  }

  const addTranslate = (el: HTMLElement) => {
    // 元素不存在只可能是移到最底下
    if (!el) return clearTranslate()
    // 先清空之前元素平移
    let temp = el.previousElementSibling as HTMLElement
    while (temp) {
      temp.style.transition = 'all .2s'
      temp.style.transform = 'translateY(0)'
      temp = temp.previousElementSibling as HTMLElement
    }
    // 再设置当前及之后元素平移
    while (el) {
      el.style.transition = 'all .2s'
      el.style.transform = `translateY(${H}px)`
      el = el.nextElementSibling as HTMLElement
    }
  }

  const clearTranslate = (noAnima?: boolean) => dragBoxRef.current?.childNodes.forEach((c: any) => {
    noAnima && (c.style.transition = '')
    c.style.transform = 'translateY(0)'
  })

  const addOption = (index: number, data: MyFormItems) => {
    initOption()
    const key: string[] = []
    Object.keys(data).forEach(k => {
      if (k === 'item' || k === 'option' || k === 'list')
        key.push(...Object.keys(data[k]))
      else if (k !== 'type')
        key.push(k)
    })
    setOptItems(preOI => {
      formOption(key, index, data, preOI, setMainItems)
      return [...preOI]
    })
  }

  const initOption = () => {
    dragBoxRef.current?.childNodes.forEach((c: any) => c.classList.remove('active'))
    setOptItems([])
  }

  /** 获取 html 元素在当前父节点中的 index 值 */
  const getIndex = (el: HTMLElement) => {
    let index = 0
    while (el.previousElementSibling) {
      index++
      el = el.previousElementSibling as HTMLElement
    }
    return index
  }

  const gOptItems: MyFormItems[] = [
    {
      type: 'radio',
      item: { label: '标签对齐', name: 'labelAlign', initialValue: initValue?.form?.labelAlign || 'right' },
      option: {
        optionType: 'button',
        options: [
          { label: 'right', value: 'right' },
          { label: 'left', value: 'left' }
        ]
      }
    },
    {
      type: 'number',
      item: { label: '标签栅格', name: 'labelCol_span', initialValue: initValue?.form?.labelCol?.span || 0 },
      option: { max: 24, min: 0 }
    },
    {
      type: 'number',
      item: { label: '标签偏移', name: 'labelCol_offset', initialValue: initValue?.form?.labelCol?.offset || 0 },
      option: { max: 24, min: 0 }
    },
    {
      type: 'number',
      item: { label: '控件栅格', name: 'wrapperCol_span', initialValue: initValue?.form?.wrapperCol?.span || 0 },
      option: { max: 24, min: 0 }
    },
    {
      type: 'number',
      item: { label: '控件偏移', name: 'wrapperCol_offset', initialValue: initValue?.form?.wrapperCol?.offset || 0 },
      option: { max: 24, min: 0 }
    },
    {
      type: 'radio',
      item: { label: '布局', name: 'layout', initialValue: initValue?.form?.layout || 'horizontal' },
      option: {
        optionType: 'button',
        options: [
          { label: 'horizontal', value: 'horizontal' },
          { label: 'vertical', value: 'vertical' },
          { label: 'inline', value: 'inline' }
        ]
      }
    },
    {
      type: 'number',
      item: { label: '列数', name: 'layout_col', initialValue: initValue?.layout?.[0] || 1 }
    },
    {
      type: 'number',
      item: { label: '水平间隔', name: 'gutter_row', initialValue: initValue?.gutter?.[0] || 0 }
    },
    {
      type: 'number',
      item: { label: '垂直间隔', name: 'gutter_col', initialValue: initValue?.gutter?.[1] || 0 }
    }
  ]

  const handleGOptFormValuesChange = v => {
    v.layout_col && setMainLayout([v.layout_col])
    setMainForm(mf => {
      v.labelAlign && (mf.labelAlign = v.labelAlign)
      v.labelCol_span && (mf.labelCol!.span = v.labelCol_span)
      v.labelCol_offset && (mf.labelCol!.offset = v.labelCol_offset)
      v.wrapperCol_span && (mf.wrapperCol!.span = v.wrapperCol_span)
      v.wrapperCol_offset && (mf.wrapperCol!.offset = v.wrapperCol_offset)
      v.layout && (mf.layout = v.layout)
      return JSON.parse(JSON.stringify(mf))
    })
    setMainGutter(mg => {
      v.gutter_row && (mg[0] = v.gutter_row)
      v.gutter_col && (mg[1] = v.gutter_col)
      return [...mg]
    })
  }

  const exportJSON = () => gOptForm.validateFields().then(v => {
    // 全局配置表单固定，可以通过实例直接拿到值
    const myFormProps: MyFormProps = {
      form: {
        labelAlign: v.labelAlign,
        layout: v.layout,
        labelCol: { span: v.labelCol_span, offset: v.labelCol_offset },
        wrapperCol: { span: v.wrapperCol_span, offset: v.wrapperCol_offset }
      },
      items: mainItems, // 私有的配置则用特殊的方式拿到
      layout: [v.layout_col],
      gutter: [v.gutter_row, v.gutter_col]
    }
    onFinish?.(myFormProps)
  })

  return (
    <div className="form-design">
      <div className="form-field">
        <span className='form-design-title'>表单字段</span>
        {
          formField.map(f => {
            f.item && (f.item.name = `${f.type}_${uid()}`)
            f.list && (f.list.name = `${f.type}_${uid()}`)
            return <div className='field-item' key={f.type} draggable={true} onDragStart={se => handleDragStart(se, f)}>{f.innerHtml || f.item?.label || f.list?.label}</div>
          })
        }
      </div>
      <div className="middle">
        <div className='m_head'>
          <Button type='primary' onClick={exportJSON}>提交配置</Button>
        </div>
        <div className='m_content'>
          <div className="m_left">
            <span className='form-design-title'>拖放区</span>
            <div className='ml_main' ref={dragBoxRef} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
              {
                mainItems.map((v, i) => {
                  const obj = v.type === 'list' ? v.list : v.item
                  return <div
                    key={obj?.name as string}
                    className={`field-item ${obj?.name === active && 'active'}`}
                    onClick={() => { setActive(obj?.name); addOption(i, v) }}
                    draggable={true}
                    onDragStart={e => { setActive(obj?.name); handleDragStart(e) }}
                    onDrag={e => handleDrag(e)}
                  >
                    {v.innerHtml || obj?.label}
                  </div>
                })
              }
            </div>
          </div>
          <div className="m_right">
            <span className='form-design-title'>预览区</span>
            <MyForm form={mainForm} items={mainItems} layout={mainLayout} gutter={mainGutter} />
          </div>
        </div>
      </div>
      <div className="form-option">
        <Collapse defaultActiveKey={['1', '2']}>
          <Collapse.Panel header="全局布局" key="1">
            <MyForm form={{ layout: 'inline', labelCol: { span: 5 }, form: gOptForm, onValuesChange: handleGOptFormValuesChange }} items={gOptItems} layout={[1]} gutter={[0, 10]} />
          </Collapse.Panel>
          <Collapse.Panel header="表单配置" key="2">
            <MyForm form={{ layout: 'inline' }} items={optItems} layout={[1]} gutter={[0, 10]} />
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  )

}

export default FormDesign

/**
 * 表单设计器
 * @param initValue 初始值
 * @param onFinish 完成配置时触发事件
 */
export interface FormDesignProps {
  initValue?: MyFormProps
  onFinish?: (value: MyFormProps) => void
}