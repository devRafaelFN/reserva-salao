"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reservaRoutes_1 = __importDefault(require("./routes/reservaRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
const port = 3000;
// Habilita o CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Middleware para parsear JSON
app.use(express_1.default.json());
// Rota de teste geral da API
app.get("/api", (req, res) => {
    res.send("Bem-vindo à API Reserva de Salão de Festas!");
});
// Rotas da API
app.use("/api", userRoutes_1.default);
app.use("/api", reservaRoutes_1.default);
app.use("/api", authRoutes_1.default);
// Configura o Swagger
(0, swagger_1.setupSwagger)(app);
// Inicializa o servidor
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
