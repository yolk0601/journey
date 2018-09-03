#### 简单命令
**以下相关命令除非写了mac不可用之外，其他都是在mac上学习的**

##### 时间相关命令
```
命令: date
demo:
$ date
2018年 5月21日 星期一 23时03分43秒 CST

命令: cal 显示当月的日历
demo:
$ cal
      五月 2018
日 一 二 三 四 五 六
       1  2  3  4  5
 6  7  8  9 10 11 12
13 14 15 16 17 18 19
20 21 22 23 24 25 26
27 28 29 30 31

```

##### 磁盘查看
```
命令: df
demo:
$ df
Filesystem    512-blocks      Used Available Capacity iused               ifree %iused  Mounted on
/dev/disk1s1   489620264 102439200 379574704    22%  889593 9223372036853886214    0%   /
devfs                395       395         0   100%     684                   0  100%   /dev
/dev/disk1s4   489620264   6291496 379574704     2%       3 9223372036854775804    0%   /private/var/vm
map -hosts             0         0         0   100%       0                   0  100%   /net
map auto_home          0         0         0   100%       0                   0  100%   /home

命令: free (mac 不可用;zsh虚拟终端)

命令: exit 关闭终端效果
```

