## Angular

Angular CLI version 11.2.14.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.  
The app will automatically reload if you change any of the source files.  

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.  
Use the `--prod` flag for a production build.  

## Information

demo 模块用来测试复用组件的正确性

## 示例 Yz

Run `ng generate component component-name --project yz` to generate a new component. 

You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project yz`.

Note: Don't forget to add `--project yz` or else it will be added to the default project in your `angular.json` file. 

Run `ng build yz` to build the project. The build artifacts will be stored in the `dist/` directory.

After building your library with `ng build yz`, go to the dist folder `cd dist/yz` and run `npm publish`.

## Yz

所有输入属性都有默认值, 无需担心不传值带来的错误

menu-two

`@Input() menuTwo`: 数据, 格式为 `Array<MenuTwo>`  
`@Input() open`: 二级菜单是否打开, `boolean` 格式  
`@Input() select`: 选中哪一项, `number[]` 格式  
`@Output() reselect`: 当点击子项时触发该事件, 返回一个 `Array<[T, U]>`, 元组数组, 具体为选中的父项和子项数据, 类型随具体业务而定  

```html
<menu-two [menuTwo]='menuTwo' [open]='false' [select]='[1, 1]' (reselect)='getMenu($event)'></menu-two>
```

single-choice

`@Input() singleChoice`: 数据, 格式为 `SingleChoice`  
`@Input() select`: 选中哪一项, `number` 格式  
`@Outpur() reselect`: 当点击选项时触发该事件, 返回一个 `Array<[T, U]>`, 元组数组, 具体为选中的选项的父项和子项数据, 类型随具体业务而定  

```html
<single-choice [singleChoice]='single' [select]='select' (reselect)='getSingle($event)'></single-choice>
```