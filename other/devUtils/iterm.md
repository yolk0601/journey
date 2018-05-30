### 需求

#### 1. 从iterm中走到某路径下，启动sublime，编辑
> 在iterm中安装: sudo ln -s /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl /usr/bin/subl
> 
> 安装失败： ln: /usr/bin/subl: Operation not permitted
> 
> 失败原因： osx系统中的 Rootless机制
> 
> 安装位置换为：/usr/local/bin => sudo ln -s /Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl /usr/local/bin
> 
> 使用： subl XXX.xx || filename
