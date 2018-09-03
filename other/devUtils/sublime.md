
### 操作

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

##### 4. 使用的插件


### 我所需要的插件
##### 安装 package control

> 可以访问网站： https://packagecontrol.io/installation
> 
> 以下是安装的sublime text 3 的内容 

```

import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

```

import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

##### 我所需要的插件和安装方式
+ emmet (自动安装pyv8)
+ JsFormat
+ 


#### 快捷键使用
###### jsFormat 
option + control + F  ==>  将压缩的js 格式化