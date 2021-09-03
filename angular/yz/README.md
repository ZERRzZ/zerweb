## yz

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

Run `ng generate component component-name --project yz` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project yz`.
> Note: Don't forget to add `--project yz` or else it will be added to the default project in your `angular.json` file. 

Run `ng build yz` to build the project. The build artifacts will be stored in the `dist/` directory.

After building your library with `ng build yz`, go to the dist folder `cd dist/yz` and run `npm publish`.

## use

**CountComponent**

`@Input() value: number` 初始值  
`@Output() valueChange: EventEmitter<number>` 传出改变的值  

**SMenuComponent**

`Input() smenu: Array<SMenu>` 菜单  
`Input() open: boolean` 是否打开  
`Input() select: [number, number]` 初始选中的 [二级菜单 id, 子菜单 id]  
`Output() reselect: EventEmitter<[SMenu, AMenu]>`  传出所选菜单信息  

## history

添加二级菜单组件 s-menu 1.2.0

添加第一个组件 count 1.1.0

添加公共方法 debounce 1.1.0

添加样式 style, 主要有 class, variable, reset 1.1.0