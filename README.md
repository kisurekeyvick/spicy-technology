#微辣科技 后台管理系统
- 本项目用typescript为编程语言
- 脚手架create-react-app
- 组件库：antd 

# 环境配置与运行
## 第一步：环境配置
- [安装nodejs](http://nodejs.cn/download/)
- [安装yarn](https://yarnpkg.com/lang/zh-hans/docs/install/#mac-stable)
- [安装create-react-app](https://www.jianshu.com/p/c6040430b18d)
- [安装cnpm(也可不安装)](https://www.jianshu.com/p/96d7558e643b)

## 第二步：下载node_module
- yarn install(如果觉得下载慢，可以使用cnpm淘宝镜像进行下载)

## 第三步：启动项目
- yarn/npm start

# 项目说明
- 本项目已经yarn eject
- [react文件目录规范](https://www.jianshu.com/p/540d4b4b5f29)
```
    ├── build                           构建脚本目录
    │   ├── css                           打包生成的css目录
    │   ├── js                              打包生成的js目录
    │   ├──assets                       打包生成的静态文件目录
    │   ├── index.html                运行本地构建服务器，可以访问构后的页面
    ├── package.json                 npm包配置文件，里面定义了项目的npm脚本，依赖包等信息
    ├── src                                项目源码目录
    │   ├── index.js                      入口js文件
    │   ├── index.html                  入口html文件
    │   ├── routers                   前端路由文件
    │   ├── components               展示性组件目录
    │   ├── containers                  容器性组件目录
    │   ├── assets                        资源目录，这里的资源会被wabpack构建
    │   │   ├── css                          公共样式文件目录
    │   │   ├── js                             公共js文件目录
    │   │   └── img                          图片存放目录
    │   ├── store                           应用级数据（state）
    │   │   └── index.js
    │   └── common                         公共文件
    │   │    ├── utils                     公共模块
    │── config                              wabpack配置
    │── .gitignore                  提交代码时候需要配置的忽略提交的代码目录
    │── README.md               展示项目基本用法功能的说明性文件
```