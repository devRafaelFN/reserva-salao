"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - password
 *         - telefone
 *         - apartamento
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         nome:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário (deve ser único)
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário (mínimo 6 caracteres)
 *         telefone:
 *           type: string
 *           description: Número de telefone do usuário
 *         apartamento:
 *           type: integer
 *           description: Número do apartamento do usuário
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do usuário
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: usuario@exemplo.com
 *         password:
 *           type: string
 *           format: password
 *           example: senha123
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - password
 *         - telefone
 *         - apartamento
 *       properties:
 *         nome:
 *           type: string
 *           example: João da Silva
 *         email:
 *           type: string
 *           format: email
 *           example: joao@exemplo.com
 *         password:
 *           type: string
 *           format: password
 *           example: senha123
 *         telefone:
 *           type: string
 *           example: 11999999999
 *         apartamento:
 *           type: integer
 *           example: 101
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Usuário registrado com sucesso
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Erro ao processar a requisição
 *         error:
 *           type: string
 *           example: Mensagem detalhada do erro
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth/register', authController_1.register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/auth/login', authController_1.login);
exports.default = router;
