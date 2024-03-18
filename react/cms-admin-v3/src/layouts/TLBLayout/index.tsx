import { Suspense, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Breadcrumb, Button, Layout, Spin } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import './index.css'
import MyHeader from '../TLBHeader'
import MyFooter from '../TLBFooter'
import TLBSider from '../TLBSider'
import { ConfigContext } from '@/stories/ConfigStore'
import { findMenuByKey, findMenusByKey } from '@/config/pageConfig'
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb'
import themeConfig from '@/config/themeConfig'
import MyPageTabs from '@/components/MyPageTabs'

export default function TLBLayout({ children }: any) {

  const location = useLocation()
  const { state, dispatch } = useContext(ConfigContext);

  // 为页面设置标题
  const setTitle = () => findMenuByKey(location.pathname)?.label;

  // 为页面设置面包屑
  const setBreadcrumb = () => {
    const menus = findMenusByKey(location.pathname);
    return menus && menus.map((item, index) => {
      return { title: (item.path && menus && index != (menus.length - 1)) ? <Link to={item.path}>{item.label}</Link> : item.label };
    });
  }

  const renderHeader = () => {
    return (
      <header
        style={{ position: themeConfig.headerFixed ? 'sticky' : 'static' }}
        className={themeConfig.theme === 'dark' ? 'layout-header-dark' : 'layout-header'}
      >
        <Button className={themeConfig.layoutStyle === 'topside' ? 'unShow' : 'collapsed-btn'} type='text' onClick={() => dispatch({ type: 'menuCollapsed', value: !state.menuCollapsed })}>
          {state.menuCollapsed ? <MenuUnfoldOutlined className='collapsed-icon' /> : <MenuFoldOutlined className='collapsed-icon' />}
        </Button>
        <MyHeader />
      </header>
    )
  }

  const renderContent = () => {
    return (
      <article>
        {themeConfig.pageTabs === 'pageTabs' ?
          <div className="layout-page-tabs"><MyPageTabs /></div> :
          (
            setTitle() &&
            <div className="layout-page-header">
              <span>{setTitle()}</span>
              <Breadcrumb items={(setBreadcrumb() || []) as ItemType[]} />
            </div>
          )
        }
        <div className="layout-page-content">
          <Suspense fallback={<Spin spinning={true} />}>
            {children}
          </Suspense>
        </div>
      </article>
    )
  }

  return (
    themeConfig.layoutStyle === 'leftside' ?
      <Layout className='tlb-layout'>
        <main>
          <TLBSider />
          <div className='leftside-layout-page-content'>
            {renderHeader()}
            {renderContent()}
          </div>
        </main>
        <footer>
          <MyFooter />
        </footer>
      </Layout> :
      <Layout className='tlb-layout'>
        {renderHeader()}
        <main>
          <TLBSider />
          {renderContent()}
        </main>
        <footer>
          <MyFooter />
        </footer>
      </Layout>
  )

}