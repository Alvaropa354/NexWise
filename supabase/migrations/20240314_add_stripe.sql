-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para almacenar clientes de Stripe
CREATE TABLE IF NOT EXISTS stripe_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar métodos de pago
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    stripe_payment_method_id TEXT UNIQUE,
    type TEXT NOT NULL,
    last4 TEXT,
    brand TEXT,
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para crear un cliente de Stripe
CREATE OR REPLACE FUNCTION create_stripe_customer(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    customer_data JSON;
BEGIN
    -- Crear el cliente en Stripe (implementación simplificada)
    -- En producción, usar la API de Stripe
    customer_data := json_build_object(
        'id', gen_random_uuid(),
        'email', (SELECT email FROM auth.users WHERE id = user_id)
    );
    
    -- Guardar el cliente en la base de datos
    INSERT INTO stripe_customers (user_id, stripe_customer_id)
    VALUES (user_id, customer_data->>'id')
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN customer_data;
END;
$$;

-- Función para crear una suscripción
CREATE OR REPLACE FUNCTION create_subscription(
    user_id UUID,
    price_id TEXT,
    payment_method_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subscription_data JSON;
    customer_id TEXT;
BEGIN
    -- Obtener o crear el cliente de Stripe
    SELECT stripe_customer_id INTO customer_id
    FROM stripe_customers
    WHERE user_id = $1;
    
    IF customer_id IS NULL THEN
        SELECT stripe_customer_id INTO customer_id
        FROM create_stripe_customer($1);
    END IF;
    
    -- Crear la suscripción en Stripe (implementación simplificada)
    -- En producción, usar la API de Stripe
    subscription_data := json_build_object(
        'id', gen_random_uuid(),
        'customer_id', customer_id,
        'price_id', price_id,
        'status', 'active'
    );
    
    -- Guardar la suscripción en la base de datos
    INSERT INTO subscriptions (
        user_id,
        stripe_subscription_id,
        plan_type,
        price,
        status
    )
    VALUES (
        user_id,
        subscription_data->>'id',
        'premium',
        29.99,
        'active'
    );
    
    RETURN subscription_data;
END;
$$;

-- Función para cancelar una suscripción
CREATE OR REPLACE FUNCTION cancel_subscription(subscription_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    subscription_data JSON;
BEGIN
    -- Cancelar la suscripción en Stripe (implementación simplificada)
    -- En producción, usar la API de Stripe
    subscription_data := json_build_object(
        'id', subscription_id,
        'status', 'canceled'
    );
    
    -- Actualizar el estado en la base de datos
    UPDATE subscriptions
    SET status = 'canceled',
        updated_at = NOW()
    WHERE stripe_subscription_id = subscription_id;
    
    RETURN subscription_data;
END;
$$;

-- Función para actualizar el método de pago
CREATE OR REPLACE FUNCTION update_payment_method(
    subscription_id TEXT,
    payment_method_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    payment_data JSON;
BEGIN
    -- Actualizar el método de pago en Stripe (implementación simplificada)
    -- En producción, usar la API de Stripe
    payment_data := json_build_object(
        'subscription_id', subscription_id,
        'payment_method_id', payment_method_id,
        'status', 'updated'
    );
    
    RETURN payment_data;
END;
$$;

-- Función para obtener los métodos de pago
CREATE OR REPLACE FUNCTION get_payment_methods(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    payment_methods JSON;
BEGIN
    SELECT json_agg(json_build_object(
        'id', id,
        'type', type,
        'last4', last4,
        'brand', brand,
        'exp_month', exp_month,
        'exp_year', exp_year,
        'is_default', is_default
    ))
    INTO payment_methods
    FROM payment_methods
    WHERE user_id = $1;
    
    RETURN payment_methods;
END;
$$;

-- Función para eliminar un método de pago
CREATE OR REPLACE FUNCTION delete_payment_method(payment_method_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    payment_data JSON;
BEGIN
    -- Eliminar el método de pago en Stripe (implementación simplificada)
    -- En producción, usar la API de Stripe
    payment_data := json_build_object(
        'payment_method_id', payment_method_id,
        'status', 'deleted'
    );
    
    -- Eliminar el método de pago de la base de datos
    DELETE FROM payment_methods
    WHERE stripe_payment_method_id = payment_method_id;
    
    RETURN payment_data;
END;
$$;

-- Políticas de seguridad
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own Stripe customer data"
    ON stripe_customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only view their own payment methods"
    ON payment_methods FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own payment methods"
    ON payment_methods FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own payment methods"
    ON payment_methods FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own payment methods"
    ON payment_methods FOR DELETE
    USING (auth.uid() = user_id); 