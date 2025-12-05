import express, { Express } from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import reservaRoutes from "./routes/reservaRoutes";
import authRoutes from "./routes/authRoutes";
import { setupSwagger } from "./swagger";

const app: Express = express();
const port: number = 3000;

import { Request, Response } from 'express'; // <--- Garanta esta importação

app.get('/', (req: Request, res: Response) => { // <--- Tipagem explícita aqui
    res.send('API is running!');
});

// Habilita o CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json());

// Rota de teste geral da API
app.get("/api", (req, res) => {
  res.send("Bem-vindo à API Reserva de Salão de Festas!");
});

// Rotas da API
app.use("/api", userRoutes);
app.use("/api", reservaRoutes);
app.use("/api", authRoutes);

// Configura o Swagger
setupSwagger(app);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
