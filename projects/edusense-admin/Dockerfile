# base image
FROM node:12.16.3 as builder
MAINTAINER Pinank Lakhani <pinank.lakhani@smartsensesolutions.com>

# set working directory
RUN mkdir -p /usr/src/app/edusense/projects
WORKDIR /usr/src/app/edusense

RUN npm set progress=false

RUN npm install -g typescript
RUN npm install -g @angular/cli@9.1.5 --unsafe

#RUN ng update @angular/cli @angular/core

RUN npm install typescript@3.8.3 --save-dev
#RUN ng update @angular/material
RUN npm install --save-dev @angular-devkit/build-angular@0.12.4

COPY ./tsconfig.json /usr/src/app/edusense/tsconfig.json
COPY ./angular.json /usr/src/app/edusense/angular.json
COPY ./package.json /usr/src/app/edusense/package.json
COPY ./tsconfig.app.json /usr/src/app/edusense/tsconfig.app.json
RUN npm install

#Copy utility lib
COPY ./projects/utility-lib /usr/src/app/edusense/projects/utility-lib

#build utility lib
RUN ng build utility-lib
RUN npm install dist/utility-lib

COPY ./projects/edusense-admin /usr/src/app/edusense/projects/edusense-admin

ARG APP_ENV

RUN ng build --project='edusense-admin' --configuration=$APP_ENV

FROM nginx:1.15.8

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/edusense/dist/edusense-admin /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d

EXPOSE 80
