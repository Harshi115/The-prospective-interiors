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
ENV NODE_OPTIONS="--max-old-space-size=460"
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 1337
CMD ["npm", "run", "start"]