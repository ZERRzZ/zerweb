import { ReactNode, useEffect, useState } from "react"
import { Col, ColorPicker, FormItemProps, FormProps, Row } from 'antd'
import { Form, Input, InputNumber, Mentions, Radio, Checkbox, Rate, Select, Cascader, Slider, Switch, Upload, Button } from "antd"
import { Gutter } from "antd/es/grid/row"
import { DownCircleOutlined, MinusCircleOutlined, PlusOutlined, UpCircleOutlined } from "@ant-design/icons"

import './index.scss'
import MyCron from "../MyCron"
import MyCode from "../MyCode"
import MyEditor from "../MyEditor"
import MyUpload from "../MyUpload"
import { MyTimeDate } from "./MyTimeDate"
import MyOneLevelOpt from "../MyOneLevelOpt"
import MyMultiLevelOpt from "../MyMultiLevelOpt"
import MyImageUpload from "../MyUpload/MyImageUpload"
import MyVideoUpload from "../MyUpload/MyVideoUpload"
import MyDocUpload from "../MyUpload/MyDocUpload"
import MyFileUpload from "../MyUpload/MyFileUpload"
import { findCascaderNameByValue, getCategoryNameByValue, getDictNameByValue } from "@/utils/dictUtils"

function ViewItem({ type, value, option }: { type?: MyFormType; value?: any; option?: any }) {

  const [showValue, setShowValue] = useState('');

  useEffect(() => {
    if (value && type === 'oneLevelOpt') {
      getDictNameByValue(option.code, value).then(res => {
        setShowValue(res);
      });
    } else if (value && type === 'multiLevelOpt') {
      getCategoryNameByValue(option.code, value, option.split).then(res => {
        setShowValue(res);
      });
    } else if (value && type === 'select' && option && option.options) {
      if (Array.isArray(value)) {
        setShowValue(option.options.filter(o => value.includes(o.value)).join('，'));
      } else {
        setShowValue(option.options.find(o => o.value === value)?.label || '');
      }
    } else if (value && type === 'cascader' && option && option.options) {
      setShowValue(findCascaderNameByValue(option.options, value));
    }
  }, [value])

  switch (type) {
    case 'editor':
      return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
    case 'oneLevelOpt':
    case 'multiLevelOpt':
    case 'select':
      return <span style={{ lineHeight: '32px' }}>{showValue}</span>;
    default:
      return <span style={{ lineHeight: '32px' }}>{value}</span>;
  }
}

