### 规则
##### 1. 组件名字为多个单词形式
> 避免与html元素冲突，html元素名称都是单词形式
> 
> 比如： todo组件 => todoItem

##### 2. 组件中的数据 data
> data属性 返回一个对象的函数
> 
> 比如： 

```javascript
    data: function () {
     retrun {
        data: 'hello'
     }
    }
```

#### 3. prop定义尽可能详细

```javascript
    // 更好的做法！
    props: {
      status: {
        type: String,
        required: true,
        validator: function (value) {
          return [
            'syncing',
            'synced',
            'version-conflict',
            'error'
          ].indexOf(value) !== -1
        }
      }
    }
```

#### 4. 为v-for设置键值
> 总是用key配合 v-for 以便维护内部组件及其子树的状态。
> 
>  具体优点没有理解全面 ： https://cn.vuejs.org/v2/style-guide/#%E4%B8%BA-v-for-%E8%AE%BE%E7%BD%AE%E9%94%AE%E5%80%BC-%E5%BF%85%E8%A6%81
```
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
      >
        {{ todo.text }}
      </li>
    </ul>
```

#### 5. 避免v-if 和 v-for 作用在同一个元素上。
> 使用场景1、 为了过滤一个列表中的项目： v-for ="user in users" v-if="user.active"
> 
>> 优化成：users 使用计算属性过滤一下，过滤成 activeUsers 在元素上使用 v-for 渲染
> 
> 使用场景2、 为了避免渲染本应该被隐藏的列表: v-for="user in users" v-if="shouldShowUsers"
> 
>> 优化成: v-if 作用元素改为 父元素

#### 6. 为组件样式设置局部作用域
> 1. 使用scoped 特性
> 
> 2. css module 基于class的BEM策略。== > **BEM策略**
> 
>> 组件库更倾向于使用BEM策略

#### 7. 私有属性名
> 插件，混入等扩展中，为自定义的私有属性使用 $_ 前缀。并附带一个命名空间回避和其他作者的冲突

```
变量命名： $_myGreatMixin_update
```

### 强烈推荐使用的规范
#### 8. 组件文件： 只要有能够拼接文件的构建系统，就把每个组件单独分成文件。

#### 9. 单文件组件文件的大小写
> 1、 全部大写首字母，包括第一个： MyComponent
> 
> 2、 单词之间使用-横线链接： my-component

#### 10. 基础组件名: 应用特定样式和约定的基础组件 (也就是展示类的、无逻辑的或无状态的组件) 应该全部以一个特定的前缀开头，比如 Base、App 或 V。

#### 11. 单例组件名： 只应该拥有单个活跃实例的组件应该以 The 前缀命名，以示其唯一性。 不用props传值

#### 12. 紧密耦合的组件名: 和父组件紧密耦合的子组件应该以父组件名作为前缀命名
```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

#### 13.组件名中的单词顺序: 组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词结尾。
```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

#### 14.完整单词命名组件等.
#### 15. props 参数中=> 使用 it-is-in 在父组件标签上绑定， 使用ItIsIn 在