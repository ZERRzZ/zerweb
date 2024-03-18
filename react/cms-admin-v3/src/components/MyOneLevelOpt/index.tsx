import { useEffect, useState } from 'react'
import { Checkbox, Radio, Select } from 'antd'

import './index.css'
import { OptionModel } from '@/api/adminService'
import { getCacheDataByUrl, getDictOptionByCode } from '@/utils/dictUtils'

export default function MyOneLevelOpt({ type = 'select', url, code, option, value, onChange }: MyOneLevelOptProps) {

  const [options, setOptions] = useState<OptionModel[]>([])
  const [innerValue, setInnerValue] = useState<any>()
  const [outerValue, setOuterValue] = useState<string>()

  useEffect(() => {
    if (url)
      getCacheDataByUrl(url).then((res: OptionModel[]) => setOptions(res))
    else
      code && getDictOptionByCode(code).then(res => setOptions(res))
  }, [])

  useEffect(() => {
    let v = (value === undefined || value === null) ? undefined : value.toString();
    if (v !== outerValue) {
      setOuterValue(v);
      setInnerValue(v === undefined ? undefined : v.split(','));
    }
  }, [value])

  const handleChange = v => {
    if (type === 'radio') {
      setInnerValue(v.target.value)
      setOuterValue(v.target.value)
      onChange?.(v.target.value)
    } else {
      setInnerValue(v)
      let valueString = Array.isArray(v) ? v.join(',') : v;
      setOuterValue(valueString)
      onChange?.(valueString)
    }
  }

  return (
    <>
      {
        type === 'radio' ? <Radio.Group options={options} {...option} value={innerValue} onChange={handleChange} /> :
          type === 'checkbox' ? <Checkbox.Group options={options} {...option} value={innerValue} onChange={handleChange} /> :
            type === 'select' ? <Select allowClear={true} options={options} {...option} value={innerValue} onChange={handleChange} filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            } /> :
              ''
      }
    </>
  )
}

/**
 * 一级选项组件
 * @param type 表单类型
 * @param url 外部链接
 * @param code 字典编码
 * @param option 相应表单的 Props
 * @param value 值
 * @param onChange 值改变时事件
 */
export interface MyOneLevelOptProps {
  type: 'radio' | 'checkbox' | 'select'
  url?: string
  code?: string
  option?: any
  value?: string
  onChange?: (value: string) => void
}