export default function MyForm({ form, items, layout, gutter, readonly }: MyFormProps) {
  // 每行列数
  const getSpan = (index: number) => {
    if (!layout) return
    const col: number[] = []
    layout.forEach(v => {
      let i = 0
      while (i++ < v) col.push(v)
    })
    return Math.ceil(24 / (col[index] || col[col.length - 1]))
  }

  const render = (v: MyFormItems) => {
    switch (v.type) {
      case 'text': return readonly ? <ViewItem /> : <Input {...v.option} />
      case 'password': return readonly ? <ViewItem /> : <Input.Password autoComplete="new-password" {...v.option} />
      case 'textarea': return readonly ? <ViewItem /> : <Input.TextArea {...v.option} />
      case 'number': return readonly ? <ViewItem /> : <InputNumber {...v.option} />
      case 'mention': return readonly ? <ViewItem /> : <Mentions {...v.option} />
      case 'cron': return readonly ? <ViewItem /> : <MyCron {...v.option} />
      case 'radio': return readonly ? <Radio.Group {...v.option} disabled /> : <Radio.Group {...v.option} />
      case 'checkbox': return readonly ? <Checkbox.Group {...v.option} disabled /> : <Checkbox.Group {...v.option} />
      case 'rate': return readonly ? <Rate {...v.option} disabled /> : <Rate {...v.option} />
      case 'select': return readonly ? <ViewItem type={v.type} option={v.option} /> : <Select allowClear={true} filterOption={(input, option) =>
        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
      } {...v.option} />
      case 'cascader': return readonly ? <ViewItem type={v.type} option={v.option} /> : <Cascader {...v.option} />
      case 'slider': return readonly ? <Slider {...v.option} disabled /> : <Slider {...v.option} />
      case 'switch': return readonly ? <Switch {...v.option} disabled /> : <Switch {...v.option} />
      case 'oneLevelOpt': return readonly ? <ViewItem type={v.type} option={v.option} /> : <MyOneLevelOpt {...v.option} />
      case 'multiLevelOpt': return readonly ? <ViewItem type={v.type} option={v.option} /> : <MyMultiLevelOpt {...v.option} />
      case 'upload': return readonly ? <Upload {...v.option} disabled>{v.innerHtml}</Upload> : <Upload {...v.option}>{v.innerHtml}</Upload>
      case 'myUpload': return readonly ? <MyUpload {...v.option} disabled>{v.innerHtml}</MyUpload> : <MyUpload {...v.option}>{v.innerHtml}</MyUpload>
      case 'myImageUpload': return readonly ? <MyImageUpload {...v.option} disabled>{v.innerHtml}</MyImageUpload> : <MyImageUpload {...v.option}>{v.innerHtml}</MyImageUpload>
      case 'myVideoUpload': return readonly ? <MyVideoUpload {...v.option} disabled>{v.innerHtml}</MyVideoUpload> : <MyVideoUpload {...v.option}>{v.innerHtml}</MyVideoUpload>
      case 'myDocUpload': return readonly ? <MyDocUpload {...v.option} disabled>{v.innerHtml}</MyDocUpload> : <MyDocUpload {...v.option}>{v.innerHtml}</MyDocUpload>
      case 'myFileUpload': return readonly ? <MyFileUpload {...v.option} disabled>{v.innerHtml}</MyFileUpload> : <MyFileUpload {...v.option}>{v.innerHtml}</MyFileUpload>
      case 'button': return <Button {...v.option}>{v.innerHtml}</Button>
      case 'custom': return v.innerHtml
      case 'submit': return <Button htmlType='submit' type="primary" {...v.option}>{v.innerHtml || '提交'}</Button>
      case 'reset': return <Button htmlType="reset" {...v.option}>{v.innerHtml || '重置'}</Button>
      case 'year':
      case 'month':
      case 'date':
      case 'time':
      case 'dateTime':
      case 'yearRange':
      case 'monthRange':
      case 'dateRange':
      case 'timeRange':
      case 'dateTimeRange': return readonly ? <ViewItem /> : <MyTimeDate type={v.type} option={v.option} />
      case 'editor': return readonly ? <ViewItem type={v.type} /> : <MyEditor {...v.option} />
      case 'code': return readonly ? <ViewItem type={v.type} /> : <MyCode {...v.option} />
      case 'color': return readonly ? <ViewItem type={v.type} /> : <ColorPicker format="hex" {...v.option} />
    }
  }

  return (
    <Form {...form} className={readonly ? 'my-form-readonly' : undefined}>
      <Row gutter={gutter}>
        {
          items?.map((v, i) =>
            v.hidden || <Col key={i} span={v.span || getSpan(i)}>
              {
                v.type !== 'list' ?
                  <Form.Item valuePropName={v.type === 'switch' ? 'checked' : undefined} {...v.item}>{render(v)}</Form.Item> :
                  <Form.List name={v.list!.name} initialValue={v.list?.initialValue} rules={v.list?.rules}>
                    {
                      (fields, { add, remove, move }, { errors }) =>
                        <Form.Item label={v.list?.label} tooltip={v.list?.tooltip}>
                          {
                            fields.map(({ key, name, ...field }, index) =>
                              <div className="formList" key={key}>
                                {
                                  v.list?.items?.map((vv, ii) => vv.hidden || <Form.Item valuePropName={vv.type === 'switch' ? 'checked' : undefined} {...field} {...vv.item} key={ii} name={[name, vv.item?.name as any]} label={index === 0 && vv.item?.label}>{render(vv)}</Form.Item>)
                                }
                                {
                                  readonly ? undefined : <>
                                    <MinusCircleOutlined className={`handleBtn ${index === 0 && 'firstBtn'}`} onClick={() => remove(name)} />
                                    {
                                      v.list?.notMove ? undefined : <>
                                        <UpCircleOutlined className={`handleBtn ${index === 0 && 'firstBtn'}`} onClick={() => move(index, index - 1)} />
                                        <DownCircleOutlined className={`handleBtn ${index === 0 && 'firstBtn'}`} onClick={() => move(index, index + 1)} />
                                      </>
                                    }
                                  </>
                                }

                              </div>
                            )
                          }
                          {
                            readonly ? undefined : <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} />
                          }
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                    }
                  </Form.List>
              }
            </Col>
          )
        }
      </Row>
    </Form>
  )

}

/**
 * 我的表单
 * @param form 生成的 Form 标签的 Props
 * @param items 每项表单配置
 * @param layout 布局，设置每行列数，不传则不使用栅格布局
 * @param gutter 每项表单的间距
 */
export interface MyFormProps {
  form?: FormProps
  items?: Array<MyFormItems>
  layout?: Array<number>
  gutter?: Gutter | [Gutter, Gutter]
  readonly?: boolean
}

/**
 * 我的表单表单项
 * @param type 表单类型
 * @param item 生成的 Form.Item 标签的 Props
 * @param list 当 type = 'list' 时你应该配置 list 项而不是 item 项
 * @param option 生成的相应表单标签的 Props
 * @param innerHtml 表单的 innerHtml 和自定义表单内容
 * @param span 栅格化布局 span 的值
 * @param hidden 隐藏
 */
export interface MyFormItems {
  type: MyFormType
  item?: FormItemProps
  list?: MyFormList
  option?: any
  innerHtml?: ReactNode
  span?: number
  hidden?: boolean
}

/**
 * 我的表单表单项类型
 */
export type MyFormType =
  'text' | 'password' | 'textarea' | 'number' | 'mention' | 'cron' |
  'radio' | 'checkbox' | 'rate' | 'select' | 'cascader' | 'slider' | 'switch' |
  'year' | 'month' | 'date' | 'time' | 'dateTime' |
  'yearRange' | 'monthRange' | 'dateRange' | 'timeRange' | 'dateTimeRange' |
  'upload' | 'myUpload' | 'myImageUpload' | 'myVideoUpload' | 'myDocUpload' | 'myFileUpload' |
  'button' | 'submit' | 'reset' |
  'custom' | 'oneLevelOpt' | 'multiLevelOpt' |
  'list' | 'editor' | 'code' | 'color'

/**
 * 我的表单 list 表单项
 * @param name 字段 key 值
 * @param label 标签名
 * @param tooltip 配置提示信息
 * @param rules 整体校验，必须是自定义校验
 * @param initialValue 初始值
 * @param notMove 是否显示上移下移
 * @param items list 中的表单
 */
export interface MyFormList {
  name: string
  label?: string
  tooltip?: string
  rules?: any[]
  initialValue?: any[]
  notMove?: boolean
  items?: Array<MyFormItems>
}