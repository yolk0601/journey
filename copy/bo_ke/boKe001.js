/**
掘金--> https://juejin.im/post/5b1230c1f265da6e603933ad
vue小技巧
*/
/*
1. 组件 style的scoped
2. Vue 数组/对象更新，视图不更新
3. vue filters 过滤器的使用
4. 列表渲染相关
5. 深度watch 与watch立即出发回调
6. 这些情况下，不要使用箭头函数
7. 路由懒加载写法
8. 路由的项目启动页和404页面
9. vue调试神奇：vue-devtools
*/

/**
* 1. 问题：在组件中用Js动态创建的dom,添加样式不生效。
*/ 
// 例如：
// <template>
//   <div class="test"></div>
// </template>
// <script>
//   let  a = document.querySelector('.test');
//   let newDom = document.createElement('div');
//   newDom.setAttribute('class', 'testAdd');
//   a.appendChild(newDom);
// </script>
// <style scoped>
// .test {
//   background : blue;
//   height: 100%;
//   width: 100px;
// }
// .testAdd{
//   background:red;
//   height:100px;
//   width:100px;
// }
// </style>
// 提出代码修改建议：
/*
1. 如上所示的代码 js部分，需要放在 mounted里面。
2. 在vue开发过程中，取用dom元素尽量使用 ref。 这里只是演示
*/
/*
原因：
 style标签上面 有scoped属性时，它的样式只作用域当前组件，包含当前组件的内部组件
  添加scoped属性后，会为组件中所有元素添加上scoped的唯一标识： data-v-ab35f416
  唯一标识添加规则： 1.该组件中的所有元素，该组件中运用的 子组件的下的最大的元素。

  动态添加的元素，没有scoped 添加的标识
*/
/*
解决方法：
1. 去掉该组件的scoped
2. 也可以动态添加style
  // 上面的栗子可以这样添加样式
  newDom.style.height='100px';
  newDom.style.width='100px';
  newDom.style.background='red';
*/

/**
* 2. 问题：Vue 数组/对象更新，视图不更新。 习惯于简单操作数组和对象
*/
// data: function () {
//   return {
//     text: 'hello',
//     arr: [1, 2, 3],
//     obj: {
//       a: 1,
//       b: 2
//     }
//   }
// },
// methods: {
//   arrClick: function () {
//     this.arr[0] = 'OBKoro1';
//     this.arr.length = 1;
//     console.log(arr);// ['OBKoro1'];
//     // 数据更新 对象视图不更新
//     this.obj.c = 'OBKoro1';
//     delete this.obj.a;
//     console.log(obj);  // {b:2,c:'OBKoro1'}
//   }
// }
/**
  由于js的限制， Vue不能检测以上数组的变动，以及对象的添加/删除，视图不会更新
*/
/*
解决方法：
1. this.$set(你要改变的数组/对象，你要改变的位置/key，你要改成什么value)
2. 数组原生方法触发的视图更新可以的。
    splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
3. 替换数组/对象
  遍历这个数组/对象，对每个元素进行处理；然后触发视图更新
    example1.items = example1.items.filter(function (item) {
      return item.message.match(/Foo/)
    })
*/



