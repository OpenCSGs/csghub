FROM registry.jihulab.com/opencsg/open-portal/ruby-node

SHELL ["/bin/bash", "-c"]
RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp
RUN bundle install