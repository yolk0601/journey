### 安装

#### mac安装nginx
1. 有一个brew，安装nginx sudo brew install nginx
2. 查看nginx 版本： nginx -v
3. 启动nginx: sudo nginx
4. 查看nginx是否启动成功: http://localhost:8080。如果出现 欢迎界面，说明启动成功
5. 关闭nginx ： sudo nginx -s stop
6. 重新加载nginx: sudo nginx -是reload
7. 配置文件： /usr/local/etc/nginx/nginx.conf

### linux安装nginx：
**参考：https://www.yiibai.com/nginx/nginx-install.html**
1. 更新系统源文件： yum update
2. 安装依赖包: 

    > yum -y install gcc gcc-c++ autoconf automake libtool make cmake
    > 
    > yum -y install zlib zlib-devel openssl openssl-devel pcre-devel
3. 下载nginx 安装 
4. 按照参考来的


### 我的linux服务器:
ip: 10.99.1.219

nginx启动端口: 8080

我的linux账号: ssh root@10.99.1.219

密码： 3BaBsx

#### nginx -s quit

#### nginx -s reload
