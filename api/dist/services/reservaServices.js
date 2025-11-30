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
const prisma_1 = __importDefault(require("../db/prisma"));
const reservaService = {
    getReservas(filtros) {
        return __awaiter(this, void 0, void 0, function* () {
            // Construir a consulta SQL dinamicamente
            const whereClauses = [];
            const params = [];
            let paramIndex = 1;
            if (filtros === null || filtros === void 0 ? void 0 : filtros.dataInicio) {
                whereClauses.push(`r.data >= $${paramIndex++}`);
                params.push(filtros.dataInicio);
            }
            if (filtros === null || filtros === void 0 ? void 0 : filtros.dataFim) {
                whereClauses.push(`r.data <= $${paramIndex++}`);
                params.push(filtros.dataFim);
            }
            if (filtros === null || filtros === void 0 ? void 0 : filtros.status) {
                whereClauses.push(`r.status = $${paramIndex++}`);
                params.push(filtros.status);
            }
            if (filtros === null || filtros === void 0 ? void 0 : filtros.userId) {
                whereClauses.push(`r."userId" = $${paramIndex++}`);
                params.push(filtros.userId);
            }
            const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
            const query = `
      SELECT 
        r.*,
        u.id as "usuarioId",
        u.nome as "usuarioNome",
        u.email as "usuarioEmail",
        u.telefone as "usuarioTelefone",
        u.apartamento as "usuarioApartamento"
      FROM 
        reservas r
      INNER JOIN 
        users u ON r."userId" = u.id
      ${whereClause}
      ORDER BY 
        r.data ASC, 
        r."horaInicio" ASC
    `;
            const reservas = yield prisma_1.default.$queryRawUnsafe(query, ...params);
            // Mapear os resultados para o formato esperado
            return reservas.map(reserva => (Object.assign(Object.assign({}, reserva), { usuario: {
                    id: reserva.usuarioId,
                    nome: reserva.usuarioNome,
                    email: reserva.usuarioEmail,
                    telefone: reserva.usuarioTelefone,
                    apartamento: reserva.usuarioApartamento
                } })));
        });
    },
    getReservaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT 
        r.*,
        u.id as "usuarioId",
        u.nome as "usuarioNome",
        u.email as "usuarioEmail",
        u.telefone as "usuarioTelefone",
        u.apartamento as "usuarioApartamento"
      FROM 
        reservas r
      INNER JOIN 
        users u ON r."userId" = u.id
      WHERE 
        r.id = $1
    `;
            const result = yield prisma_1.default.$queryRawUnsafe(query, id);
            if (result.length === 0)
                return null;
            const reserva = result[0];
            return Object.assign(Object.assign({}, reserva), { usuario: {
                    id: reserva.usuarioId,
                    nome: reserva.usuarioNome,
                    email: reserva.usuarioEmail,
                    telefone: reserva.usuarioTelefone,
                    apartamento: reserva.usuarioApartamento
                } });
        });
    },
    createReserva(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Verifica se o usuário existe
                const usuario = yield tx.user.findUnique({
                    where: { id: data.userId },
                    select: { id: true }
                });
                if (!usuario) {
                    const error = new Error('Usuário não encontrado');
                    error.code = 'P2003';
                    throw error;
                }
                // Cria a reserva usando query raw
                const insertQuery = `
        INSERT INTO reservas (data, "horaInicio", "horaFim", observacao, status, "userId", "criadoEm", "atualizadoEm")
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING *
      `;
                const reservaResult = yield tx.$queryRawUnsafe(insertQuery, data.data, data.horaInicio, data.horaFim, data.observacao || null, data.status || 'pendente', data.userId);
                if (!reservaResult || reservaResult.length === 0) {
                    throw new Error('Falha ao criar a reserva');
                }
                const reserva = reservaResult[0];
                // Busca os dados completos do usuário usando query raw
                const usuarioQuery = `
        SELECT id, nome, email, telefone, apartamento 
        FROM users 
        WHERE id = $1
      `;
                const usuarioResult = yield tx.$queryRawUnsafe(usuarioQuery, data.userId);
                if (!usuarioResult || usuarioResult.length === 0) {
                    throw new Error('Usuário não encontrado após criar reserva');
                }
                // Retorna a reserva com os dados do usuário
                return Object.assign(Object.assign({}, reserva), { usuario: usuarioResult[0] });
            }));
        });
    },
    updateReserva(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Verifica se a reserva existe
                const reservaExistente = yield tx.reserva.findUnique({
                    where: { id },
                    select: { id: true }
                });
                if (!reservaExistente) {
                    const error = new Error('Reserva não encontrada');
                    error.code = 'P2025';
                    throw error;
                }
                // Verifica se o usuário existe, se estiver sendo atualizado
                if (data.userId) {
                    const usuario = yield tx.user.findUnique({
                        where: { id: data.userId },
                        select: { id: true }
                    });
                    if (!usuario) {
                        const error = new Error('Usuário não encontrado');
                        error.code = 'P2003';
                        throw error;
                    }
                }
                // Prepara os dados de atualização
                const updateData = {
                    data: data.data,
                    horaInicio: data.horaInicio,
                    horaFim: data.horaFim,
                    observacao: data.observacao,
                    atualizadoEm: new Date()
                };
                // Adiciona o status se fornecido
                if (data.status) {
                    updateData.status = data.status;
                }
                // Adiciona o usuário se fornecido
                if (data.userId) {
                    updateData.userId = data.userId;
                }
                // Construir a consulta de atualização dinamicamente
                const updateFields = [];
                const updateParams = [];
                let paramIndex = 1;
                if (updateData.data) {
                    updateFields.push(`data = $${paramIndex++}`);
                    updateParams.push(updateData.data);
                }
                if (updateData.horaInicio) {
                    updateFields.push(`"horaInicio" = $${paramIndex++}`);
                    updateParams.push(updateData.horaInicio);
                }
                if (updateData.horaFim) {
                    updateFields.push(`"horaFim" = $${paramIndex++}`);
                    updateParams.push(updateData.horaFim);
                }
                if (updateData.observacao !== undefined) {
                    updateFields.push(`observacao = $${paramIndex++}`);
                    updateParams.push(updateData.observacao);
                }
                if (updateData.status) {
                    updateFields.push(`status = $${paramIndex++}`);
                    updateParams.push(updateData.status);
                }
                if (updateData.userId) {
                    updateFields.push(`"userId" = $${paramIndex++}`);
                    updateParams.push(updateData.userId);
                }
                // Sempre atualiza a data de atualização
                updateFields.push(`"atualizadoEm" = NOW()`);
                // Adiciona o ID como último parâmetro
                updateParams.push(id);
                const idParamIndex = paramIndex;
                const updateQuery = `
        UPDATE reservas
        SET ${updateFields.join(', ')}
        WHERE id = $${idParamIndex}
        RETURNING *
      `;
                const reservaAtualizada = yield tx.$queryRawUnsafe(updateQuery, ...updateParams);
                if (!reservaAtualizada || reservaAtualizada.length === 0) {
                    throw new Error('Falha ao atualizar a reserva');
                }
                // Busca os dados atualizados do usuário usando query raw
                const userId = updateData.userId || reservaAtualizada[0].userId;
                const usuarioQuery = `
        SELECT id, nome, email, telefone, apartamento 
        FROM users 
        WHERE id = $1
      `;
                const usuarioResult = yield tx.$queryRawUnsafe(usuarioQuery, userId);
                if (!usuarioResult || usuarioResult.length === 0) {
                    throw new Error('Usuário não encontrado após atualizar reserva');
                }
                // Retorna a reserva atualizada com os dados do usuário
                return Object.assign(Object.assign({}, reservaAtualizada[0]), { usuario: usuarioResult[0] });
            }));
        });
    },
    deleteReserva(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Verifica se a reserva existe
                const reserva = yield tx.reserva.findUnique({
                    where: { id },
                    select: { id: true }
                });
                if (!reserva) {
                    const error = new Error('Reserva não encontrada');
                    error.code = 'P2025';
                    throw error;
                }
                // Remove a reserva usando query raw
                yield tx.$queryRawUnsafe('DELETE FROM reservas WHERE id = $1', id);
            }));
        });
    },
    verificarConflitoHorario(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, horaInicio, horaFim, reservaId = null, userId }) {
            // Converte para objetos Date para garantir a consistência
            const dataInicio = new Date(data);
            const inicio = new Date(horaInicio);
            const fim = new Date(horaFim);
            // Construir a consulta SQL para verificar sobreposição de horários
            const queryParams = [dataInicio, inicio, fim];
            let paramIndex = 4;
            // Condição para ignorar a própria reserva em caso de atualização
            const notIdClause = reservaId ? `AND r.id != $${paramIndex++}` : '';
            if (reservaId) {
                queryParams.push(reservaId);
            }
            const query = `
      SELECT 
        r.*,
        u.id as "usuarioId",
        u.nome as "usuarioNome",
        u.apartamento as "usuarioApartamento"
      FROM 
        reservas r
      INNER JOIN 
        users u ON r."userId" = u.id
      WHERE 
        r.data = $1
        AND (
          -- Caso 1: O horário de início está dentro de uma reserva existente
          (r."horaInicio" <= $2 AND r."horaFim" > $2) OR
          -- Caso 2: O horário de término está dentro de uma reserva existente
          (r."horaInicio" < $3 AND r."horaFim" >= $3) OR
          -- Caso 3: A reserva cobre completamente outra reserva
          (r."horaInicio" >= $2 AND r."horaFim" <= $3) OR
          -- Caso 4: A reserva está contida dentro de outra reserva
          (r."horaInicio" <= $2 AND r."horaFim" >= $3)
        )
        ${notIdClause}
    `;
            // Executa a consulta
            const reservas = yield prisma_1.default.$queryRawUnsafe(query, ...queryParams);
            // Mapeia o resultado para o formato esperado
            return reservas.map(reserva => (Object.assign(Object.assign({}, reserva), { usuario: {
                    id: reserva.usuarioId,
                    nome: reserva.usuarioNome,
                    apartamento: reserva.usuarioApartamento,
                    // Campos opcionais que não são usados na verificação de conflito
                    email: '',
                    telefone: ''
                } })));
        });
    }
};
exports.default = reservaService;
