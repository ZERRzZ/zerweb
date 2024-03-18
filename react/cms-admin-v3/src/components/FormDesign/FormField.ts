import { MyFormItems } from "@/components/MyForm";

export const formField: MyFormItems[] = [
  {
    type: 'text',
    item: { label: '输入框', name: '', initialValue: '', rules: [] },
    option: { placeholder: '', showCount: false, maxLength: -1 }
  },
  {
    type: 'password',
    item: { label: '密码框', name: '', initialValue: '', rules: [] },
  },
  {
    type: 'textarea',
    item: { label: '区域输入框', name: '', initialValue: '', rules: [] },
    option: { placeholder: '', rows: 5, showCount: false, maxLength: -1 }
  },
  {
    type: 'number',
    item: { label: '数字输入框', name: '', initialValue: '', rules: [] },
    option: { controls: true, min: 0, max: 100 }
  },
  {
    type: 'mention',
    item: { label: '提及', name: '', initialValue: '', rules: [] },
    option: { prefix: '@', rows: 1, options: [] }
  },
  {
    type: 'cron',
    item: { label: 'cron 选择', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'radio',
    item: { label: '单选框', name: '', initialValue: '', rules: [] },
    option: { optionType: 'default', options: [] }

  },
  {
    type: 'checkbox',
    item: { label: '多选框', name: '', initialValue: '', rules: [] },
    option: { options: [] }
  },
  {
    type: 'rate',
    item: { label: '评分', name: '', initialValue: '', rules: [] },
    option: { count: 5, allowHalf: false }
  },
  {
    type: 'select',
    item: { label: '下拉选择框', name: '', initialValue: '', rules: [] },
    option: { showSearch: false, allowClear: false, mode: '', options: [] }
  },
  {
    type: 'cascader',
    item: { label: '级联选择器', name: '', initialValue: '', rules: [] },
    option: { options: [] }
  },
  {
    type: 'slider',
    item: { label: '滑动输入条', name: '', initialValue: '', rules: [] },
    option: { range: false, min: 0, max: 100, step: 1 }
  },
  {
    type: 'switch',
    item: { label: '开关', name: '', valuePropName: 'checked', rules: [] },
    option: { defaultChecked: false }
  },
  {
    type: 'year',
    item: { label: '年份选择', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'month',
    item: { label: '月份选择', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'date',
    item: { label: '日期选择', name: '', initialValue: '', rules: [] },
    option: { picker: 'date', showTime: false }
  },
  {
    type: 'time',
    item: { label: '时间选择', name: '', initialValue: '', rules: [] },
    option: { format: 'HH:mm:ss' }
  },
  {
    type: 'dateTime',
    item: { label: '日期选择(带时间)', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'yearRange',
    item: { label: '年份范围', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'monthRange',
    item: { label: '月份范围', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'dateRange',
    item: { label: '日期范围', name: '', initialValue: '', rules: [] },
    option: { picker: 'date', showTime: false }
  },
  {
    type: 'timeRange',
    item: { label: '时间范围', name: '', initialValue: '', rules: [] },
    option: { format: 'HH:mm:ss' }
  },
  {
    type: 'dateTimeRange',
    item: { label: '日期范围(带时间)', name: '', initialValue: '', rules: [] }
  },
  {
    type: 'myUpload',
    item: { label: '上传', name: '', initialValue: '', rules: [] },
    option: { action: '', accept: '', maxSize: 5, isChunk: false, chunkSize: 2, tokenType: -1, listType: 'text', maxCount: 1, valueSplit: '', valueType: 'string', crop: false },
    innerHtml: '上传'
  },
  {
    type: 'myImageUpload',
    item: { label: '图片上传', name: '', initialValue: '', rules: [] },
    option: { maxCount: 1, valueType: 'string', crop: false },
    innerHtml: '图片上传'
  },
  {
    type: 'myVideoUpload',
    item: { label: '视频上传', name: '', initialValue: '', rules: [] },
    option: { maxCount: 1, valueType: 'string' },
    innerHtml: '视频上传'
  },
  {
    type: 'myDocUpload',
    item: { label: 'WPS 文件上传', name: '', initialValue: '', rules: [] },
    option: { maxCount: 1, valueType: 'string' },
    innerHtml: 'WPS 文件上传'
  },
  {
    type: 'myFileUpload',
    item: { label: '文件上传', name: '', initialValue: '', rules: [] },
    option: { maxCount: 1, valueType: 'string' },
    innerHtml: '文件上传'
  },
  {
    type: 'button',
    item: { name: '', wrapperCol: { span: 0, offset: 0 } },
    option: { type: 'default' },
    innerHtml: '普通按钮'
  },
  {
    type: 'submit',
    item: { name: '', wrapperCol: { span: 0, offset: 0 } },
    option: { type: 'primary' },
    innerHtml: '提交'
  },
  {
    type: 'reset',
    item: { name: '', wrapperCol: { span: 0, offset: 0 } },
    option: { type: 'default' },
    innerHtml: '重置'
  },
  {
    type: 'oneLevelOpt',
    item: { label: '一级选项', name: '', initialValue: '', rules: [] },
    option: { type: 'select', url: '', code: '' }
  },
  {
    type: 'multiLevelOpt',
    item: { label: '多级选项', name: '', initialValue: '', rules: [] },
    option: { type: 'cascader', url: '', code: '', split: '' }
  },
  {
    type: 'editor',
    item: { label: '富文本编辑', name: '', initialValue: '', rules: [] },
    option: { width: null, height: 300 }
  },
  {
    type: 'code',
    item: { label: '代码输入框', name: '', initialValue: '', rules: [] },
    option: { language: 'json', width: '200px', height: '200px' }
  },
  {
    type: 'list',
    list: { label: '表单列表', name: '', items: [] }
  }
]