
import prisma from "../db/prisma";
import { User } from "../generated/prisma";

const userService = {
  async getUsers(): Promise<User[]> {
    return prisma.user.findMany({
      include: { reservas: true }, // inclui as reservas do usuário
    });
  },

  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { reservas: true },
    });
  },

  async createUser(data: {
    nome: string;
    email: string;
    telefone: string;
    apartamento: number;
    password?: string;
  }): Promise<User> {
    const userData = {
      ...data,
      password: data.password || 'senha_padrao' // Adiciona uma senha padrão se não for fornecida
    };
    return prisma.user.create({ data: userData });
  },

  async updateUser(
    id: number,
    data: {
      nome?: string;
      email?: string;
      telefone?: string;
      apartamento?: number;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async deleteUser(id: number): Promise<void> {
    // Primeiro, exclui todas as reservas do usuário
    await prisma.reserva.deleteMany({
      where: { userId: id }
    });
    
    // Depois, exclui o usuário
    await prisma.user.delete({ 
      where: { id } 
    });
  },
};

export default userService;
