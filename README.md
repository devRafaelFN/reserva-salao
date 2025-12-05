Reserva Salão
Sistema web para reserva de espaços/salões.

Tecnologias
Backend: Node.js, Express, Prisma, PostgreSQL
Frontend: React, Vite, Tailwind CSS
Banco de Dados: PostgreSQL (Docker)
Instalação
Backend (API)
cd api
npm install --legacy-peer-deps
npm run prisma:generate
npm run build
npm start
Frontend
cd frontend
npm install
npm run dev
Banco de Dados
cd api
docker-compose up -d
npx prisma migrate dev
Scripts Disponíveis
API
npm run dev - Desenvolvimento com ts-node
npm run build - Compilar TypeScript
npm start - Iniciar servidor
npm run prisma:migrate - Rodar migrações
Frontend
npm run dev - Desenvolvimento com Vite
npm run build - Build para produção
npm run lint - Verificar código
Variáveis de Ambiente
Crie .env em cada pasta:

api/.env

DATABASE_URL="postgresql://user:mypassword@localhost:5432/reservasalao?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
