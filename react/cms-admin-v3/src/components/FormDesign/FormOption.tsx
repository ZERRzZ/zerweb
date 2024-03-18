import { Modal } from "antd";

import FormDesign from ".";
import MyOptions from "./MyOptions";
import { MyFormItems, MyFormType } from "@/components/MyForm";

// 私有配置项的添加方法
export const formOption = (key: string[], index: number, main: MyFormItems, opt: MyFormItems[], setMainItems: React.Dispatch<React.SetStateAction<MyFormItems[]>>) => {

  key.forEach(k => {

    if (k === 'label')
      main.type !== 'list' ?
        opt.push(
          template('text', '标签 label', `${main.item?.name}_label`, main.item?.label, e => setMainItems(v => {
            v[index].item!.label = e.target.value
            return [...v]
          }))
        ) :
        opt.push(
          template('text', '标签 label', `${main.list?.name}_label`, main.list?.label, e => setMainItems(v => {
            v[index].list!.label = e.target.value
            return [...v]
          }))
        )

    else if (k === 'name')
      main.type !== 'list' ?
        opt.push(
          template('text', '键值 name', `${main.item?.name}_name`, main.item?.name, e => setMainItems(v => {
            v[index].item!.name = e.target.value
            return [...v]
          }))
        ) :
        opt.push(
          template('text', '键值 name', `${main.list?.name}_name`, main.list?.name, e => setMainItems(v => {
            v[index].list!.name = e.target.value
            return [...v]
          }))
        )

    else if (k === 'initialValue')
      opt.push(
        template('text', '默认值', `${main.item?.name}_initialValue`, main.item?.initialValue, e => setMainItems(v => {
          v[index].item!.initialValue = e.target.value
          return [...v]
        }))
      )

    else if (k === 'rules')
      opt.push(
        template('text', '必需校验信息', `${main.item?.name}_rules`, main.item?.rules?.[0]?.['message'], e => setMainItems(v => {
          v[index].item!.rules = e.target.value ? [{ required: true, message: e.target.value }] : [{ required: false }]
          return [...v]
        }))
      )

    else if (k === 'span')
      opt.push(
        template('number', '栅格', `${main.item?.name}_span`, main.span, e => setMainItems(v => {
          v[index].span = e
          return [...v]
        }), { max: 24, min: 0 })
      )

    else if (k === 'placeholder')
      opt.push(
        template('text', '预置 placeholder', `${main.item?.name}_placeholder`, main.option.placeholder, e => setMainItems(v => {
          v[index].option.placeholder = e.target.value
          return [...v]
        }))
      )

    else if (k === 'rows')
      opt.push(
        template('number', '行数', `${main.item?.name}_rows`, main.option.rows, e => setMainItems(v => {
          v[index].option.rows = e
          return [...v]
        }))
      )

    else if (k === 'showCount')
      opt.push(
        template('switch', '显示字数', `${main.item?.name}_showCount`, main.option.showCount, e => setMainItems(v => {
          v[index].option.showCount = e
          return [...v]
        }))
      )

    else if (k === 'maxLength')
      opt.push(
        template('number', '最大字数', `${main.item?.name}_maxLength`, main.option.maxLength, e => setMainItems(v => {
          v[index].option.maxLength = e
          return [...v]
        }))
      )

    else if (k === 'controls')
      opt.push(
        template('switch', '显示控制按钮', `${main.item?.name}_controls`, main.option.controls, e => setMainItems(v => {
          v[index].option.controls = e
          return [...v]
        }))
      )

    else if (k === 'min')
      opt.push(
        template('number', '最小值', `${main.item?.name}_min`, main.option.min, e => setMainItems(v => {
          v[index].option.min = e
          return [...v]
        }))
      )

    else if (k === 'max')
      opt.push(
        template('number', '最大值', `${main.item?.name}_max`, main.option.max, e => setMainItems(v => {
          v[index].option.max = e
          return [...v]
        }))
      )

    else if (k === 'prefix')
      opt.push(
        template('text', '触发关键字', `${main.item?.name}_prefix`, main.option.prefix, e => setMainItems(v => {
          v[index].option.prefix = e.target.value
          return [...v]
        }))
      )

    else if (k === 'optionType')
      opt.push(
        template('radio', '选项类型', `${main.item?.name}_optionType`, main.option.optionType, e => setMainItems(v => {
          v[index].option.optionType = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options: [
            { label: 'default', value: 'default' },
            { label: 'button', value: 'button' }
          ]
        })
      )

    else if (k === 'options')
      opt.push({
        type: 'custom',
        item: { label: '选项', name: `${main.item?.name}_options` },
        innerHtml:
          <MyOptions
            options={main.option.options}
            onChange={e => setMainItems(pre => {
              pre[index].option.options = e
              return [...pre]
            })}
          />
      })

    else if (k === 'count')
      opt.push(
        template('number', '数量', `${main.item?.name}_count`, main.option.count, e => setMainItems(v => {
          v[index].option.count = e
          return [...v]
        }))
      )

    else if (k === 'allowHalf')
      opt.push(
        template('switch', '允许半星', `${main.item?.name}_allowHalf`, main.option.allowHalf, e => setMainItems(v => {
          v[index].option.allowHalf = e
          return [...v]
        }))
      )

    else if (k === 'showSearch')
      opt.push(
        template('switch', '可查询', `${main.item?.name}_showSearch`, main.option.showSearch, e => setMainItems(v => {
          v[index].option.showSearch = e
          return [...v]
        }))
      )

    else if (k === 'allowClear')
      opt.push(
        template('switch', '可清除', `${main.item?.name}_allowClear`, main.option.allowClear, e => setMainItems(v => {
          v[index].option.allowClear = e
          return [...v]
        }))
      )

    else if (k === 'mode')
      opt.push(
        template('radio', '模式', `${main.item?.name}_mode`, main.option.mode, e => setMainItems(v => {
          v[index].option.mode = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options: [
            { label: 'single', value: '' },
            { label: 'tags', value: 'tags' },
            { label: 'multiple', value: 'multiple' }
          ]
        })
      )

    else if (k === 'range')
      opt.push(
        template('switch', '范围选择', `${main.item?.name}_range`, main.option.range, e => setMainItems(v => {
          v[index].option.range = e
          return [...v]
        }))
      )

    else if (k === 'step')
      opt.push(
        template('number', '步长 step', `${main.item?.name}_step`, main.option.step, e => setMainItems(v => {
          v[index].option.step = e
          return [...v]
        }))
      )

    else if (k === 'defaultChecked')
      opt.push(
        template('switch', '初始是否选中', `${main.item?.name}_defaultChecked`, main.option.defaultChecked, e => setMainItems(v => {
          v[index].option.defaultChecked = e
          return [...v]
        }))
      )

    else if (k === 'format')
      opt.push(
        template('text', '显示格式', `${main.item?.name}_format`, main.option?.format, e => setMainItems(v => {
          v[index].option!.format = e.target.value
          return [...v]
        }))
      )

    else if (k === 'picker')
      opt.push(
        template('radio', '类型', `${main.item?.name}_picker`, main.option.picker, e => setMainItems(v => {
          v[index].option.picker = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options: [
            { label: 'date', value: 'date' },
            { label: 'week', value: 'week' },
            { label: 'month', value: 'month' },
            { label: 'quarter', value: 'quarter' },
            { label: 'year', value: 'year' }
          ]
        })
      )

    else if (k === 'showTime')
      opt.push(
        template('switch', '显示时间 showTime', `${main.item?.name}_showTime`, main.option.showTime, e => setMainItems(v => {
          v[index].option.showTime = e
          return [...v]
        }))
      )

    else if (k === 'action')
      opt.push(
        template('text', '上传地址', `${main.item?.name}_action`, main.option.action, e => setMainItems(v => {
          v[index].option.action = e.target.value
          return [...v]
        }))
      )

    else if (k === 'accept')
      opt.push(
        template('text', '文件类型', `${main.item?.name}_accept`, main.option.accept, e => setMainItems(v => {
          v[index].option.accept = e.target.value
          return [...v]
        }))
      )

    else if (k === 'maxSize')
      opt.push(
        template('number', '文件大小', `${main.item?.name}_maxSize`, main.option.maxSize, e => setMainItems(v => {
          v[index].option.maxSize = e
          return [...v]
        }))
      )

    else if (k === 'isChunk')
      opt.push(
        template('switch', '是否分片上传', `${main.item?.name}_isChunk`, main.option.isChunk, e => setMainItems(v => {
          v[index].option.showTime = e
          return [...v]
        }))
      )

    else if (k === 'chunkSize')
      opt.push(
        template('number', '分片文件大小', `${main.item?.name}_chunkSize`, main.option.chunkSize, e => setMainItems(v => {
          v[index].option.chunkSize = e
          return [...v]
        }))
      )

    else if (k === 'tokenType')
      opt.push(
        template('number', '获取 token 方式', `${main.item?.name}_tokenType`, main.option.tokenType, e => setMainItems(v => {
          v[index].option.tokenType = e
          return [...v]
        }))
      )

    else if (k === 'listType')
      opt.push(
        template('radio', '上传列表样式', `${main.item?.name}_listType`, main.option.listType, e => setMainItems(v => {
          v[index].option.listType = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options: [
            { label: 'text', value: 'text' },
            { label: 'picture', value: 'picture' },
            { label: 'picture-card', value: 'picture-card' },
            { label: 'picture-circle', value: 'picture-circle' }
          ]
        })
      )

    else if (k === 'maxCount')
      opt.push(
        template('number', '文件数量', `${main.item?.name}_maxCount`, main.option.maxCount, e => setMainItems(v => {
          v[index].option.maxCount = e
          return [...v]
        }))
      )

    else if (k === 'valueSplit')
      opt.push(
        template('text', '值的分隔符', `${main.item?.name}_valueSplit`, main.option.valueSplit, e => setMainItems(v => {
          v[index].option.valueSplit = e.target.value
          return [...v]
        }))
      )

    else if (k === 'valueType')
      opt.push(
        template('radio', '值类型', `${main.item?.name}_valueType`, main.option.valueType, e => setMainItems(v => {
          v[index].option.valueType = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options: [
            { label: 'string', value: 'string' },
            { label: 'arr', value: 'arr' },
            { label: 'obj', value: 'obj' }
          ]
        })
      )

    else if (k === 'crop')
      opt.push(
        template('switch', '是否裁剪', `${main.item?.name}_crop`, main.option.crop, e => setMainItems(v => {
          v[index].option.crop = e
          return [...v]
        }))
      )

    else if (k === 'type')
      opt.push(
        template('radio', '类型', `${main.item?.name}_type`, main.option.type, e => setMainItems(v => {
          v[index].option.type = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options:
            main.type === 'oneLevelOpt' ? [
              { label: 'radio', value: 'radio' },
              { label: 'checkbox', value: 'checkbox' },
              { label: 'select', value: 'select' }
            ] : main.type === 'multiLevelOpt' ? [
              { label: 'cascader', value: 'cascader' },
              { label: 'treeselect', value: 'treeselect' }
            ] : [
              { label: 'primary', value: 'primary' },
              { label: 'ghost', value: 'ghost' },
              { label: 'dashed', value: 'dashed' },
              { label: 'link', value: 'link' },
              { label: 'text', value: 'text' },
              { label: 'default', value: 'default' }
            ]
        })
      )

    else if (k === 'innerHtml')
      opt.push(
        template('text', '名称', `${main.item?.name}_innerHtml`, main.innerHtml, e => setMainItems(v => {
          v[index]!.innerHtml = e.target.value
          return [...v]
        }))
      )

    else if (k === 'url')
      opt.push(
        template('text', '外部链接', `${main.item?.name}_url`, main.option.url, e => setMainItems(v => {
          v[index]!.option.url = e.target.value
          return [...v]
        }))
      )

    else if (k === 'code')
      opt.push(
        template('text', '字典编码', `${main.item?.name}_code`, main.option.code, e => setMainItems(v => {
          v[index]!.option.code = e.target.value
          return [...v]
        }))
      )

    else if (k === 'split')
      opt.push(
        template('text', '分隔符', `${main.item?.name}_split`, main.option.split, e => setMainItems(v => {
          v[index]!.option.split = e.target.value
          return [...v]
        }))
      )

    else if (k === 'height')
      main.type === 'code' ?
        opt.push(
          template('text', '高度', `${main.item?.name}_height`, main.option.height, e => setMainItems(v => {
            v[index]!.option.height = e.target.value
            return [...v]
          }))
        ) :
        opt.push(
          template('number', '高度', `${main.item?.name}_height`, main.option.height, e => setMainItems(v => {
            v[index].option.height = e
            return [...v]
          }))
        )

    else if (k === 'width')
      main.type === 'code' ?
        opt.push(
          template('text', '宽度', `${main.item?.name}_width`, main.option.width, e => setMainItems(v => {
            v[index]!.option.width = e.target.value
            return [...v]
          }))
        ) :
        opt.push(
          template('number', '宽度', `${main.item?.name}_width`, main.option.width, e => setMainItems(v => {
            v[index].option.width = e
            return [...v]
          }))
        )

    else if (k === 'language')
      opt.push(
        template('radio', '语言', `${main.item?.name}_language`, main.option.language, e => setMainItems(v => {
          v[index].option.language = e.target.value
          return [...v]
        }), {
          optionType: 'button',
          options: [
            { label: 'css', value: 'css' },
            { label: 'html', value: 'html' },
            { label: 'json', value: 'json' },
            { label: 'javascript', value: 'javascript' }
          ]
        })
      )

    else if (k === 'items')
      opt.push({
        type: 'button',
        innerHtml: '配置子项',
        option: {
          type: 'primary',
          onClick: () => {
            const confirm = Modal.confirm({
              title: '子项配置',
              width: '90%',
              content: <FormDesign initValue={{ items: main.list?.items }} onFinish={v => { main.list!.items = v.items; confirm.destroy() }} />,
              icon: null,
              maskClosable: true,
              closable: true,
              footer: null
            })
          }
        }
      })

  })

}

const template = (type: MyFormType, label: string, name: string, initialValue: any, onChange: (e: any) => any, option = {} as any) => {
  option.onChange = onChange
  const valuePropName = type === 'switch' ? "checked" : undefined
  return { type, item: { label, name, initialValue, valuePropName }, option } as MyFormItems
}