FROM git-devops.opencsg.com:5050/product/community/open-portal/ruby-node

RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp

RUN yarn config set registry 'https://mirrors.huaweicloud.com/repository/npm/' \
  && yarn install \
  && bundle install \
  && yarn cache clean

RUN rm -rf \
       /var/cache/apk/* \
       /var/lib/cache/* \
       /var/lib/log/* \
       /var/tmp/* \
       /tmp/*
