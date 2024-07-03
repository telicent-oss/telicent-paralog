const env = window;

const OFFLINE_ENABLED =
  env?.OFFLINE_STYLES &&
  env?.OFFLINE_STYLES_BASE_URL &&
  env?.OFFLINE_STYLES_PATH;

const OFFLINE_MODE = OFFLINE_ENABLED ?? false;

const config = {
  map: {
    maptilerToken:
      env?.MAP_TILER_TOKEN && !OFFLINE_MODE
        ? env.MAP_TILER_TOKEN
        : "offline_enabled",
    offline: {
      enabled: OFFLINE_MODE,
      styles: OFFLINE_MODE ? env?.OFFLINE_STYLES.split(",") : undefined,
      base_url: env?.OFFLINE_STYLES_BASE_URL,
      styles_path: env?.OFFLINE_STYLES_PATH,
    },
  },
  api: {
    url: env?.PARALOG_API_URL || "http://localhost:4001",
  },
  beta: env?.BETA ? Boolean(env.BETA) : false,
  services: {
    ontology: env?.ONTOLOGY_SERVICE_URL,
  },
};

if (!OFFLINE_MODE && !env?.MAP_TILER_TOKEN) {
  const errorMessage = `
  <strong>PROBLEM</strong>: Paralog needs <strong>MAP_TILER_TOKEN</strong> to be set!

  To fix this:
  1. Sign up for a free account at <a href="https://www.maptiler.com/" target="_blank">maptiler.com</a>
  2. Generate a new token
  3. Create a file named <strong>env-config.js</strong> 
     (Refer to  <strong>override.env-config.js</strong> for the correct format)
  4. Set <strong>MAP_TILER_TOKEN</strong> to your token in <strong>env-config.js</strong> file
  5. Run <strong>yarn start</strong> or <strong>yarn build</strong> 
      (Copies <strong>env-config.js</strong> into ./build & ./public)
`;

  const errorContainer = document.createElement("pre");
  errorContainer.innerHTML = errorMessage;

  // Apply CSS styles directly to the error message for visibility and styling
  errorContainer.style.position = "fixed";
  errorContainer.style.top = "50%";
  errorContainer.style.left = "50%";
  errorContainer.style.transform = "translate(-50%, -50%)";
  errorContainer.style.backgroundColor = "#666";
  errorContainer.style.color = "#FFF";
  errorContainer.style.padding = "20px";
  errorContainer.style.borderRadius = "8px";
  errorContainer.style.width = "80%";
  errorContainer.style.maxWidth = "550px";
  errorContainer.style.lineHeight = "2";
  errorContainer.style.boxSizing = "border-box";
  errorContainer.style.fontFamily = "Arial, Helvetica, sans-serif";
  errorContainer.style.whiteSpace = "pre-wrap";

  // Add the error message to the body of the document
  document.body.appendChild(errorContainer);

  // Additional CSS for links
  const styleElement = document.createElement("style");
  styleElement.textContent = `
  body {
    background-color: #333; /* Dark grey background for the body */
  }
  div a {
    color: #000;
    text-decoration: underline;
  }
  div a:hover {
    text-decoration: none;
  }
  div strong {
    color: #ff0;
  }
`;

  document.head.appendChild(styleElement);
  throw new Error(errorMessage);
}
export default config;
