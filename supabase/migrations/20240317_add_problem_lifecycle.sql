-- Habilitar la extensión pgcrypto si no está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla para el estado del ciclo de vida
CREATE TABLE IF NOT EXISTS problem_lifecycle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    current_stage VARCHAR(50),
    validation_status VARCHAR(50),
    processing_status VARCHAR(50),
    publication_status VARCHAR(50),
    monitoring_status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para el historial de estados
CREATE TABLE IF NOT EXISTS problem_lifecycle_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    stage VARCHAR(50),
    status VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para métricas de seguimiento
CREATE TABLE IF NOT EXISTS problem_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    views_count INTEGER DEFAULT 0,
    interactions_count INTEGER DEFAULT 0,
    engagement_score DECIMAL(5,2),
    relevance_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar el estado del ciclo de vida
CREATE OR REPLACE FUNCTION update_problem_lifecycle(
    p_problem_id UUID,
    p_stage VARCHAR,
    p_status VARCHAR,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_history_id UUID;
BEGIN
    -- Actualizar el estado actual
    UPDATE problem_lifecycle
    SET 
        current_stage = p_stage,
        validation_status = CASE WHEN p_stage = 'validation' THEN p_status ELSE validation_status END,
        processing_status = CASE WHEN p_stage = 'processing' THEN p_status ELSE processing_status END,
        publication_status = CASE WHEN p_stage = 'publication' THEN p_status ELSE publication_status END,
        monitoring_status = CASE WHEN p_stage = 'monitoring' THEN p_status ELSE monitoring_status END,
        updated_at = NOW()
    WHERE problem_id = p_problem_id;

    -- Registrar en el historial
    INSERT INTO problem_lifecycle_history (
        problem_id,
        stage,
        status,
        details
    )
    VALUES (
        p_problem_id,
        p_stage,
        p_status,
        p_details
    )
    RETURNING id INTO v_history_id;

    RETURN v_history_id;
END;
$$;

-- Función para validar un problema
CREATE OR REPLACE FUNCTION validate_problem(p_problem_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_is_valid BOOLEAN;
BEGIN
    -- Aquí se implementaría la lógica de validación
    -- Por ejemplo, verificar que el título y la descripción no estén vacíos
    SELECT 
        CASE 
            WHEN title IS NOT NULL AND description IS NOT NULL THEN true
            ELSE false
        END INTO v_is_valid
    FROM problems
    WHERE id = p_problem_id;

    RETURN v_is_valid;
END;
$$;

-- Función para procesar un problema
CREATE OR REPLACE FUNCTION process_problem(p_problem_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_analysis_result JSONB;
BEGIN
    -- Aquí se implementaría la lógica de procesamiento
    -- Por ejemplo, análisis de viabilidad, generación de etiquetas, etc.
    v_analysis_result := jsonb_build_object(
        'viability_score', 0.8,
        'tags', ARRAY['tag1', 'tag2'],
        'market_potential', 0.7
    );

    RETURN v_analysis_result;
END;
$$;

-- Políticas de seguridad
ALTER TABLE problem_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_lifecycle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas para problem_lifecycle
CREATE POLICY "Users can view their own problem lifecycle"
    ON problem_lifecycle FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = problem_lifecycle.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para problem_lifecycle_history
CREATE POLICY "Users can view their own problem lifecycle history"
    ON problem_lifecycle_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = problem_lifecycle_history.problem_id
            AND problems.creator_id = auth.uid()
        )
    );

-- Políticas para problem_metrics
CREATE POLICY "Users can view their own problem metrics"
    ON problem_metrics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM problems
            WHERE problems.id = problem_metrics.problem_id
            AND problems.creator_id = auth.uid()
        )
    ); 