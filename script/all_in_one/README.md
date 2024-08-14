## CSGHub产品一键部署使用说明

[English Version](./docs/all_in_one_readme_en.md)

使用该脚本可以一键部署一个all-in-one的CSGHub环境，包括前端后端以及其他所有相关的功能组件，包括：
* csghub-portal
* csghub-server
* nginx
* postgresql
* git-server
* minio

**注意：**
从CSGHhub v0.4.0开始支持了space功能，由于space的构建部署需要Kubernetes以及其他相关环境和配置，因此这里的一键部署功能`不包含space的构建和部署`


### 前置条件
* 硬件

最小配置: 2c CPU/6GB 内存/50GB 硬盘

推荐配置: 4c CPU/16GB 内存/500GB 硬盘

* 软件

x86_64架构的任意Linux OS

docker engine（>=5:20.10.24）

### 使用方法
1. 切换到all_in_one目录
2. 编辑.env文件，设置`SERVER_DOMAIN`为当前主机的ip地址或者自定义域名（域名可能会有备案问题，因此推荐使用ip地址，公网/内网ip皆可）。请不要使用`127.0.0.1`或者`localhost`。
3. 运行`startup.sh`脚本，待所有服务启动完毕，即可以通过`http://[SERVER_DOMAIN]`访问到自部署的CSGHub服务。

详细使用方法可参看[使用文档](https://opencsg.com/docs/)

### 注意事项
1. 自部署CSGHub使用local类型的docker volume来进行相关持久化，比如postgresql，minio。请确保docker local volume有足够的磁盘空间。
1. 确保主机的`2222`对外端口正常，否则无法以ssh协议进行git操作。
1. 可通过主机的`9001`端口访问minio console，如果不需要访问minio console，该端口可关闭。
1. 默认只支持http协议的CSGHub服务，如果要https协议，需要自行更改相关配置。
1. 不要随意更改和删除`gitdata`和`gitlog`两个文件夹。这是两个运行时文件夹，会mount到相关容器服务中，文件夹的owner必须是`1001`,如果更改为其他或者删除掉这两个目录，会导致相关服务启动报错。
1. 彻底清除CSGHub服务命令如下
```
docker compose -f docker-compose.yml down -v
rm -rf gitdata gitlog
```
