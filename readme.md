- run `npm install`
- install typescript if you havnt already `npm install -g typescript`

run `tsc`
run `tar czf Backend.tar.gz interface services docker.js env.js index.js package.json package-lock.json tsconfig.json`

run `docker build -t imageName .`

To start the created image run `docker run imageName`
