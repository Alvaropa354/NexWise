-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para estudios de mercado
CREATE TABLE IF NOT EXISTS market_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    market_size DECIMAL(15,2),
    target_audience JSONB,
    competition_analysis JSONB,
    demand_forecast JSONB,
    entry_barriers JSONB,
    location_recommendations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para competidores identificados
CREATE TABLE IF NOT EXISTS competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_study_id UUID REFERENCES market_studies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    market_share DECIMAL(5,2),
    strengths TEXT[],
    weaknesses TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para barreras de entrada
CREATE TABLE IF NOT EXISTS entry_barriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_study_id UUID REFERENCES market_studies(id),
    type VARCHAR(50) NOT NULL,
    description TEXT,
    impact_level INTEGER CHECK (impact_level BETWEEN 1 AND 5),
    mitigation_strategies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para recomendaciones de localización
CREATE TABLE IF NOT EXISTS location_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_study_id UUID REFERENCES market_studies(id),
    location VARCHAR(255) NOT NULL,
    market_potential DECIMAL(5,2),
    advantages TEXT[],
    disadvantages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para generar estudio de mercado
CREATE OR REPLACE FUNCTION generate_market_study(problem_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    study_id UUID;
BEGIN
    -- Crear el estudio de mercado
    INSERT INTO market_studies (problem_id)
    VALUES (problem_id)
    RETURNING id INTO study_id;

    -- Aquí se integraría la lógica de IA para analizar el problema
    -- y generar los datos del estudio

    RETURN study_id;
END;
$$;

-- Políticas de seguridad
ALTER TABLE market_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas para market_studies
CREATE POLICY "Users can view their own market studies"
    ON market_studies FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = market_studies.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para competitors
CREATE POLICY "Users can view competitors for their market studies"
    ON competitors FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM market_studies
            JOIN problems ON problems.id = market_studies.problem_id
            WHERE market_studies.id = competitors.market_study_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para entry_barriers
CREATE POLICY "Users can view entry barriers for their market studies"
    ON entry_barriers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM market_studies
            JOIN problems ON problems.id = market_studies.problem_id
            WHERE market_studies.id = entry_barriers.market_study_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para location_recommendations
CREATE POLICY "Users can view location recommendations for their market studies"
    ON location_recommendations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM market_studies
            JOIN problems ON problems.id = market_studies.problem_id
            WHERE market_studies.id = location_recommendations.market_study_id
            AND problems.creator_id = auth.uid()
        )
    ); 