-- Inserir usuário administrador
-- Este script adiciona um usuário administrador ao banco de dados
-- Execute este script usando o comando: psql -U user -d reservasalao -f scripts/create_admin_user.sql

INSERT INTO users (nome, email, telefone, apartamento)
VALUES ('Administrador', 'admin@admin.com', '11999999999', 1)
ON CONFLICT (email) DO NOTHING;

-- Verificar se o usuário foi criado
SELECT * FROM users WHERE email = 'admin@admin.com';
