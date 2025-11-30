import { Request, Response, NextFunction } from "express";
import userService from "../services/userServices";
import { User } from "../generated/prisma";
import { userSchema, userUpdateSchema, idSchema } from "../validations/schemas";
import { validate, validateId } from "../utils/validation";

const userController = {
  getUsers: [
    async (req: Request, res: Response): Promise<void> => {
      const users: User[] = await userService.getUsers();
      res.json(users);
    }
  ],

  getUserById: [
    validateId,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = res.locals.validatedId;
        const user: User | null = await userService.getUserById(id);
        
        if (!user) {
          res.status(404).json({ message: "Usuário não encontrado" });
          return;
        }
        
        res.json(user);
      } catch (error) {
        next(error);
      }
    }
  ],

  createUser: [
    validate(userSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const userData = req.body;
        const user: User = await userService.createUser(userData);
        res.status(201).json(user);
      } catch (error: any) {
        if (error.code === 'P2002') { // Código de erro do Prisma para violação de chave única
          res.status(409).json({ 
            message: "Erro ao criar usuário",
            details: "O e-mail fornecido já está em uso"
          });
        } else {
          next(error);
        }
      }
    }
  ],

  updateUser: [
    validateId,
    validate(userUpdateSchema, 'body'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = res.locals.validatedId;
        const userData = req.body;
        
        const user: User = await userService.updateUser(id, userData);
        res.json(user);
      } catch (error: any) {
        if (error.code === 'P2025') { // Código de erro do Prisma para registro não encontrado
          res.status(404).json({ 
            message: "Usuário não encontrado",
            details: "O ID fornecido não corresponde a nenhum usuário"
          });
        } else if (error.code === 'P2002') { // Código de erro do Prisma para violação de chave única
          res.status(409).json({ 
            message: "Erro ao atualizar usuário",
            details: "O e-mail fornecido já está em uso por outro usuário"
          });
        } else {
          next(error);
        }
      }
    }
  ],

  deleteUser: [
    validateId,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const id = res.locals.validatedId;
        await userService.deleteUser(id);
        res.status(204).send();
      } catch (error: any) {
        if (error.code === 'P2025') { // Código de erro do Prisma para registro não encontrado
          res.status(404).json({ 
            message: "Usuário não encontrado",
            details: "O ID fornecido não corresponde a nenhum usuário"
          });
        } else {
          next(error);
        }
      }
    }
  ],
};

export default userController;