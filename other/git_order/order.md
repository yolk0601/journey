## git

### 分支相关
##### 1. 新建分支
```
git checkout -b branch-name
例如： git checkout -b yolk
```

##### 2. 删除本地分支
```
git branch -d branch-name
例如： git branch -d yolk
```

##### 3. 在分支上提交内容
```
git push origin yolk
```

##### 4. 切换到分支
```
git checkout branch-name
```

##### 5. 从远程分支上面下载内容
```
git pull 远程分支名字 origin/本地分支名字
git pull testAnswer origin/testAnswer
```

##### 6. 将仓库的某文件覆盖本地的某文件
> 1. 将仓库中的文件覆盖本地文件，直接忽略本地文件修改
> 
>> 使用: git fetch ==> 
>>  
>>  git reset --hard origin/imac => 从远程imac分支上 将代码下载下来
>>  
>>  git pull => 合并到本地
>>  
> 
> 2. 覆盖一个文件 ？
> 

##### 7. git pull 远程非对应分支到本地分支
```
ex: 本地：imac； 远程:linux
git pull origin linux:imac
```

#### 8. 从一个git仓库迁移到另外一个git仓库
```
1). 从原地址克隆一份裸版本库，比如原本托管于 GitHub。
git clone --bare git://github.com/username/project.git
2). 然后到新的 Git 服务器上创建一个新项目，比如 GitCafe。
3). 以镜像推送的方式上传代码到 GitCafe 服务器上。
cd project.git
git push --mirror git@gitcafe.com/username/newproject.git
-- mirror 克隆出来的裸版本对上游版本库进行了注册，这样可以在裸版本库中使用git fetch命令和上游版本库进行持续同步。
4). 删除本地代码
cd ..
rm -rf project.git
5). 到新服务器 GitCafe 上找到 Clone 地址，直接 Clone 到本地就可以了。
git clone git@gitcafe.com/username/newproject.git

demo：现有git仓库是在coding上，name: aaa; 推送到 gitlab的仓库中，
在现有仓库下。cd cangkuName
执行命令：git push --mirror https://git.xesv5.com/xuejs/jiaoyan_platform.git
// 能将所有的本仓库的分支以及master代码都合并过去
// 前提条件: 不同的网址，都添加好ssh 密钥
```