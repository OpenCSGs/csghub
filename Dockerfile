FROM git-devops.opencsg.com:5050/product/community/open-portal/ruby-node

SHELL ["/bin/bash", "-c"]
RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp
RUN yarn config set registry 'https://mirrors.huaweicloud.com/repository/npm/'
RUN yarn install
RUN bundle install
