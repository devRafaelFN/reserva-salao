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
const userServices_1 = __importDefault(require("../services/userServices"));
const schemas_1 = require("../validations/schemas");
const validation_1 = require("../utils/validation");
const userController = {
    getUsers: [
        (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield userServices_1.default.getUsers();
            res.json(users);
        })
    ],
    getUserById: [
        validation_1.validateId,
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = res.locals.validatedId;
                const user = yield userServices_1.default.getUserById(id);
                if (!user) {
                    res.status(404).json({ message: "Usuário não encontrado" });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        })
    ],
    createUser: [
        (0, validation_1.validate)(schemas_1.userSchema, 'body'),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const user = yield userServices_1.default.createUser(userData);
                res.status(201).json(user);
            }
            catch (error) {
                if (error.code === 'P2002') { // Código de erro do Prisma para violação de chave única
                    res.status(409).json({
                        message: "Erro ao criar usuário",
                        details: "O e-mail fornecido já está em uso"
                    });
                }
                else {
                    next(error);
                }
            }
        })
    ],
    updateUser: [
        validation_1.validateId,
        (0, validation_1.validate)(schemas_1.userUpdateSchema, 'body'),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = res.locals.validatedId;
                const userData = req.body;
                const user = yield userServices_1.default.updateUser(id, userData);
                res.json(user);
            }
            catch (error) {
                if (error.code === 'P2025') { // Código de erro do Prisma para registro não encontrado
                    res.status(404).json({
                        message: "Usuário não encontrado",
                        details: "O ID fornecido não corresponde a nenhum usuário"
                    });
                }
                else if (error.code === 'P2002') { // Código de erro do Prisma para violação de chave única
                    res.status(409).json({
                        message: "Erro ao atualizar usuário",
                        details: "O e-mail fornecido já está em uso por outro usuário"
                    });
                }
                else {
                    next(error);
                }
            }
        })
    ],
    deleteUser: [
        validation_1.validateId,
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = res.locals.validatedId;
                yield userServices_1.default.deleteUser(id);
                res.status(204).send();
            }
            catch (error) {
                if (error.code === 'P2025') { // Código de erro do Prisma para registro não encontrado
                    res.status(404).json({
                        message: "Usuário não encontrado",
                        details: "O ID fornecido não corresponde a nenhum usuário"
                    });
                }
                else {
                    next(error);
                }
            }
        })
    ],
};
exports.default = userController;
