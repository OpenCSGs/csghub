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
## check for root, OS etc..
initialCheck

source ${CURRENT_DIR}/.env
set | grep  -E "SERVER_DOMAIN=[0-9a-z.]*" >>  /dev/null
if [[ $? -ne 0 ]]; then
       echo "SERVER_DOMAIN is not set, you should set a valid domain name, such as 121.11.40.42 or demo.opencsg.com etc.."
       exit 1
fi

echo "1. replace domain name and space external domane name in nginx.conf"
echo "the configured domain name is ${SERVER_DOMAIN}"
echo "the configured domain name is ${SPACE_APP_EXTERNAL_DOMAIN}"
sed -i "s/_CSGHUB_DOMAINNAME/${SERVER_DOMAIN}/g" ${nginx_conf}
sed -i "s/_CSGHUB_DOMAINPORT/${SERVER_PORT}/g" ${nginx_conf}
sed -i "s/_CSGHUB_SPACE_EXTERNAL_DOMAINNAME/${SPACE_APP_EXTERNAL_DOMAIN}/g" ${nginx_conf}

echo "replace domain name and port in casdoor's init_data.json"
sed -i "s/_CSGHUB_DOMAINNAME/${SERVER_DOMAIN}/g" ${casdoor_init_data_conf}
sed -i "s/_CSGHUB_DOMAINPORT/${SERVER_PORT}/g" ${casdoor_init_data_conf}

 if [ "$KNATIVE_GATEWAY_HOST" != "" ]; then
    echo "start to configure knative gateway"
    rproxy_nginx_conf=${CURRENT_DIR}/rproxy_nginx/nginx.conf
    sed -i "s/_CSGHUB_KNATIVE_GATEWAY_HOST/${KNATIVE_GATEWAY_HOST}/g" ${rproxy_nginx_conf}
    sed -i "s/_CSGHUB_KNATIVE_GATEWAY_PORT/${KNATIVE_GATEWAY_PORT}/g" ${rproxy_nginx_conf}
 fi

echo "2. prepare and check mounted folder"
gitdata_folder=${CURRENT_DIR}/gitdata
gitlog_folder=${CURRENT_DIR}/gitlog

if [[ -d "$gitdata_folder" ]]; then
    echo "gitdata folder already exits, ignore it"
else
    echo "gitdata floder does not exist, will create it automaticlly"
    mkdir gitdata
    chown 1001:1001 gitdata
fi

if [[ -d "$gitlog_folder" ]]; then
    echo "gitlog folder already exits, ignore it"
else
    echo "gitlog floder does not exist, will create it automaticlly"
    mkdir gitlog
    chown 1001:1001 gitlog
fi

echo "3. start the whole service"
docker compose -f docker-compose.yml up -d

echo "the service status is :\n"
docker compose -f docker-compose.yml ps

echo -e "======================= Installation Completed =======================\n"
CSG_URL="http://${SERVER_DOMAIN}"
echo -e "CSGHub service can be visited by URL:\n ${CSG_URL}"