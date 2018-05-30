### 需求

##### 1. 在sublime中启动该文件终端进行操作
> 安装插件：terminal ==> shift+command+p => install package
> 
> 使用快捷键：shift+command+t ==> 启动了iterm，自动到了该文件路径下

##### 2. 在sublime中实时预览markdown文件
> 1. 安装插件：MarkdownLivePreview
> 
>> 修改配置: MarkdownLivePreview=> settings => {"markdown_live_preview_on_open": true}
>> 
>> 优点： 实时预览markDown效果
>> 
>> 缺陷： 实时预览的效果不能 复制
>> 
> 
> 2. 安装插件：Markdown Preview
> 
>> 设置快捷键，在浏览器中预览：{ "keys": ["command+m"], "command": "markdown_preview", "args": {"target": "browser", "parser":"markdown"} }
>> 
>> 优点：从浏览器中预览效果，可以复制，方便粘贴。
>> 
>> 缺陷：不能实时预览效果

##### 3. 安装插件/卸载插件
> 安装插件: shift + command + p =>install package => input:plug-in unit filename
> 
> 卸载插件: shift + command + p => remove package => input:plug-in unit filename
