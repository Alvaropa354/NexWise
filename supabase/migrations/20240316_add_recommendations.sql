-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    interests TEXT[],
    skills TEXT[],
    experience_level VARCHAR(50),
    preferred_sectors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para interacciones de usuario
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    problem_id UUID REFERENCES problems(id),
    interaction_type VARCHAR(50),
    duration INTEGER,
    engagement_score INTEGER CHECK (engagement_score BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para recomendaciones
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    problem_id UUID REFERENCES problems(id),
    relevance_score DECIMAL(5,2),
    capacity_score DECIMAL(5,2),
    potential_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    recommendation_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para patrones de búsqueda
CREATE TABLE IF NOT EXISTS search_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    search_query TEXT,
    filters JSONB,
    result_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para calcular el score de matching
CREATE OR REPLACE FUNCTION calculate_matching_score(
    user_id UUID,
    problem_id UUID
)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    relevance_score DECIMAL;
    capacity_score DECIMAL;
    potential_score DECIMAL;
    total_score DECIMAL;
BEGIN
    -- Cálculo de relevancia (40%)
    SELECT COALESCE(
        (
            SELECT COUNT(*)::DECIMAL / 
                   (SELECT COUNT(*) FROM user_profiles WHERE user_profiles.user_id = $1)
            FROM user_profiles up
            JOIN problems p ON p.sector = ANY(up.preferred_sectors)
            WHERE up.user_id = $1 AND p.id = $2
        ),
        0
    ) INTO relevance_score;

    -- Cálculo de capacidad (30%)
    SELECT COALESCE(
        (
            SELECT COUNT(*)::DECIMAL / 
                   (SELECT COUNT(*) FROM user_profiles WHERE user_profiles.user_id = $1)
            FROM user_profiles up
            JOIN problems p ON p.required_skills && up.skills
            WHERE up.user_id = $1 AND p.id = $2
        ),
        0
    ) INTO capacity_score;

    -- Cálculo de potencial (30%)
    SELECT COALESCE(
        (
            SELECT p.potential_score::DECIMAL / 100
            FROM problems p
            WHERE p.id = $2
        ),
        0
    ) INTO potential_score;

    -- Cálculo del score total
    total_score := (relevance_score * 0.4) + (capacity_score * 0.3) + (potential_score * 0.3);

    RETURN total_score;
END;
$$;

-- Función para generar recomendaciones
CREATE OR REPLACE FUNCTION generate_recommendations(user_id UUID)
RETURNS UUID[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    recommendation_ids UUID[];
BEGIN
    -- Aquí se integraría la lógica de IA para generar recomendaciones
    -- basadas en el perfil del usuario, interacciones y patrones de búsqueda

    RETURN recommendation_ids;
END;
$$;

-- Políticas de seguridad
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_patterns ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view their own profiles"
    ON user_profiles FOR SELECT
    USING (user_id = auth.uid());

-- Políticas para user_interactions
CREATE POLICY "Users can view their own interactions"
    ON user_interactions FOR SELECT
    USING (user_id = auth.uid());

-- Políticas para recommendations
CREATE POLICY "Users can view their own recommendations"
    ON recommendations FOR SELECT
    USING (user_id = auth.uid());

-- Políticas para search_patterns
CREATE POLICY "Users can view their own search patterns"
    ON search_patterns FOR SELECT
    USING (user_id = auth.uid()); 