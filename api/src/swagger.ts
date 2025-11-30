// src/swagger.ts
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "API Reserva de Salão de Festas",
        version: "1.0.0",
        description: "API para gerenciamento de reservas e usuários.",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Servidor local"
        },
      ],
      basePath: "/api"
    },
    apis: ["./src/routes/*.ts"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}