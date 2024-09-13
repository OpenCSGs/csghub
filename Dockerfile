FROM git-devops.opencsg.com:5050/product/community/csghub-portal/go-node AS build
RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp

RUN go mod tidy
RUN cd frontend && yarn install && yarn build
RUN go build -o csghub-portal ./cmd/csghub-portal

FROM bitnami/minideb:latest
WORKDIR /myapp
COPY --from=build /myapp/csghub-portal /myapp/csghub-portal
