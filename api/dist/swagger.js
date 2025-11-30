"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
// src/swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
function setupSwagger(app) {
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
    const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
}
