import QnnCron from 'qnn-react-cron'
import parser from 'cron-parser'

import './index.css'
import { useState } from "react";
import { Button, Input, Modal } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function MyCron({ option, value, onChange }: MyCronProps) {

  let [cronRef] = useState<any>()
  const [localValue, setLocalValue] = useState('')
  const [cronShow, setCronShow] = useState(false)

  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('')
  const [second, setSecond] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [week, setWeek] = useState('')
  const [temp, setTemp] = useState('')

  const [datestr, setDatestr] = useState<string[]>([])

  const handleCronOpen = () => {
    setCronShow(true)
    setOtherVal(value || localValue)
    setTenDates(value || localValue)
  }

  const handleCronFinish = (v: string) => {
    setOtherVal(v)
    setTenDates(v)
  }

  const handleCronOk = (v: string) => {
    setLocalValue(v)
    onChange?.(v)
    setOtherVal(v)
    setTenDates(v)
    setCronShow(false)
  }

  const handelInputOnChange = v => {
    setLocalValue(v.target.value)
    onChange?.(v.target.value)
    setOtherVal(v.target.value)
    setTenDates(v.target.value)
  }

  const setOtherVal = (v: string) => {
    setSecond(v.split(' ')[0])
    setMinute(v.split(' ')[1])
    setHour(v.split(' ')[2])
    setDay(v.split(' ')[3])
    setMonth(v.split(' ')[4])
    setWeek(v.split(' ')[5])
    setYear(v.split(' ')[6])
    setTemp(v)
  }

  const setTenDates = (cron: string) => {
    cron = cron.split(' ').slice(0, -1).join(' ')
    const temp = parser.parseExpression(cron)
    setDatestr(str => {
      str = []
      for (let i = 0; i < 10; i++)
        str.push(dayjs(temp.next().toString()).format('YYYY-MM-DD HH:mm:ss'))
      return [...str]
    })
  }

  return (
    <>
      <Input value={value || localValue} onChange={handelInputOnChange} {...option} addonAfter={<SettingOutlined onClick={handleCronOpen} />} />
      <Modal width={800} open={cronShow} footer={null} onCancel={() => setCronShow(false)}>
        <QnnCron
          value={value || localValue}
          getCronFns={fns => cronRef = fns}
          footer={
            <>
              <Button type="primary" style={{ width: 64 }} onClick={() => handleCronFinish(cronRef.getValue())}>生成</Button>
              <div className="extraBox">
                <div className="flexbox">
                  <Input readOnly addonBefore={'秒'} style={{ marginBottom: '.5em', flexBasis: '33%' }} value={second} />
                  <Input readOnly addonBefore={'分'} style={{ marginBottom: '.5em', flexBasis: '33%' }} value={minute} />
                  <Input readOnly addonBefore={'时'} style={{ marginBottom: '.5em', flexBasis: '32%' }} value={hour} />
                  <Input readOnly addonBefore={'日'} style={{ marginBottom: '.5em', flexBasis: '33%' }} value={day} />
                  <Input readOnly addonBefore={'月'} style={{ marginBottom: '.5em', flexBasis: '33%' }} value={month} />
                  <Input readOnly addonBefore={'周'} style={{ marginBottom: '.5em', flexBasis: '32%' }} value={week} />
                  <Input readOnly addonBefore={'年'} style={{ marginBottom: '.5em', flexBasis: '33%' }} value={year} />
                  <Input readOnly addonBefore={'式'} style={{ marginBottom: '.5em', flexBasis: '66%' }} value={temp} />
                </div>
                <div className="tenYearBox">
                  <span>近十次执行时间（不含年）：</span>
                  <div>
                    {
                      datestr.map(v => <div key={v}>{v}</div>)
                    }
                  </div>
                </div>
              </div>
              <div className="cronbtns">
                <Button onClick={() => setCronShow(false)}>取消</Button>
                <Button type="primary" onClick={() => handleCronOk(cronRef.getValue())}>确认</Button>
              </div>
            </>
          }
        />
      </Modal>
    </>
  )

}

/**
 * Cron 编辑组件
 * @param option 输入框配置
 * @param value 值
 * @param onChange 值改变
 */
export interface MyCronProps {
  option?: any
  value?: string
  onChange?: (value: string) => void
}