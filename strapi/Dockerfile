FROM node:20-alpine

# Build dependencies needed by native packages (e.g. sharp, better-sqlite3)
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

EXPOSE 1337

CMD ["npm", "run", "develop"]
