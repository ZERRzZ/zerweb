# 简介

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.29.

Run `ng build yz` to build the project. After building your library with `ng build yz`, go to the dist folder `cd dist/yz` and run `npm publish`.

* github -> https://github.com/ZERRzZ/zerweb/tree/main/angular/yz

* style -> @chengzs/yz/common/style/style.css (在本地的 node_modules 里，组件的样式)

# 公共

*icon* - 一些精简常用的小图标，主要是 svg 的

*method* - 公用的方法，也有没有在包里使用的方法在里面

*service* - 暂不暴露，主要是用于接口的错误提示

*style* - 全局样式，主要包括颜色变量，css reset，动画等

# 组件

***简单说明组件传入传出的属性，具体数据类型，逻辑请打开相关代码文件查看***

## BetterTableComponent

表格组件，可支持选择某行的操作

**@Input**

head: `BTHead[]` 表头

body: `BTBody[]` 表体

line: `number` 一页显示的行数

click: `boolean` 行是否可以点击（在需要点击某一行来处理业务时使用，默认为 false）

id: `number` 默认选中行的 id（默认为 0，即不选中）

**@Output**

clickTr: `EventEmitter<BTBody>` 传出点击的行（不需要时可不用）

## CounterComponent

计数器组件，点击按钮来 +1 或 -1，或者直接输入值

**@Input**

value: `number` 初始值

**@Output**

valueChange: `EventEmitter<number>` 传出改变后的值

## DropDownComponent

下拉列表菜单

**@Input**

list: `DDList[]` 列表

**@Output**

listSelect: `EventEmitter<DDList>` 传出选中的项

## FloatMenuComponent

浮动菜单组件，特殊样子的菜单，是三级菜单

**@Input**

floatMenu: `FloatMenu[]` 菜单

onSelect: `number[]` 选中的菜单id [一级 id，二级 id，三级 id]

**@Output**

onSelectChange: `EventEmitter<number[]>` 传出选中的**菜单id**

## LegendComponent

图例组件，可以读取本地图片来作为图例，只用来规定形状，而不是图片展示

**@Input**

legend: `Legend[]` 图例数据

**@Input**

height: `string` 图例的最大高，做换行用，带单位，如 200px

## PlayBarComponent

播放条组件，类似进度条

**@Input**

playbar: `PlayBar[]` 刻度数据，总共分多少个刻度

**@Output**

onplaybar: `EventEmitter<PlayBar>` 将选中的刻度传出

## SuperMenuComponent

超级菜单组件，递归生成菜单，支持任意层级

**@Input**

origin: `SuperMenu[]` 源数据，使用时只需保证和菜单数据一样即可

smenu: `SuperMenu[]` 菜单数据

**@Output**

selectmenu: `EventEmitter<PlayBar>` 传出菜单项，等同于下面

selectMenu: `EventEmitter<PlayBar>` 传出菜单项，等同于上面，可讲两个当作一个来使用

## TagsChooseComponent

标签选择组件，可多选

**@Input**

tags: `TagsTwo[]` 数据

max: `number` 最大显示几条，多余的省略

**@Output**

chooseTags: `string[]` 传出所选择的标签的名字

# 历史

添加 handle-cookie 方法 @2.2.0 

添加组件 super-menu, 删除组件 s-menu @2.1.0

降低 angular 版本为 8 @2.0.0

添加组件 tags-choose @1.8.0

添加组件 play-bar @1.7.0

添加组件 float-menu @1.6.0

修改 single-list 为 drop-down, 修改 count 为 counter @1.4.7

添加组件 single-list @1.4.6

修改 readonly-table 为 better-table, 添加点击选中行的功能 @1.4.5

完善组件 readonly-table, 增加分页与搜索功能 @1.4.1

添加组件 readonly-table @1.4.0

添加组件 legend @1.3.0

添加二级菜单组件 s-menu @1.2.0

添加第一个组件 count @1.1.0

添加公共方法 debounce @1.1.0

添加样式 style, 主要有 class, variable, reset @1.1.0