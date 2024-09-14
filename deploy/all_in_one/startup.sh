#!/bin/bash

function log() {
   message="[CSGHub Log]: $1 "
   echo -e "${message}" 2>&1 | tee -a ${CURRENT_DIR}/install.log
}

CURRENT_DIR=$(
   cd "$(dirname "$0")"
   pwd
)

function initialCheck(){
 if [ "$EUID" -ne 0 ]; then
      echo "You need to run this script as root!"
      exit 1
 fi

 if [ -z "$SERVER_DOMAIN" ]; then
    echo "SERVER_DOMAIN is required, please specify in .env file"
    exit 1
 fi

 if [ "$KNATIVE_GATEWAY_HOST" != "" ]; then
    echo "Tip 1:Please make sure namespace space was created in k8s cluster"
    echo "Tip 1:Please make sure the gateway can be accessed in csghub server: telnet $KNATIVE_GATEWAY_HOST $KNATIVE_GATEWAY_PORT"
 fi

 checkOS

}


function checkOS(){
  arch_info=`arch`
  if [[ $arch_info !=  "x86_64" && $arch_info != "amd64"  ]]; then
    echo "Current OS arch is $arch_info, Only x86_64 and amd64 are supported!"
          exit 1
  fi
}

nginx_conf=${CURRENT_DIR}/nginx/nginx.conf
casdoor_init_data_conf=${CURRENT_DIR}/casdoor/conf/init_data.json
gitaly_keys_folder=${CURRENT_DIR}/data/gitlab-shell/keys

source ${CURRENT_DIR}/.env

## check for root, OS etc..
initialCheck

set | grep  -E "SERVER_DOMAIN=[0-9a-z.]*" >>  /dev/null
if [[ $? -ne 0 ]]; then
       echo "SERVER_DOMAIN is not set, you should set a valid domain name, such as 121.11.40.42 or demo.opencsg.com etc.."
       exit 1
fi

echo "1. replace domain name and space external domane name in nginx.conf"
echo "the configured domain name is ${SERVER_DOMAIN}"
sed -i "s/_CSGHUB_DOMAINNAME/${SERVER_DOMAIN}/g" ${nginx_conf}
sed -i "s/_CSGHUB_DOMAINPORT/${SERVER_PORT}/g" ${nginx_conf}

echo "replace domain name and port in casdoor's init_data.json"
sed -i "s/_CSGHUB_DOMAINNAME/${SERVER_DOMAIN}/g" ${casdoor_init_data_conf}
sed -i "s/_CSGHUB_DOMAINPORT/${SERVER_PORT}/g" ${casdoor_init_data_conf}

 if [ "$KNATIVE_GATEWAY_HOST" != "" ]; then
    echo "start to configure knative gateway"
    rproxy_nginx_conf=${CURRENT_DIR}/rproxy_nginx/nginx.conf
    sed -i "s/_CSGHUB_KNATIVE_GATEWAY_HOST/${KNATIVE_GATEWAY_HOST}/g" ${rproxy_nginx_conf}
    sed -i "s/_CSGHUB_KNATIVE_GATEWAY_PORT/${KNATIVE_GATEWAY_PORT}/g" ${rproxy_nginx_conf}
 fi

echo "2. prepare and generate key pairs for gitaly and gitlab-shell"
if [[ -d "$gitaly_keys_folder" ]]; then
    echo "gitaly keys folder already exits, ignore it"
else
    echo "gitaly keys folder does not exist, will create it automaticlly"
    mkdir -p $gitaly_keys_folder
fi

echo "generate 3 kinds of key pair: rsa, ecdsa, ed25519"
if [[ ! -e "$gitaly_keys_folder/ssh_host_rsa_key" ]]; then
       ssh-keygen -t rsa  -N "" -f $gitaly_keys_folder/ssh_host_rsa_key
else
	echo "ssh_host_rsa_key pair already exists"
fi

if [[ ! -e "$gitaly_keys_folder/ssh_host_ecdsa_key" ]]; then
        ssh-keygen -t ecdsa  -N "" -f $gitaly_keys_folder/ssh_host_ecdsa_key
else
        echo "ssh_host_ecdsa_key pair already exists"
fi

if [[ ! -e "$gitaly_keys_folder/ssh_host_ed25519_key" ]]; then
       ssh-keygen -t ed25519  -N "" -f $gitaly_keys_folder/ssh_host_ed25519_key
else
        echo "ssh_host_ed25519_key pair already exists"
fi


echo "3. start the whole service"
docker compose -f docker-compose.yml up -d

echo "the service status is :\n"
docker compose -f docker-compose.yml ps

echo -e "======================= Installation Completed =======================\n"
CSG_URL="http://${SERVER_DOMAIN}"
echo -e "CSGHub service can be visited by URL:\n ${CSG_URL}"
