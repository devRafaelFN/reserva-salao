"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservaControllers_1 = __importDefault(require("../controllers/reservaControllers"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: CRUD de reservas
 */
/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista todas as reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 */
router.get("/reservas", reservaControllers_1.default.getReservas);
/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Retorna uma reserva pelo ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva não encontrada
 */
router.get("/reservas/:id", reservaControllers_1.default.getReservaById);
/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post("/reservas", reservaControllers_1.default.createReserva);
/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Atualiza uma reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservaInput'
 *     responses:
 *       200:
 *         description: Reserva atualizada com sucesso
 *       404:
 *         description: Reserva não encontrada
 */
router.put("/reservas/:id", reservaControllers_1.default.updateReserva);
/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Remove uma reserva pelo ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva removida com sucesso
 *       404:
 *         description: Reserva não encontrada
 */
router.delete("/reservas/:id", reservaControllers_1.default.deleteReserva);
/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         data:
 *           type: string
 *           format: date-time
 *         horaInicio:
 *           type: string
 *           format: date-time
 *         horaFim:
 *           type: string
 *           format: date-time
 *         observacao:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: integer
 *     ReservaInput:
 *       type: object
 *       required:
 *         - data
 *         - horaInicio
 *         - horaFim
 *         - userId
 *       properties:
 *         data:
 *           type: string
 *           format: date-time
 *         horaInicio:
 *           type: string
 *           format: date-time
 *         horaFim:
 *           type: string
 *           format: date-time
 *         observacao:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: integer
 */
exports.default = router;
