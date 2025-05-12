# Instructions

## Pre-requisites
- Docker
- Docker Compose
- Triplestore

## Configure Config Files
```javascript
// env.config.js
window.API_URL = "http://localhost:4001";
window.PARALOG_API_URL = "";
window.ONTOLOGY_SERVICE_URL = "http://localhost:3030/";
window.BETA = "true";
window.OFFLINE_STYLES = "";
window.OFFLINE_STYLES_PATH = "";
window.OFFLINE_STYLES_BASE_URL = "";

// secret-config.js
window.MAP_TILER_TOKEN = "TokenGoesHere";
```

### How to get map tiler token
Follow the instructions on the [maptiler](https://docs.maptiler.com/cloud/api/authentication-key/#api-key) website.

## Modify docker-compose.yaml volumes
```yaml
  paralog-ui:
    image: telicent/telicent-paralog
    volumes: 
      - <path/to/local/file>:/usr/local/nginx/html/env-config.js
      - <path/to/local/file>:/usr/local/nginx/html/secret-config.js
```

> Note: Check the ports you have started your services on and ensure the docker file uses the correct ports.

In a terminal run `docker compose up`
