import { ReactNode } from "react"

/**
 * 导航菜单配置
 */
export interface PageConfig {
  headDropdown: HeadDropdown[]
  page: MyPageItem[]
  menu: MyMenuItem[]
  defaultMenuShowType: MyMenuShowType
}

/**
 * @param label 菜单文字
 * @param path 导航路径
 * @param icon 图标
 * @param children 子项
*/
export interface MyMenuItem extends MyPageItem {
  icon?: ReactNode;
  children?: Array<MyMenuItem>;
  show?: boolean;
}

export type MyMenuShowType = 'aside' | 'head' | 'split';

export interface MyPageItem {
  label: string;
  path?: string;
  key?: string;
  parentKey?: string;
  requirePems?: string[];
}

/**
 * @param label 菜单文字
 * @param count 徽标数
 * @param icon 图标
 * @param onClick 点击事件
 * @param children 子项
 */
export interface HeadDropdown {
  label: ReactNode
  count?: number
  icon?: ReactNode
  onClick?: (e?: Event) => void
  children?: Array<HeadDropdown>
}

/**
 * @param title 页面标题
 * @param path 页面的路径，path 部分
 */
export interface PageHeader {
  title: string
  path: string
}

/**
 * @param Theme 布局主题配置
 * @param ThemeStyle 布局风格配置
 * @param ThemeColor 布局颜色配置
 */
export type Theme = 'dark' | 'light';
export type ThemeStyle = 'topside' | 'broadside' | 'leftside';
export type ThemeColor = string;
export type ThemePageTabs = 'pageTabs' | 'breadcrumb';
