FROM --platform=$BUILDPLATFORM opencsg-registry.cn-beijing.cr.aliyuncs.com/opencsg_public/go-node AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN mkdir /myapp
WORKDIR /myapp
ADD . /myapp

ENV CGO_ENABLED=0
RUN go mod tidy
RUN cd frontend && yarn install && yarn build
RUN GOOS=$(echo ${TARGETPLATFORM} | cut -f1 -d '/') \
    GOARCH=$(echo ${TARGETPLATFORM} | cut -f2 -d '/') \
    go build -o csghub-portal ./cmd/csghub-portal

FROM bitnami/minideb:latest
RUN apt update && apt install -y ca-certificates && update-ca-certificates
WORKDIR /myapp
COPY --from=builder /myapp/csghub-portal /myapp/csghub-portal