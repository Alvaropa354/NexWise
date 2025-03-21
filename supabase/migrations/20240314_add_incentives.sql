-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para insignias
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para rangos de usuario
CREATE TABLE IF NOT EXISTS user_ranks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    required_points INTEGER NOT NULL,
    benefits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para insignias de usuario
CREATE TABLE IF NOT EXISTS user_badges (
    user_id UUID REFERENCES users(id),
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- Tabla para créditos canjeables
CREATE TABLE IF NOT EXISTS redeemable_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount INTEGER NOT NULL,
    source VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para bonificaciones por popularidad
CREATE TABLE IF NOT EXISTS popularity_bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    user_id UUID REFERENCES users(id),
    bonus_amount DECIMAL(10,2) NOT NULL,
    reason VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para eventos especiales
CREATE TABLE IF NOT EXISTS special_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    rewards JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para participación en eventos
CREATE TABLE IF NOT EXISTS event_participants (
    event_id UUID REFERENCES special_events(id),
    user_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id)
);

-- Función para calcular puntos totales de un usuario
CREATE OR REPLACE FUNCTION calculate_user_points(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_points INTEGER;
BEGIN
    SELECT COALESCE(SUM(b.points), 0)
    INTO total_points
    FROM user_badges ub
    JOIN badges b ON b.id = ub.badge_id
    WHERE ub.user_id = $1;

    RETURN total_points;
END;
$$;

-- Función para actualizar rango de usuario
CREATE OR REPLACE FUNCTION update_user_rank(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_points INTEGER;
    new_rank_id UUID;
BEGIN
    -- Obtener puntos del usuario
    SELECT calculate_user_points(user_id) INTO user_points;

    -- Obtener el rango correspondiente
    SELECT id INTO new_rank_id
    FROM user_ranks
    WHERE required_points <= user_points
    ORDER BY required_points DESC
    LIMIT 1;

    -- Actualizar rango del usuario
    UPDATE users
    SET rank_id = new_rank_id
    WHERE id = user_id;
END;
$$;

-- Políticas de seguridad
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ranks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE redeemable_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE popularity_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Políticas para badges
CREATE POLICY "Anyone can view badges"
    ON badges FOR SELECT
    USING (true);

-- Políticas para user_ranks
CREATE POLICY "Anyone can view user ranks"
    ON user_ranks FOR SELECT
    USING (true);

-- Políticas para user_badges
CREATE POLICY "Anyone can view user badges"
    ON user_badges FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own badges"
    ON user_badges FOR ALL
    USING (user_id = auth.uid());

-- Políticas para redeemable_credits
CREATE POLICY "Users can view their own credits"
    ON redeemable_credits FOR SELECT
    USING (user_id = auth.uid());

-- Políticas para popularity_bonuses
CREATE POLICY "Users can view their own bonuses"
    ON popularity_bonuses FOR SELECT
    USING (user_id = auth.uid());

-- Políticas para special_events
CREATE POLICY "Anyone can view special events"
    ON special_events FOR SELECT
    USING (true);

-- Políticas para event_participants
CREATE POLICY "Anyone can view event participants"
    ON event_participants FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own event participation"
    ON event_participants FOR ALL
    USING (user_id = auth.uid()); 