"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
// Chave secreta para assinar o token JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email e senha são obrigatórios'
        });
    }
    try {
        // Buscar usuário pelo email
        const user = yield prisma_1.default.user.findUnique({
            where: { email }
        });
        // Verificar se o usuário existe
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }
        // Verificar a senha
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas'
            });
        }
        // Criar token JWT
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, JWT_SECRET, { expiresIn: '24h' } // Token expira em 24 horas
        );
        // Retornar dados do usuário (sem a senha) e o token
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar o login'
        });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, password, telefone, apartamento } = req.body;
    // Validar campos obrigatórios
    if (!nome || !email || !password || !telefone || !apartamento) {
        return res.status(400).json({
            success: false,
            message: 'Todos os campos são obrigatórios (nome, email, senha, telefone, apartamento)'
        });
    }
    try {
        // Verificar se o usuário já existe
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Já existe um usuário com este email'
            });
        }
        // Criptografar a senha
        const hashedPassword = yield bcrypt.hash(password, 10);
        // Criar novo usuário
        const newUser = yield prisma_1.default.user.create({
            data: {
                nome,
                email,
                password: hashedPassword,
                telefone,
                apartamento: parseInt(apartamento, 10),
            }
        });
        // Criar token JWT
        const token = jwt.sign({
            id: newUser.id,
            email: newUser.email
        }, JWT_SECRET, { expiresIn: '24h' });
        // Retornar dados do usuário (sem a senha) e o token
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error('Erro no registro:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao registrar usuário';
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário',
            error: errorMessage
        });
    }
});
exports.register = register;
