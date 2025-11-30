// Script para criar um usuário administrador
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      create: {
        nome: 'Administrador',
        email: 'admin@admin.com',
        telefone: '11999999999',
        apartamento: 1,
      },
    });
    
    console.log('Usuário admin criado/atualizado com sucesso!');
    console.log('Detalhes do usuário:');
    console.log(`ID: ${admin.id}`);
    console.log(`Nome: ${admin.nome}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Telefone: ${admin.telefone}`);
    console.log(`Apartamento: ${admin.apartamento}`);
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
