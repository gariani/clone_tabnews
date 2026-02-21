FROM node:20-bookworm

WORKDIR /curso.dev

USER root

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

USER node

EXPOSE "8080"

CMD ["sleep", "infinity"]