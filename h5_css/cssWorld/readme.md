[块级和内联元素]()

##### 块级和内联元素
###### 特点
+ 块级元素特点：
    + 一个水平流上，只能单独显示一个元素，多个块级元素则换行显示。
    + 与 display:block 的元素不是一个概念
    + 举例：li元素默认 display: list-item table元素默认display: table
+ 内联元素特点：
+ inline-block元素

###### 元素盒子模式
- 块级盒子和内联盒子
```
类似人类只有男和女两个性别一样。
盒子的诞生，本来也只想简简单单的。只有块级盒子 内联盒子
块级盒子 负责结构
内联盒子 负责内容
```

- 附加盒子 display: list-item
```
list-item 是列表的li显示，默认需要显示项目符号。
显示 符号的地方也需要包括在内
因此有标记盒子(附加盒子),包含着项目符号
```

- 两层盒子: display：inline-block
```
解决这个特殊的盒子而发生的演变：
外层盒子+内层盒子 = 外层盒子+容器盒子
外层盒子： 控制一行显示，还是换行显示。
容器盒子： 控制高宽，内容呈现。
display:inline-block  ==> 外在的内联盒子， 内在的块级容器盒子
display: block(block-block) ==> 外在的块级盒子，内在的块级容器盒子
display: inline(inline-inline) ==> 外在的内联盒子，内在的内联容器盒子
display: table(block-table) ==> 外层是块级盒子，内在是table容器盒子

display: inline-table
```


