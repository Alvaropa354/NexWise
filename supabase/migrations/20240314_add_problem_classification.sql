-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para categorías principales
CREATE TABLE IF NOT EXISTS problem_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES problem_categories(id),
    level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para etiquetas IA
CREATE TABLE IF NOT EXISTS ai_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para relación problemas-etiquetas
CREATE TABLE IF NOT EXISTS problem_ai_tags (
    problem_id UUID REFERENCES problems(id),
    tag_id UUID REFERENCES ai_tags(id),
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (problem_id, tag_id)
);

-- Tabla para filtros personalizados
CREATE TABLE IF NOT EXISTS user_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    filter_criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para clasificar problemas automáticamente
CREATE OR REPLACE FUNCTION classify_problem(problem_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    problem_record RECORD;
    impact_score INTEGER;
    urgency_score INTEGER;
    scope_level VARCHAR(50);
    classification VARCHAR(50);
BEGIN
    -- Obtener datos del problema
    SELECT * INTO problem_record
    FROM problems
    WHERE id = problem_id;

    -- Calcular puntuaciones
    impact_score := problem_record.impact_level;
    urgency_score := problem_record.urgency_level;
    scope_level := problem_record.scope;

    -- Clasificar según criterios
    IF impact_score >= 8 AND urgency_score >= 4 AND scope_level = 'Nacional' THEN
        classification := 'Crítico';
    ELSIF impact_score >= 6 AND urgency_score >= 3 AND scope_level = 'Regional' THEN
        classification := 'Relevante';
    ELSE
        classification := 'No Relevante';
    END IF;

    -- Actualizar clasificación
    UPDATE problems
    SET classification = classification,
        updated_at = NOW()
    WHERE id = problem_id;
END;
$$;

-- Políticas de seguridad
ALTER TABLE problem_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_ai_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_filters ENABLE ROW LEVEL SECURITY;

-- Políticas para problem_categories
CREATE POLICY "Anyone can view categories"
    ON problem_categories FOR SELECT
    USING (true);

-- Políticas para ai_tags
CREATE POLICY "Anyone can view AI tags"
    ON ai_tags FOR SELECT
    USING (true);

-- Políticas para problem_ai_tags
CREATE POLICY "Anyone can view problem AI tags"
    ON problem_ai_tags FOR SELECT
    USING (true);

-- Políticas para user_filters
CREATE POLICY "Users can manage their own filters"
    ON user_filters FOR ALL
    USING (user_id = auth.uid()); 