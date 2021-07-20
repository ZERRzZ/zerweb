## zerweb

这个包(应该算是吧)

angular 目录: angular 框架的复用组件

method 目录: 公共的方法

style 目录: 公共样式, 格式为 css

## use style

使用时需引用样式到项目中:

或在 angular.json 中的 styles 字段中写入路径 `path/to/zerweb/style/style.css`  
或在项目 index.html 中用 link 标签引入 `<link rel="stylesheet" href="path/to/zerweb/style/style.css">`  
或在项目 styles.css 中用 @import 导入 `@import 'path/to/zerweb/style/style.css'`  

## use method

直接用吧

## history

method 添加新的算法, 将数组中某一元素插入到另一元素之前 `insertbefore` @0.2.8  
mehtod 添加拖拽实现排序的算法 `dragsort` @0.2.5  
method 添加拖拽移动元素位置算法 `dragmove` @0.2.4  
angular yz 模块添加组件 `map-legend` @0.2.1  
angular yz 模块添加组件 `count` @0.1.7  
method 添加饼形图算法 `pie-chart`, 根据颜色与占比返回一个 svg 饼形图 @0.0.8  
angular yz 模块组件 `singleChoice` 完成 @0.0.6  
angular yz 模块的第一个组件, 二级菜单组件 `menuTwo` 完成, 功能完善且强大 @0.0.4  