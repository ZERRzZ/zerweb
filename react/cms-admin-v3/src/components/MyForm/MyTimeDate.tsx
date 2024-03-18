import { useState } from "react"
import { DatePicker, TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"

/** 时间, 日期, 范围选择将数据格式改为字符串形式 */

export function MyTimeDate({ type, option, value, onChange }: MyTimeDateProps) {

  const [date, setDate] = useState<Dayjs | [Dayjs, Dayjs]>()

  // 将传入的字符串形式数据转为 Dayjs 格式
  const getValue = value => {
    switch (type) {
      case 'year':
      case 'month':
      case 'date':
      case 'dateTime': return dayjs(value)
      case 'time': return dayjs(value, 'HH:mm:ss')
      case 'yearRange':
      case 'monthRange':
      case 'dateRange':
      case 'dateTimeRange': return [dayjs(value[0]), dayjs(value[1])]
      case 'timeRange': return [dayjs(value[0], 'HH:mm:ss'), dayjs(value[1], 'HH:mm:ss')]
    }
  }

  // 数据格式化
  const valueFormat = value => {
    setDate(value)
    switch (type) {
      case 'year': onChange?.(value && value.format('YYYY')); break;
      case 'month': onChange?.(value && value.format('YYYY-MM')); break;
      case 'date': onChange?.(value && value.format('YYYY-MM-DD')); break;
      case 'time': onChange?.(value && value.format('HH:mm:ss')); break;
      case 'dateTime': onChange?.(value && value.format('YYYY-MM-DD HH:mm:ss')); break;
      case 'yearRange': onChange?.(value && [value[0].format('YYYY'), value[1].format('YYYY')]); break;
      case 'monthRange': onChange?.(value && [value[0].format('YYYY-MM'), value[1].format('YYYY-MM')]); break;
      case 'dateRange': onChange?.(value && [value[0].format('YYYY-MM-DD'), value[1].format('YYYY-MM-DD')]); break;
      case 'timeRange': onChange?.(value && [value[0].format('HH:mm:ss'), value[1].format('HH:mm:ss')]); break;
      case 'dateTimeRange': onChange?.(value && [value[0].format('YYYY-MM-DD HH:mm:ss'), value[1].format('YYYY-MM-DD HH:mm:ss')]); break;
    }
  }

  return (
    type === 'year' ? <DatePicker value={value ? getValue(value) : date} onChange={valueFormat} picker="year"  {...option} /> :
      type === 'month' ? <DatePicker value={value ? getValue(value) : date} onChange={valueFormat} picker="month" {...option} /> :
        type === 'date' ? <DatePicker value={value ? getValue(value) : date} onChange={valueFormat} {...option} /> :
          type === 'time' ? <TimePicker value={value ? getValue(value) : date} onChange={valueFormat} {...option} /> :
            type === 'dateTime' ? <DatePicker value={value ? getValue(value) : date} onChange={valueFormat} showTime='true' {...option} /> :
              type === 'yearRange' ? <DatePicker.RangePicker value={value ? getValue(value) : date} onChange={valueFormat} picker='year' {...option} /> :
                type === 'monthRange' ? <DatePicker.RangePicker value={value ? getValue(value) : date} onChange={valueFormat} picker='month' {...option} /> :
                  type === 'dateRange' ? <DatePicker.RangePicker value={value ? getValue(value) : date} onChange={valueFormat} {...option} /> :
                    type === 'timeRange' ? <TimePicker.RangePicker value={value ? getValue(value) : date} onChange={valueFormat} {...option} /> :
                      type === 'dateTimeRange' ? <DatePicker.RangePicker value={value ? getValue(value) : date} onChange={valueFormat} showTime='true' {...option} /> :
                        <></>
  )

}

/** 
 * 时间, 日期, 范围选择器
 * @param type 类型
 * @param option 所用标签的 Props
 * @param value 值
 * @param onChange 值改变事件
 */
export interface MyTimeDateProps {
  type: 'year' | 'month' | 'date' | 'time' | 'dateTime' | 'yearRange' | 'monthRange' | 'dateRange' | 'timeRange' | 'dateTimeRange'
  option?: any
  value?: string | [string, string]
  onChange?: (value: string | [string, string]) => void
}