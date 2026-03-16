FROM node:20-bookworm

WORKDIR /curso.dev

USER root

RUN apt-get update && \
    apt-get install -y curl nano postgresql && \
    rm -rf /var/lib/apt/lists/*

USER node

EXPOSE "3000"

CMD ["sleep", "infinity"]