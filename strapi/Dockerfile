FROM node:20-alpine
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git \
    python3
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build
EXPOSE 1337
CMD ["npm", "run", "start"]