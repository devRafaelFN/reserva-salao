import { Request, Response, NextFunction } from "express";
import reservaService from "../services/reservaServices";
import { Reserva } from "../generated/prisma";
import { reservaSchema, reservaUpdateSchema } from "../validations/schemas";
import { validate, validateId } from "../utils/validation";
import { z } from "zod";

// Status permitidos para reservas
const STATUS_PERMITIDOS = ["pendente", "confirmada", "cancelada", "finalizada"] as const;
type StatusReserva = typeof STATUS_PERMITIDOS[number];

// Valida se a data é futura
const validarDataFutura = (data: Date) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return data >= hoje;
};

// Valida se o horário está dentro do expediente (8h às 22h)
const validarHorarioFuncionamento = (hora: Date) => {
  const horas = hora.getHours();
  return horas >= 8 && horas < 22;
};

const reservaController = {
  getReservas: [
    async (req: Request, res: Response): Promise<void> => {

      try {
        const includeCancelled = String(req.query.includeCancelled || '').toLowerCase() === 'true';
        const statusFilter = typeof req.query.status === 'string' ? req.query.status : undefined;

        let reservas: Reserva[] = [];

        if (statusFilter) {
          reservas = await reservaService.getReservas({ status: statusFilter });
        } else {
          reservas = await reservaService.getReservas();
          if (!includeCancelled) {
            reservas = reservas.filter(r => r.status !== 'cancelada');
          }
        }

        res.json(reservas);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar reservas' });
      }
    }
  ],

  getReservaById: [
    validateId,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = res.locals.validatedId;
        const reserva: Reserva | null = await reservaService.getReservaById(id);
        
        if (!reserva) {
          res.status(404).json({ message: "Reserva não encontrada" });
          return;
        }
        
        res.json(reserva);
      } catch (error) {
        next(error);
      }
    }
  ],

  createReserva: [
    validate(reservaSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        const conflitos = await reservaService.verificarConflitoHorario({
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
        
        const reserva: Reserva = await reservaService.createReserva({
          ...req.body,
          data: dataReserva,
          horaInicio: inicio,
          horaFim: fim,
          status: 'pendente' // Define status padrão
        });
        
        res.status(201).json(reserva);
      } catch (error: any) {
        if (error.code === 'P2003') {
          res.status(400).json({ 
            message: "Erro ao criar reserva",
            details: "O ID do usuário fornecido não existe"
          });
        } else if (error.code === 'P2002') {
          res.status(409).json({ 
            message: "Erro ao criar reserva",
            details: "Conflito de horário com reserva existente"
          });
        } else {
          next(error);
        }
      }
    }
  ],

  updateReserva: [
    validateId,
    validate(reservaUpdateSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = res.locals.validatedId;
        console.log('[reservaController.updateReserva] id=', id, 'body=', req.body);
        const updateData = { ...req.body };


        const bodyKeys = Object.keys(req.body || {});
        const isStatusOnly = bodyKeys.length === 1 && bodyKeys[0] === 'status';
        if (isStatusOnly) {
          // valida status
          if (updateData.status && !STATUS_PERMITIDOS.includes(updateData.status)) {
            res.status(400).json({ 
              message: "Erro ao atualizar reserva",
              details: `Status inválido. Os status permitidos são: ${STATUS_PERMITIDOS.join(', ')}`
            });
            return;
          }
          try {
            const reserva: Reserva = await reservaService.updateReserva(id, { status: updateData.status });
            res.json(reserva);
            return;
          } catch (error: any) {
            console.error('[reservaController.updateReserva][status-only] error:', error);
            if (error.code === 'P2025') {
              res.status(404).json({ 
                message: "Reserva não encontrada",
                details: "O ID fornecido não corresponde a nenhuma reserva"
              });
              return;
            }
            next(error);
            return;
          }
        }

        // Busca a reserva existente
        const reservaExistente = await reservaService.getReservaById(id);
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
        const conflitos = await reservaService.verificarConflitoHorario({
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
        
        const reserva: Reserva = await reservaService.updateReserva(id, updateData);
        res.json(reserva);
      } catch (error: any) {
        console.error('[reservaController.updateReserva] error: ', error);
        if (error.code === 'P2025') {
          res.status(404).json({ 
            message: "Reserva não encontrada",
            details: "O ID fornecido não corresponde a nenhuma reserva"
          });
        } else if (error.code === 'P2002') {
          res.status(409).json({ 
            message: "Erro ao atualizar reserva",
            details: "Conflito de horário com reserva existente"
          });
        } else if (error.code === 'P2003') {
          res.status(400).json({ 
            message: "Erro ao atualizar reserva",
            details: "O ID do usuário fornecido não existe"
          });
        } else {
          next(error);
        }
      }
    }
  ],

  deleteReserva: [
    validateId,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = res.locals.validatedId;
        
        // Verifica se a reserva existe e se pode ser cancelada
        const reserva = await reservaService.getReservaById(id);
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
        await reservaService.updateReserva(id, { status: 'cancelada' });
        
        res.status(204).send();
      } catch (error: any) {
        if (error.code === 'P2025') {
          res.status(404).json({ 
            message: "Reserva não encontrada",
            details: "O ID fornecido não corresponde a nenhuma reserva"
          });
        } else {
          next(error);
        }
      }
    }
  ],

  purgeCancelled: [
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {

        const beforeQuery = typeof req.query.before === 'string' ? req.query.before : undefined;
        const beforeDate = beforeQuery ? new Date(beforeQuery) : undefined;
        const deleted = await reservaService.purgeCancelled(beforeDate);
        res.json({ deleted });
      } catch (error) {
        next(error);
      }
    }
  ],
};

export default reservaController;