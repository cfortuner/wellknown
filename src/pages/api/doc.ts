import { withSwagger } from "next-swagger-doc";

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Wellknown",
      description: "A registry of AI Plugins.",
      contact: {
        name: "Wellknown",
        url: "https://wellknown.ai",
        email: "cfortuner@gmail.com",
      },
      "x-logo": {
        url: "http://localhost:3001/logo.png",
      },
    },
    servers: [
      {
        url: "https://wellknown.ai/api",
      },
    ],
    paths: {
      "/plugins": {
        get: {
          operationId: "getProvider",
          tags: ["Plugins"],
          summary: "List all the Wellknown AI Plugins.",
          description:
            "List all the Wellknown AI Plugins. Returns ai-plugin.json objects in an array",
          parameters: [],
          responses: {
            "200": {
              description: "OK",
            },
          },
        },
      },
    },
  },
  apiFolder: "pages/api",
});

export default swaggerHandler();
