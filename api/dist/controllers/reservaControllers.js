"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reservaServices_1 = __importDefault(require("../services/reservaServices"));
const schemas_1 = require("../validations/schemas");
const validation_1 = require("../utils/validation");
// Status permitidos para reservas
const STATUS_PERMITIDOS = ["pendente", "confirmada", "cancelada", "finalizada"];
// Valida se a data é futura
const validarDataFutura = (data) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data >= hoje;
};
// Valida se o horário está dentro do expediente (8h às 22h)
const validarHorarioFuncionamento = (hora) => {
    const horas = hora.getHours();
    return horas >= 8 && horas < 22;
};
const reservaController = {
    getReservas: [
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const reservas = yield reservaServices_1.default.getReservas();
            res.json(reservas);
        })
    ],
    getReservaById: [
        validation_1.validateId,
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = res.locals.validatedId;
                const reserva = yield reservaServices_1.default.getReservaById(id);
                if (!reserva) {
                    res.status(404).json({ message: "Reserva não encontrada" });
                    return;
                }
                res.json(reserva);
            }
            catch (error) {
                next(error);
            }
        })
    ],
    createReserva: [
        (0, validation_1.validate)(schemas_1.reservaSchema, 'body'),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { data, horaInicio, horaFim, userId } = req.body;
                // Conversão das datas
                const dataReserva = new Date(data);
                const inicio = new Date(horaInicio);
                const fim = new Date(horaFim);
                // Validações de data/horário
                if (!validarDataFutura(dataReserva)) {
                    res.status(400).json({
                        message: "Erro ao criar reserva",
                        details: "A data da reserva deve ser futura"
                    });
                    return;
                }
                if (fim <= inicio) {
                    res.status(400).json({
                        message: "Erro ao criar reserva",
                        details: "O horário de término deve ser posterior ao horário de início"
                    });
                    return;
                }
                if (!validarHorarioFuncionamento(inicio) || !validarHorarioFuncionamento(fim)) {
                    res.status(400).json({
                        message: "Erro ao criar reserva",
                        details: "O horário da reserva deve ser entre 8h e 22h"
                    });
                    return;
                }
                // Verifica conflitos de horário
                const conflitos = yield reservaServices_1.default.verificarConflitoHorario({
                    data: dataReserva,
                    horaInicio: inicio,
                    horaFim: fim,
                    reservaId: null, // Nova reserva, não tem ID ainda
                    userId
                });
                if (conflitos.length > 0) {
                    res.status(409).json({
                        message: "Erro ao criar reserva",
                        details: "Já existe uma reserva para este horário"
                    });
                    return;
                }
                const reserva = yield reservaServices_1.default.createReserva(Object.assign(Object.assign({}, req.body), { data: dataReserva, horaInicio: inicio, horaFim: fim, status: 'pendente' // Define status padrão
                 }));
                res.status(201).json(reserva);
            }
            catch (error) {
                if (error.code === 'P2003') {
                    res.status(400).json({
                        message: "Erro ao criar reserva",
                        details: "O ID do usuário fornecido não existe"
                    });
                }
                else if (error.code === 'P2002') {
                    res.status(409).json({
                        message: "Erro ao criar reserva",
                        details: "Conflito de horário com reserva existente"
                    });
                }
                else {
                    next(error);
                }
            }
        })
    ],
    updateReserva: [
        validation_1.validateId,
        (0, validation_1.validate)(schemas_1.reservaUpdateSchema, 'body'),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = res.locals.validatedId;
                const updateData = Object.assign({}, req.body);
                // Busca a reserva existente
                const reservaExistente = yield reservaServices_1.default.getReservaById(id);
                if (!reservaExistente) {
                    res.status(404).json({
                        message: "Reserva não encontrada",
                        details: "O ID fornecido não corresponde a nenhuma reserva"
                    });
                    return;
                }
                // Verifica se a reserva pode ser alterada
                if (reservaExistente.status === 'cancelada' || reservaExistente.status === 'finalizada') {
                    res.status(400).json({
                        message: "Erro ao atualizar reserva",
                        details: "Reservas canceladas ou finalizadas não podem ser alteradas"
                    });
                    return;
                }
                // Processa as datas
                const dataReserva = updateData.data ? new Date(updateData.data) : new Date(reservaExistente.data);
                const inicio = updateData.horaInicio ? new Date(updateData.horaInicio) : new Date(reservaExistente.horaInicio);
                const fim = updateData.horaFim ? new Date(updateData.horaFim) : new Date(reservaExistente.horaFim);
                const userId = updateData.userId || reservaExistente.userId;
                // Validações de data/horário
                if (!validarDataFutura(dataReserva)) {
                    res.status(400).json({
                        message: "Erro ao atualizar reserva",
                        details: "A data da reserva deve ser futura"
                    });
                    return;
                }
                if (fim <= inicio) {
                    res.status(400).json({
                        message: "Erro ao atualizar reserva",
                        details: "O horário de término deve ser posterior ao horário de início"
                    });
                    return;
                }
                if (!validarHorarioFuncionamento(inicio) || !validarHorarioFuncionamento(fim)) {
                    res.status(400).json({
                        message: "Erro ao atualizar reserva",
                        details: "O horário da reserva deve ser entre 8h e 22h"
                    });
                    return;
                }
                // Verifica conflitos de horário, exceto com a própria reserva
                const conflitos = yield reservaServices_1.default.verificarConflitoHorario({
                    data: dataReserva,
                    horaInicio: inicio,
                    horaFim: fim,
                    reservaId: id, // ID da reserva atual para evitar conflito com ela mesma
                    userId
                });
                if (conflitos.length > 0) {
                    res.status(409).json({
                        message: "Erro ao atualizar reserva",
                        details: "Já existe outra reserva para este horário"
                    });
                    return;
                }
                // Atualiza as datas no objeto de atualização
                updateData.data = dataReserva;
                updateData.horaInicio = inicio;
                updateData.horaFim = fim;
                // Valida o status, se fornecido
                if (updateData.status && !STATUS_PERMITIDOS.includes(updateData.status)) {
                    res.status(400).json({
                        message: "Erro ao atualizar reserva",
                        details: `Status inválido. Os status permitidos são: ${STATUS_PERMITIDOS.join(', ')}`
                    });
                    return;
                }
                const reserva = yield reservaServices_1.default.updateReserva(id, updateData);
                res.json(reserva);
            }
            catch (error) {
                if (error.code === 'P2025') {
                    res.status(404).json({
                        message: "Reserva não encontrada",
                        details: "O ID fornecido não corresponde a nenhuma reserva"
                    });
                }
                else if (error.code === 'P2002') {
                    res.status(409).json({
                        message: "Erro ao atualizar reserva",
                        details: "Conflito de horário com reserva existente"
                    });
                }
                else if (error.code === 'P2003') {
                    res.status(400).json({
                        message: "Erro ao atualizar reserva",
                        details: "O ID do usuário fornecido não existe"
                    });
                }
                else {
                    next(error);
                }
            }
        })
    ],
    deleteReserva: [
        validation_1.validateId,
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = res.locals.validatedId;
                // Verifica se a reserva existe e se pode ser cancelada
                const reserva = yield reservaServices_1.default.getReservaById(id);
                if (!reserva) {
                    res.status(404).json({
                        message: "Reserva não encontrada",
                        details: "O ID fornecido não corresponde a nenhuma reserva"
                    });
                    return;
                }
                // Verifica se a reserva já foi finalizada
                if (reserva.status === 'finalizada') {
                    res.status(400).json({
                        message: "Não é possível cancelar a reserva",
                        details: "Reservas já finalizadas não podem ser canceladas"
                    });
                    return;
                }
                // Em vez de deletar, atualiza o status para cancelado
                yield reservaServices_1.default.updateReserva(id, { status: 'cancelada' });
                res.status(204).send();
            }
            catch (error) {
                if (error.code === 'P2025') {
                    res.status(404).json({
                        message: "Reserva não encontrada",
                        details: "O ID fornecido não corresponde a nenhuma reserva"
                    });
                }
                else {
                    next(error);
                }
            }
        })
    ],
};
exports.default = reservaController;
