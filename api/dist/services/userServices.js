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
const userService = {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findMany({
                include: { reservas: true }, // inclui as reservas do usuário
            });
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.findUnique({
                where: { id },
                include: { reservas: true },
            });
        });
    },
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = Object.assign(Object.assign({}, data), { password: data.password || 'senha_padrao' // Adiciona uma senha padrão se não for fornecida
             });
            return prisma_1.default.user.create({ data: userData });
        });
    },
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.update({
                where: { id },
                data,
            });
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Primeiro, exclui todas as reservas do usuário
            yield prisma_1.default.reserva.deleteMany({
                where: { userId: id }
            });
            // Depois, exclui o usuário
            yield prisma_1.default.user.delete({
                where: { id }
            });
        });
    },
};
exports.default = userService;
