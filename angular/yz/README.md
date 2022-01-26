## yz

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

Run `ng build yz` to build the project. The build artifacts will be stored in the `dist/` directory.

After building your library with `ng build yz`, go to the dist folder `cd dist/yz` and run `npm publish`.

## use

**CountComponent**

`@Input() value: number` 初始值  

`@Output() valueChange: EventEmitter<number>` 传出改变的值  

**LegendComponent**

`@Input() legend: Legend[]` 图例数据  

`@Input() height: string` 图例的最大高, 做换行用, 带单位 200px  

**SMenuComponent**

`Input() smenu: Array<SMenu>` 菜单  

`Input() open: boolean` 是否打开  

`Input() select: [number, number]` 初始选中的 [二级菜单 id, 子菜单 id]  

`Output() reselect: EventEmitter<[SMenu, AMenu]>` 传出所选菜单信息  

**BetterTableComponent**

`@Input() head: BTHead[]` 表头  

`@Input() body: BTBody[]` 表体  

`@Input() line: number` 一页显示的行数

`@Input() click: boolean` 行是否可以点击

`@Input() id: number` 选中行的 id

`@Output() clickTr: EventEmitter<BTBody>` 传出行的点击事件

**SingleListComponent**

`@Input() list: SList[]` 列表

`@Output() listSelect: EventEmitter<SList>` 传出选中的项

## history

添加组件 single-list @1.4.6

修改 readonly-table 为 better-table, 添加点击选中行的功能 @1.4.5

完善组件 readonly-table, 增加分页与搜索功能 @1.4.1

添加组件 readonly-table @1.4.0

添加组件 legend @1.3.0

添加二级菜单组件 s-menu @1.2.0

添加第一个组件 count @1.1.0

添加公共方法 debounce @1.1.0

添加样式 style, 主要有 class, variable, reset @1.1.0