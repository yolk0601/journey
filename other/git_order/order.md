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