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