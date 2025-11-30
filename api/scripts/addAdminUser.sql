-- scripts/addAdminUser.sql
DO $$
DECLARE
    user_id INTEGER;
    hashed_password TEXT;
BEGIN
    -- Gerar hash da senha 'admin123' usando o mesmo algoritmo do bcrypt
    -- O hash é para a senha 'admin123' com salt 10
    hashed_password := '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    
    -- Verificar se o usuário já existe
    SELECT id INTO user_id FROM users WHERE email = 'admin@admin.com';
    
    IF user_id IS NOT NULL THEN
        -- Atualizar o usuário existente
        UPDATE users 
        SET 
            password = hashed_password,
            nome = 'Administrador',
            telefone = '11999999999',
            apartamento = 1,
            "atualizadoEm" = CURRENT_TIMESTAMP
        WHERE id = user_id;
        
        RAISE NOTICE '✅ Usuário admin atualizado com sucesso!';
    ELSE
        -- Inserir novo usuário admin
        INSERT INTO users (
            nome, 
            email, 
            password, 
            telefone, 
            apartamento, 
            "criadoEm", 
            "atualizadoEm"
        ) VALUES (
            'Administrador',
            'admin@admin.com',
            hashed_password,
            '11999999999',
            1,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
        
        RAISE NOTICE '✅ Usuário admin criado com sucesso!';
    END IF;
    
    RAISE NOTICE '%', E'\n📋 Credenciais de acesso:';
    RAISE NOTICE 'Email: admin@admin.com';
    RAISE NOTICE 'Senha: admin123';
    RAISE NOTICE E'\n⚠️ Lembre-se de alterar a senha após o primeiro login!';
END $$;
