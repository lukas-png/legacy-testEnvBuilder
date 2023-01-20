- run `npm install`
- install typescript if you havnt already `npm install -g typescript`

run `tsc`
run `tar czf Client.tar.gz interface services docker.ts env.ts index.ts package.json package-lock.json tsconfig.json`

run `docker build -t imageName .`

To start the created image run `docker run imageName`
