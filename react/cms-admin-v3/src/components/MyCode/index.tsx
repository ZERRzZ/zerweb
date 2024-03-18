import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import { javascript } from '@codemirror/lang-javascript';

import './index.css'

export default function MyCode({ width = '100%', height = '200px', language = 'javascript', theme = 'light', value, onChange }: MyCodeProps) {

  const [localValue, setLocalValue] = useState('')

  // 在此加上其他语言
  const languageModle = { html, css, javascript, json }

  const handleChange = v => {
    setLocalValue(v)
    onChange?.(v)
  }

  return (
    <CodeMirror
      width={'100%'}
      height={height}
      style={{ width: width, border: '1px solid #d9d9d9' }}
      extensions={[languageModle[language]()]}
      theme={theme}
      value={value || localValue}
      onChange={handleChange}
    />
  )

}

/**
 * 我的代码编辑器属性
 * @param width 输入框宽度
 * @param height 输入框高度
 * @param language 语言类型
 * @param theme 主题色
 * @param value 值
 * @param onChange 值改变事件
 */
export interface MyCodeProps {
  width?: string
  height?: string
  language?: MyCodeLanguage
  theme?: 'light' | 'dark'
  value?: string
  onChange?: (v: string) => void
}

/**
 * 代码编辑器语言支持类型
 * @ 需要额外的语言类型需要先安装对应的包，并在组件内的 languageModle 对象中加入属性
 * @ 总共支持的语言及对应的包
 * @ -@codemirror/lang-cpp
 * @ -@codemirror/lang-css
 * @ -@codemirror/lang-html
 * @ -@codemirror/lang-java
 * @ -@codemirror/lang-javascript
 * @ -@codemirror/lang-json
 * @ -@codemirror/lang-lezer
 * @ -@codemirror/lang-markdown
 * @ -@codemirror/lang-php
 * @ -@codemirror/lang-python
 * @ -@codemirror/lang-rust
 * @ -@codemirror/lang-sql
 * @ -@codemirror/lang-xml
 * @ -@codemirror/lang-wast
 */
export type MyCodeLanguage = 'html' | 'css' | 'javascript' | 'json'