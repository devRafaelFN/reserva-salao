import { Request, Response } from 'express';
import prisma from '../db/prisma';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Chave secreta para assinar o token JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email e senha são obrigatórios' 
    });
  }

  try {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }

    // Criar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      JWT_SECRET,
      { expiresIn: '24h' } // Token expira em 24 horas
    );

    // Retornar dados do usuário (sem a senha) e o token
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao processar o login' 
    });
  }
};

export const register = async (req: Request, res: Response) => {
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um usuário com este email'
      });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
        telefone,
        apartamento: parseInt(apartamento, 10),
      }
    });

    // Criar token JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email 
      }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar dados do usuário (sem a senha) e o token
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: userWithoutPassword,
      token
    });

  } catch (error: unknown) {
    console.error('Erro no registro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao registrar usuário';
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao registrar usuário',
      error: errorMessage
    });
  }
};
