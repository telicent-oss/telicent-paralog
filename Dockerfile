FROM telicent/telicent-nginx1.27:latest
ARG APP_NAME
USER user
COPY "./$APP_NAME.sbom.json" /opt/telicent/sbom/sbom.json
COPY nginx/ /usr/local/nginx/conf/
COPY build/ /usr/local/nginx/html/

# run
EXPOSE 8080
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
