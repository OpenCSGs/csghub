## CSGHub产品一键部署使用说明

[English Version](./docs/all_in_one_readme_en.md)

使用该脚本可以一键部署一个all-in-one的CSGHub环境，包括前端后端以及其他所有相关的功能组件，包括：
* csghub-portal
* csghub-server
* nginx
* postgresql
* gitaly
* gitlab-shell
* minio
* casdoor
* account server
* user server
* space builder
* registry

**注意：**
1. CSGHhub v0.4.0支持了应用空间（即space）功能，v0.7.0支持了模型微调、推理等功能。而应用空间，模型微调以及推理等都需要Kubernetes以及其相关Knative组件的配置，基于compose部署不包括Kubernetes平台以及相关依赖Knative组件部署（这部分安装配置详见[Knative安装配置](https://opencsg.com/docs/csghub/101/helm/installation)），如果没有做对接Kubernetes平台，这里部署的CSGHub实例将`不包含应用空间，模型微调和推理`功能。
1. 可以使用CSGHub的[helm chart](https://github.com/OpenCSGs/CSGHub-helm)来安装完整版CSGHub实例，具体安装步骤可参见[CSGHub Helm Chart安装文档](https://opencsg.com/docs/csghub/101/helm/summary)


### 前置条件
* 硬件

最小配置: 2c CPU/8GB 内存/50GB 硬盘

推荐配置: 4c CPU/16GB 内存/500GB 硬盘

* 软件

x86_64架构的任意Linux OS

docker engine（>=5:20.10.24）

### 使用方法
1. 切换到all_in_one目录
2. 编辑.env文件，设置`SERVER_DOMAIN`为当前主机的ip地址或者自定义域名（域名可能会有备案问题，因此推荐使用ip地址，公网/内网ip皆可）。请不要使用`127.0.0.1`或者`localhost`。
3. 没有kubernetes情况下，.env中的其他配置可以忽略；和已有kubernetes集群的对接配置参见[对接kubernetes配置](#对接kubernetes)
4. 运行`startup.sh`脚本，待所有服务启动完毕，即可以通过`http://[SERVER_DOMAIN]:[SERVER_PORT]`访问到自部署的CSGHub服务。

详细使用方法可参看[使用文档](https://opencsg.com/docs/)

### 注意事项
1. 自部署CSGHub使用local类型的docker volume来进行相关持久化，比如postgresql，minio。请确保docker local volume有足够的磁盘空间。
1. 确保主机的`2222`对外端口正常，否则无法以ssh协议进行git操作。
1. 确保主机的`31001`对外端口正常，这是用于提供用户注册登录的casdoor服务使用的。
1. 可通过主机的`9001`端口访问minio console，如果不需要访问minio console，该端口可关闭。
1. 默认只支持http协议的CSGHub服务，如果要https协议，需要自行更改相关配置。
1. 彻底清除CSGHub服务命令如下
```
docker compose -f docker-compose.yml down -v
```

## 对接kubernetes
### 前置条件

* Kubernetes版本 > 1.20+
* 服务器配置最低 8c16g，X86_64架构（暂不支持非X86_64系统架构）
* Kubernetes可以使用多种部署方式，比如Docker Desktop，[K3s](https://docs.k3s.io/quick-start), [Kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
* 使用compose安装脚本运行的CSGhub实例

### 依赖组件安装配置

Kubernetes集群中依赖的Knative相关组件的安装配置详见[Knative安装配置](https://opencsg.com/docs/csghub/101/helm/installation)

### CSGHub安装配置更改

更改CSGHub实例的配置信息，与指定Kubernetes集群对接。假设有如下已知信息：
* CSGHub实例所在主机ip：110.95.70.140
* Kubernetes集群master节点：101.201.52.76； worker节点：59.10.62.160  注意：Kubernetes集群的master和worker可以在同一个节点上
* Knative网络组件采用`NodePort`方式，且NodePort为`30541`。相关配置见[knative网络服务配置](https://opencsg.com/docs/csghub/101/helm/installation#%E5%AE%89%E8%A3%85%E7%BD%91%E7%BB%9C%E7%BB%84%E4%BB%B6)   
* CSGHub实例上docker daemon服务开启TCP访问，端口为`31375`,以作为space builder服务器节点使用。dockerd开启TCP方法参见[文档](https://docs.docker.com/engine/daemon/)


#### 更改CSGHub配置
依据以上信息，首先更改`.env`文件内容如下：
```
# Common Configuration
## csghub service's domain name, can be ip or domain name
SERVER_DOMAIN=110.95.70.140
SERVER_PORT=80


## Casdoor Configuration
SERVER_CASDOOR_PORT=31001

## Default csghub server token. A 128-bit string consisting of numbers and lowercase letters.
HUB_SERVER_API_TOKEN=c7ab4948c36d6ecdf35fd4582def759ddd820f8899f5ff365ce16d7185cb2f609f3052e15681e931897259872391cbf46d78f4e75763a0a0633ef52abcdc840c

## Space Configuration
### The namespace that user's space app will use
SPACE_APP_NS=space

### User space app's internal domain name. It is knative network layer endpoint, it can be an internal lb or ip which will not be exposed to external
SPACE_APP_INTERNAL_DOMAIN=app.internal
### if internal domain uses lb service, it should be 80 or 443
SPACE_APP_INTERNAL_DOMAIN_PORT=30541
## User space app's external domain name (it should be a wildcard domain, CAN NOT BE ip address!!)
SPACE_APP_EXTERNAL_DOMAIN= 

### space builder sever. the docker daemon that used to build space image, such as "59.110.62.16:31375"
SPACE_BUILDER_SERVER=110.95.70.140:31375


## Registry configuration
DOCKER_REGISTRY_SECRET=space-registry-credential
DOCKER_REGISTRY_SERVER=110.95.70.140:5000
DOCKER_REGISTRY_USERNAME=csghub
DOCKER_REGISTRY_PASSWD=csghub@2024!
DOCKER_REGISTRY_NS=opencsg_space

## Knative gateway Configuration
### The namespace that user's  app will use
#KNATIVE_APP_NS=space
### It is knative network layer endpoint, it can be an internal lb or ip which will not be exposed to external
#KNATIVE_DOMAIN=app.internal
#### the expose ip or host that can visit knative service, it can be lb or k8s worker ip (using nodeport)
KNATIVE_GATEWAY_HOST=59.10.62.160
### if knative domain uses lb service, it should be 80 or 443
KNATIVE_GATEWAY_PORT=30541
```

将Kubernetes集群的kube config文件放在CSGHub安装目录的`.kube`文件夹下

重启CSGHub服务: 
```
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d
```

#### 更改Kubernetes集群


* Kubernetes中新建目标命名空间和secret对象
```
kubectl create ns space

kubectl create secret docker-registry space-registry-credential --docker-server=110.95.70.140:5000 --docker-username=csghub --docker-password=csghub@2024!  -n space 
```

* 配置Kubernetes节点可以使用CSGHub的docker registry

CSGHub默认安装使用的是一个insecure registry（即上面提到的: 110.95.70.140:5000），需要确保Kubernetes能从该registry中拉取镜像，在kubernetes每个worker节点执行如下操作：

配置前请确认配置文件`/etc/containerd/config.toml`是否存在，如果不存在可以通过如下命令进行创建。

        ```shell
        mkdir -p /etc/containerd/ && containerd config default >/etc/containerd/config.toml
        ```

1. 配置 config_path

   - Containerd 2.x

     ```toml
      version = 3
            
      [plugins."io.containerd.cri.v1.images".registry]
           config_path = "/etc/containerd/certs.d"
     ```

   - Containerd 1.x

     ```toml
     version = 2
            
     [plugins."io.containerd.grpc.v1.cri".registry]
          config_path = "/etc/containerd/certs.d"
     ```

需要重启节点上`containerd`服务。

2. 配置 hosts.toml

   ```shell
   mkdir /etc/containerd/certs.d/110.95.70.140:5000 
            
   cat <<EOF > /etc/containerd/certs.d/110.95.70.140:5000/hosts.toml
   server = "http://110.95.70.140:5000"
            
   [host."http://110.95.70.140:5000"]
           capabilities = ["pull", "resolve", "push"]
           skip_verify = true
   EOF
   ```

*注意：此配置直接生效，无须重启*
