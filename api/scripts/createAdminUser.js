// Importar o client gerado em src/generated/prisma (use Node.js-friendly output)
const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function createAdminUser() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin123'; // Senha padrão, deve ser alterada após o primeiro login
  
  try {
    // Verificar se o usuário admin já existe
    const existingAdmin = await prisma.user.findFirst({
      where: { email: adminEmail }
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    if (existingAdmin) {
      // Atualizar o usuário existente
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          nome: 'Administrador',
          telefone: '11999999999',
          apartamento: 1
        }
      });
      console.log('✅ Usuário admin atualizado com sucesso!');
    } else {
      // Criar um novo usuário admin
      await prisma.user.create({
        data: {
          nome: 'Administrador',
          email: adminEmail,
          password: hashedPassword,
          telefone: '11999999999',
          apartamento: 1
        }
      });
      console.log('✅ Usuário admin criado com sucesso!');
    }

    console.log('\n📋 Credenciais de acesso:');
    console.log('Email: admin@admin.com');
    console.log('Senha: admin123');
    console.log('\n⚠️ Lembre-se de alterar a senha após o primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro ao criar/atualizar usuário admin:', error);
  } finally {
    // Como estamos reutilizando o prisma compartilhado, desconectar apenas se existir a função
    if (prisma && prisma.$disconnect) await prisma.$disconnect();
  }
}

createAdminUser();
