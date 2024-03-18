import { MenuTheme } from "antd";

import { Theme, ThemeColor, ThemePageTabs, ThemeStyle } from "@/models/menus";

interface ThemeMethod {
  setTheme: (value) => void;
  setSlider: (value) => void;
  setColor: (value) => void;
  setPageTabs: (value) => void;
}

/**
 * @param now_theme 主题
 * @param now_style 主题布局
 * @param now_color 主题颜色
 */
const now_theme = localStorage.getItem('Theme') ? localStorage.getItem('Theme') : 'light' as MenuTheme
const now_style = localStorage.getItem('ThemeLayout') ? localStorage.getItem('ThemeLayout') : 'broadside'
const now_color = localStorage.getItem('ThemeColor') ? localStorage.getItem('ThemeColor') : '#1890ff'
const now_pageTabs = localStorage.getItem('ThemePageTabs') ? localStorage.getItem('ThemePageTabs') : 'pageTabs'
if (now_color) {
  document.documentElement.style.setProperty(`--theme-dark`, now_color);
}

const themeConfig = {

  theme: now_theme as Theme,
  layoutStyle: now_style as ThemeStyle,
  color: now_color as ThemeColor,
  pageTabs: now_pageTabs as ThemePageTabs,
  token: {
    // 主题颜色, 根据这个颜色自动生成梯度色板
    colorPrimary: now_color,
    // 字体
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol','Noto Color Emoji'",
    // 字体大小
    fontSize: localStorage.getItem('fontSize') ? JSON.parse(localStorage.getItem('fontSize')!) : 14,
    // 字体颜色
    colorTextBase: '#333',
    // 圆角
    borderRadius: 2,
    // a标签颜色
    colorLink: now_color,
    colorLinkHover: 'none',
    colorLinkActive: 'none',
  },
  method: {
    setTheme: (value) => {
      localStorage.setItem('Theme', value)
      window.location.reload()
    },
    setSlider: (value) => {
      localStorage.setItem('ThemeLayout', value)
      window.location.reload()
    },
    setColor: (value) => {
      localStorage.setItem('ThemeColor', value)
      window.location.reload()
    },
    setPageTabs: (value) => {
      localStorage.setItem('ThemePageTabs', value)
      window.location.reload()
    }
  } as ThemeMethod,
  // header 固定
  headerFixed: localStorage.getItem('headerFixed') === null ? false : JSON.parse(localStorage.getItem('headerFixed')!),
  // 侧边菜单固定
  sideMenuFixed: localStorage.getItem('sideMenuFixed') === null ? true : JSON.parse(localStorage.getItem('sideMenuFixed')!),
  // 自动分割菜单
  autoSplitMenu: localStorage.getItem('autoSplitMenu') === null ? false : JSON.parse(localStorage.getItem('autoSplitMenu')!),

}

export default themeConfig;