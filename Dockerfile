# See ./scripts/docker-build for APP_NAME & BASE_IMAGE setting
ARG APP_NAME
ARG BASE_IMAGE=nginx:stable-alpine
FROM ${BASE_IMAGE} as build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html/paralog
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html/paralog
COPY instance.sbom.json /opt/telicent/sbom/sbom.json
EXPOSE 8080

CMD [ "nginx", "-g", "daemon off;" ]