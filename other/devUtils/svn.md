## svn


## 常用
```
cd fileName

svn status  查看文件状态
svn up| update 更新文件

svn commit -m 'updae' 将自己修改的文件 提交上去

svn add fileName 将新增文件写入 svn ,
svn commit -m 'update' 提交文件


svn delete fileName // 删除文件
svn commit -m 'update' // 提交更改 删除了命令

svn log fileName 查看日志，日志中包含很多信息
svn diff -r 24:25 filename 查看两个版本的不同
svn log -r 10 查看最近10条日志


svn merge -r 54:24 一般情况下54是现在版本号。将24版本的内容合并到当前。
svn commit -m 'revert from 24 to 54 and update'

```

#### 回滚代码场景

1. 更新代码: svn up
2. 查看更新日志: svn log filename
3. 查看限定数目日志: svn log -l 10 -v filename
4. 对比两个版本号的文件: svn diff -r 23:43 fileName
5. 合并以前的版本文件到目前版本下: svn merge -r 9999:768 filename
6. 查看合并后的代码与库中的代码的区别: svn diff filename
7. svn commit -m 'submit and log'
 

svn commit -m 'update by huangtao 理科辅导老师私信后，回滚代码到上一版本号'



### 发生冲突

1. **取消所有的本地编辑** 当本地编辑过，而没有上传，且其他用户 上传过，更新该文档时出现冲突，如果不需要本地文件。直接解决方式是: svn revert filename
2. **可以取消预订的操作** 
    ```
    例如：
     svn add filenama1.text filename2.text ...
     
     可以采用:
     svn revert filenama1.text filename2.text ...
     
     之后查看  
     svn  status  还会是 
     ？ filenama1.text 
     ?  filename2.text ...
    ```

#### 下载库

svn checkout http://10.10.7.137:18080/svn/static/x5home_2.0 --username=huangtao --password=WUsYWeOEFpzXAiYS