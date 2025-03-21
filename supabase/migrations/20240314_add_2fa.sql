-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para almacenar secretos 2FA
CREATE TABLE IF NOT EXISTS user_2fa (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    secret TEXT NOT NULL,
    enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para habilitar 2FA
CREATE OR REPLACE FUNCTION enable_2fa(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    secret_key TEXT;
    qr_code TEXT;
BEGIN
    -- Generar una clave secreta aleatoria
    secret_key := encode(gen_random_bytes(32), 'base64');
    
    -- Insertar o actualizar el registro
    INSERT INTO user_2fa (user_id, secret)
    VALUES (user_id, secret_key)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        secret = EXCLUDED.secret,
        enabled = false,
        updated_at = NOW();
    
    -- Generar código QR (simulado)
    qr_code := 'otpauth://totp/NexWise:' || user_id || '?secret=' || secret_key;
    
    RETURN json_build_object(
        'secret', secret_key,
        'qrCode', qr_code
    );
END;
$$;

-- Función para verificar 2FA
CREATE OR REPLACE FUNCTION verify_2fa(user_id UUID, token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_secret TEXT;
BEGIN
    -- Obtener el secreto del usuario
    SELECT secret INTO user_secret
    FROM user_2fa
    WHERE user_id = $1;
    
    -- Verificar el token (implementación simplificada)
    -- En producción, usar una biblioteca TOTP apropiada
    IF user_secret IS NOT NULL THEN
        -- Habilitar 2FA si la verificación es exitosa
        UPDATE user_2fa
        SET enabled = true,
            updated_at = NOW()
        WHERE user_id = $1;
        
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$;

-- Función para deshabilitar 2FA
CREATE OR REPLACE FUNCTION disable_2fa(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE user_2fa
    SET enabled = false,
        secret = NULL,
        updated_at = NOW()
    WHERE user_id = $1;
END;
$$;

-- Políticas de seguridad
ALTER TABLE user_2fa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own 2FA settings"
    ON user_2fa FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only update their own 2FA settings"
    ON user_2fa FOR UPDATE
    USING (auth.uid() = user_id); 