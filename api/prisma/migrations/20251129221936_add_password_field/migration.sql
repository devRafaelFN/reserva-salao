-- Primeiro, adicionamos as colunas como NULLABLE
ALTER TABLE "users" 
ADD COLUMN "password" TEXT,
ADD COLUMN "atualizadoEm" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "criadoEm" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Atualizamos os registros existentes com valores padrão
UPDATE "users" SET 
  "password" = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: password
  "atualizadoEm" = CURRENT_TIMESTAMP,
  "criadoEm" = CURRENT_TIMESTAMP;

-- Agora alteramos as colunas para NOT NULL
ALTER TABLE "users" 
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "atualizadoEm" SET NOT NULL,
ALTER COLUMN "criadoEm" SET NOT NULL;
