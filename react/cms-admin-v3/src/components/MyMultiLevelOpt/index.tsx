import { useEffect, useState } from 'react'
import { Cascader, TreeSelect } from 'antd'

import './index.css'
import { OptionModel } from '@/api/adminService'
import { getCacheDataByUrl, getCategoryOptionByCode } from '@/utils/dictUtils'

export default function MyMultiLevelOpt({ type = 'cascader', url, code, option, split, selectFirst, value, onChange }: MyMultiLevelOptProps) {

  const [options, setOptions] = useState<OptionModel[]>([])
  const [innerValue, setInnerValue] = useState<any>()
  const [outerValue, setOuterValue] = useState<string | string[]>()

  useEffect(() => {
    let v = typeof value === 'number' ? value.toString() : value;
    if (v !== outerValue) {
      let innerV = typeof v === 'string' ? v.split(split || ',') : v;
      if (type === 'treeselect') {
        if (Array.isArray(innerV) && innerV.length > 0) {
          innerV = innerV[innerV.length - 1]
        } else {
          innerV = undefined;
        }
      }
      setOuterValue(v);
      setInnerValue(innerV);
    }
  }, [value])

  useEffect(() => {
    if (url)
      getCacheDataByUrl(url).then((res: OptionModel) => {
        setOptions(res?.children || [])
        selectFirst && setFirstValue(res)

      })
    else
      getCategoryOptionByCode(code).then(res => {
        setOptions(res?.children || [])
        selectFirst && setFirstValue(res)
      })
  }, [])

  const setFirstValue = (v: OptionModel) => {
    const value = findFirstChild(v)
    setInnerValue(value)
    const ov = splitValue(value);
    setOuterValue(ov);
    onChange?.(ov);
  }

  const handleChange = e => {
    setInnerValue(e);
    type === 'treeselect' && (e = findParent(e, options));
    const ov = splitValue(e);
    setOuterValue(ov);
    onChange?.(ov);
  }

  const splitValue = (v: string[]) => split ? v.join(split) : v

  // 根据 value 找出所有父级元素的 value
  const findParent = (value: string, data: OptionModel[]) => {
    let flag = false
    const values: string[] = []
    sub(value, 0, data)
    return values
    function sub(value: string, index: number, data: OptionModel[]) {
      for (const v of data) {
        if (flag) return
        values.splice(index)
        values[index] = v.value!
        if (v.value === value) flag = true
        v.children && sub(value, index + 1, v.children)
      }
    }
  }

  // 获取第一个子值
  const findFirstChild = (data: OptionModel) => {
    const values: string[] = []
    sub(data.children!)
    function sub(data: OptionModel[]) {
      values.push(data[0].value!)
      data[0].children && sub(data[0].children)
    }
    return values
  }


  return (
    <>
      {
        type === 'cascader' ? <Cascader changeOnSelect={true} options={options} {...option} value={innerValue} onChange={handleChange} /> :
          type === 'treeselect' ? <TreeSelect treeData={options} {...option} value={innerValue} onChange={handleChange} /> :
            ''
      }
    </>
  )

}

/**
 * 多级选项组件
 * @param type 表单类型
 * @param url 外部链接
 * @param code 字典编码
 * @param option 相应表单的 Props
 * @param split 分隔符，当数据格式为 string 时，必须传分隔符
 * @param selectFirst 是否默认选中第一个
 * @param value 值
 * @param onChange 值改变时事件
 */
export interface MyMultiLevelOptProps {
  type: 'cascader' | 'treeselect'
  url?: string
  code?: string
  option?: any
  split?: string
  selectFirst?: boolean
  value?: any
  onChange?: (value: string[] | string) => void
}