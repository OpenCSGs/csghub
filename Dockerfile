FROM git-devops.opencsg.com:5050/product/community/csghub-portal/go-node

RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp

RUN go mod tidy
RUN cd frontend && yarn install && yarn build
RUN	go build -o /usr/local/bin/csghub-portal ./cmd/csghub-portal
