import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food App API",
      version: "1.0.0",
      description: "API documentation for Food App",
    },
    servers: [
      { url: "http://localhost:5000" },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}