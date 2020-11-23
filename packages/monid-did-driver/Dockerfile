FROM node:12.18

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .

# lockfile is only available in root dir of monorepo, unresolved issue in yarn workspaces: https://github.com/yarnpkg/yarn/issues/5428
# COPY yarn.lock .

# Install all Packages
RUN yarn install

# Copy all other source code to work directory
ADD /build/ /usr/src/app/build/
CMD [ "node", "build/index.js" ]
EXPOSE 3000