"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userControllers_1 = __importDefault(require("../controllers/userControllers"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: CRUD de usuários
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nome
 *         - email
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
 *     UserInput:
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
 *           minLength: 3
 *           maxLength: 100
 *           example: João da Silva
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *           example: joao@exemplo.com
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 100
 *           example: senha123
 *           description: Senha do usuário (mínimo de 6 caracteres)
 *         telefone:
 *           type: string
 *           minLength: 10
 *           maxLength: 20
 *           example: "11999999999"
 *         apartamento:
 *           type: integer
 *           minimum: 1
 *           maximum: 9999
 *           example: 101
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Erro ao processar a requisição
 *         details:
 *           type: string
 *           example: Mensagem detalhada do erro
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", userControllers_1.default.getUsers);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/users/:id", userControllers_1.default.getUserById);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: E-mail já está em uso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/users", userControllers_1.default.createUser);
/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/users/:id", userControllers_1.default.updateUser);
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/users/:id", userControllers_1.default.deleteUser);
exports.default = router;
