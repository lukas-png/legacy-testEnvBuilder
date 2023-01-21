[![Docker](https://github.com/lukas-png/legacy-testEnvBuilder/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/lukas-png/legacy-testEnvBuilder/actions/workflows/docker-publish.yml)



- run `npm install`
- install typescript if you havnt already `npm install -g typescript`

- run `tsc`

- run `tar czf Client.tar.gz interface services docker.ts env.ts index.ts package.json package-lock.json tsconfig.json`

- run `docker build -t imageName .`

To start the created image run `docker run imageName`
