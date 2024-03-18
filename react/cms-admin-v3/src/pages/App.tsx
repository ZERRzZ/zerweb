import routes from '~react-pages';
import { Suspense } from 'react';
//Provider用于在全局注入全局状态
import { useRoutes } from 'react-router-dom';
import { ConfigProvider, ThemeConfig } from 'antd';
// 将antd组件默认语言改为中文
import zhCN from "antd/es/locale/zh_CN";
import dayjs from 'dayjs';
// 将时间选择器组件未改为中文位置改为中文
import 'dayjs/locale/zh-cn';

import './index.css';
//导入全局状态管理对象
import stores from '../stories';
import { AppProvider } from '@/stories/AppProvider';
import themeConfig from '@/config/themeConfig';
import Loading from '@/components/Loading';

dayjs.locale('zh-cn');

function App() {

  return (
    <AppProvider providers={stores}>
        <ConfigProvider locale={zhCN} theme={themeConfig as ThemeConfig} >
            <Suspense fallback={<Loading />}>
              {useRoutes(routes)}
            </Suspense>
        </ConfigProvider>
    </AppProvider>
  )
}


export default App;