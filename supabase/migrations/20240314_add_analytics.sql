-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para almacenar análisis de mercado
CREATE TABLE IF NOT EXISTS market_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    market_size DECIMAL(15,2),
    market_potential INTEGER CHECK (market_potential BETWEEN 0 AND 100),
    urgency_level INTEGER CHECK (urgency_level BETWEEN 1 AND 5),
    implementation_complexity INTEGER CHECK (implementation_complexity BETWEEN 1 AND 5),
    roi_estimate DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar análisis de competencia
CREATE TABLE IF NOT EXISTS competition_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    competitor_name TEXT,
    market_share DECIMAL(5,2),
    strengths TEXT[],
    weaknesses TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar predicciones de demanda
CREATE TABLE IF NOT EXISTS demand_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    predicted_demand DECIMAL(10,2),
    confidence_level INTEGER CHECK (confidence_level BETWEEN 0 AND 100),
    timeframe_months INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar barreras de entrada
CREATE TABLE IF NOT EXISTS entry_barriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    barrier_type TEXT,
    description TEXT,
    impact_level INTEGER CHECK (impact_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar tendencias del sector
CREATE TABLE IF NOT EXISTS sector_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    trend_name TEXT,
    description TEXT,
    impact_level INTEGER CHECK (impact_level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para calcular el potencial total de un problema
CREATE OR REPLACE FUNCTION calculate_problem_potential(problem_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    market_potential INTEGER;
    urgency_weight INTEGER;
    complexity_weight INTEGER;
    total_potential INTEGER;
BEGIN
    -- Obtener el potencial de mercado
    SELECT market_potential INTO market_potential
    FROM market_analyses
    WHERE problem_id = $1;

    -- Obtener el nivel de urgencia
    SELECT urgency_level INTO urgency_weight
    FROM market_analyses
    WHERE problem_id = $1;

    -- Obtener la complejidad de implementación
    SELECT implementation_complexity INTO complexity_weight
    FROM market_analyses
    WHERE problem_id = $1;

    -- Calcular el potencial total
    total_potential := (
        (market_potential * 0.5) +
        (urgency_weight * 20 * 0.3) +
        ((6 - complexity_weight) * 20 * 0.2)
    );

    RETURN total_potential;
END;
$$;

-- Políticas de seguridad
ALTER TABLE market_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_barriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_trends ENABLE ROW LEVEL SECURITY;

-- Políticas para market_analyses
CREATE POLICY "Users can view market analyses for their problems"
    ON market_analyses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = market_analyses.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para competition_analyses
CREATE POLICY "Users can view competition analyses for their problems"
    ON competition_analyses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = competition_analyses.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para demand_predictions
CREATE POLICY "Users can view demand predictions for their problems"
    ON demand_predictions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = demand_predictions.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para entry_barriers
CREATE POLICY "Users can view entry barriers for their problems"
    ON entry_barriers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = entry_barriers.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para sector_trends
CREATE POLICY "Users can view sector trends for their problems"
    ON sector_trends FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = sector_trends.problem_id
            AND problems.creator_id = auth.uid()
        )
    ); 